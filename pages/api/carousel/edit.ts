import formidable from "formidable";
import fs from "fs";
import db, { bucket } from "../../../utils/db/index";
import type { NextApiRequest, NextApiResponse } from "next";
import { Carousel } from "../../../utils/types/types";
import Jimp from "jimp";

export const config = {
  api: {
    bodyParser: false,
    json: { limit: "50mb", extended: true },
    urlencoded: { limit: "50mb", extended: true },
  },
};

async function validateId(id: any): Promise<string> {
  if (!id) {
    throw { status: 400, message: "ID is required" };
  }
  if (typeof id !== "string") {
    throw { status: 400, message: "ID must be a string" };
  }
  return id;
}

async function getCarouselItem(id: string) {
  const ref = db.collection("carousel").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    throw { status: 404, message: "Document not found" };
  }
  return { ref, data: doc.data() as Carousel };
}

async function processImage(files: formidable.Files, imagePath: string) {
  const imageFile = files.image as formidable.File | undefined;

  if (!imageFile) {
    throw { status: 400, message: "Image file is required" };
  }

  const newFilename = imageFile.originalFilename as string;
  const file = bucket.file(newFilename);

  await file.save(fs.readFileSync(imageFile.filepath));
  console.log("File saved to storage");

  const [url] = await file.getSignedUrl({ action: "read", expires: "03-09-2491" });
  console.log("Signed URL:", url);

  const blur = await blurAndScaleDown(imageFile.filepath);
  console.log("Blur image generated");

  const sliced = imagePath.split("/");
  const oldFilename = sliced[sliced.length - 1];

  await bucket.file(oldFilename).delete();
  console.log("Old image deleted");

  return {
    image: "gs://las-bolsitas-de-mariaje.appspot.com/" + newFilename,
    imageUrl: url,
    blur: blur,
  };
}

async function blurAndScaleDown(imagePath: string): Promise<string> {
  try {
    const image = await Jimp.read(imagePath);
    image.resize(image.getWidth() / 5, image.getHeight() / 5);
    image.quality(30);
    image.blur(10);

    const base64 = await image.getBase64Async(Jimp.MIME_JPEG);
    return base64;
  } catch (error: any) {
    console.error("Error in blurAndScaleDown:", error);
    throw new Error(`Error processing image: ${error.message}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const form = new formidable.IncomingForm();
    const [fields, files] = await form.parse(req);

    console.log("Fields:", fields);
    console.log("Files:", files);

    const id = await validateId(fields.id);
    const { ref, data } = await getCarouselItem(id);
    const { image } = data;

    if (Object.keys(files).length !== 0) {
      console.log("Processing image upload");
      try {
        const updateData = await processImage(files, image);
        await ref.update(updateData);
        console.log("Firestore document updated");
      } catch (processError: any) {
        console.error("Error processing image:", processError);
        return res
          .status(processError.status || 500)
          .json({ status: processError.status || 500, message: processError.message || "Failed to process image" });
      }
    } else {
      console.log("No files uploaded");
    }

    console.log("Update successful");
    return res.status(200).json({ status: 200 });

  } catch (error: any) {
    console.error("Handler error:", error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(status).json({ status, message });
  }
}
