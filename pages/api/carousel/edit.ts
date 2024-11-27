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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const form = new formidable.IncomingForm();
    const { fields, files } = await form.parse(req);
    console.log("Fields:", fields);
    console.log("Files:", files);

    if (!fields.id) {
      console.error("ID is required");
      return res.status(400).json({ status: 400, message: "id is required" });
    }
    if (typeof fields.id !== "string") {
      console.error("ID must be a string");
      return res.status(400).json({ status: 400, message: "id must be a string" });
    }

    const ref = db.collection("carousel").doc(fields.id);
    const doc = await ref.get();
    if (!doc.exists) {
      console.error("Document not found");
      return res.status(404).json({ status: 404, message: "Document not found" });
    }
    const { image } = doc.data() as Carousel;

    if (Object.keys(files).length !== 0) {
      console.log("Processing image upload");
      // Obtener el nombre de archivo actual
      const sliced = image.split("/");
      const oldFilename = sliced[sliced.length - 1];
      console.log("Old image filename:", oldFilename);

      const newFilename = files.image.originalFilename;
      console.log("New image filename:", newFilename);
      const file = bucket.file(newFilename);

      try {
        // Guardar el nuevo archivo
        await file.save(fs.readFileSync(files.image.filepath));
        console.log("File saved to storage");

        // Generar URL firmada
        const [url] = await file.getSignedUrl({ action: "read", expires: "03-09-2491" });
        console.log("Signed URL:", url);

        // Generar imagen borrosa
        const blur = await blurAndScaleDown(files.image.filepath);
        console.log("Blur image generated");

        // Eliminar la imagen antigua
        await bucket.file(oldFilename).delete();
        console.log("Old image deleted");

        // Actualizar documento en Firebase
        await ref.update({
          image: "gs://las-bolsitas-de-mariaje.appspot.com/" + newFilename,
          imageUrl: url,
          blur: blur,
        });
        console.log("Firestore document updated");
      } catch (error) {
        console.error("Error processing image:", error);
        return res.status(500).json({ status: 500, message: "Error processing image" });
      }
    } else {
      console.log("No files uploaded");
    }

    console.log("Update successful");
    return res.status(200).json({ status: 200 });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
}

async function blurAndScaleDown(path: string): Promise<string> {
  try {
    const image = await Jimp.read(path);
    // Ajustar los valores según sea necesario
    image.resize(image.getWidth() / 5, image.getHeight() / 5);
    image.quality(30);
    image.blur(10);

    const base64 = await image.getBase64Async(Jimp.MIME_JPEG);
    return base64;
  } catch (error) {
    console.error("Error in blurAndScaleDown:", error);
    throw error;
  }
}
