/* eslint-disable no-async-promise-executor */
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
  await new Promise((resolve) => {
    const form = new formidable.IncomingForm();
    form.on("error", console.error);
    form.parse(req, async function (err, fields, files: any) {
      // if (err) # console.log(err);
      if (fields.id === undefined) {
        res.status(400).json({ status: 400, message: "id is required" });
        return resolve("ok");
      }
      if (typeof fields.id !== "string") {
        res.status(400).json({ status: 400, message: "id must be a string" });
        return resolve("ok");
      }
      const ref = db.collection("carousel").doc(fields.id as string);
      const doc = await ref.get();
      const {
        image,
      } = doc.data() as Carousel;
      if (Object.keys(files).length !== 0) {
        // Get rid of gs://las-bolsitas-de-mariaje.appspot.com/ 61qv3+vfz3L._AC_UX385_.jpg
        const sliced = image.split("/");
        const file = bucket.file(files.image.originalFilename);
        // Operate as normal
        const [url, blur] = await Promise.all(
          [
            file.getSignedUrl({ action: "read", expires: "03-09-2491" }),
            blurAndScaleDown(files.image.filepath),
            file.save(fs.readFileSync(files.image.filepath)),
          ],
        );
        // Delete the old image but do not fail if it doesn not exists
        try {
          bucket.file(sliced[sliced.length - 1]).delete();
        } catch (error) {
          console.error(error);
        }
        // Update firebase to end
        ref.update({
          image: "gs://las-bolsitas-de-mariaje.appspot.com/" +
            files.image.originalFilename,
          imageUrl: url[0],
          blur: blur,
        });
      }
      res.status(200).json({ status: 200 });
      return resolve("ok");
    });
  });
}

async function blurAndScaleDown(path: string): Promise<string> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const image = await Jimp.read(path);
      // TODO: Find the right values
      image.resize(image.getWidth() / 5, image.getHeight() / 5);
      image.quality(30);
      image.blur(10);
      image.getBase64(Jimp.MIME_JPEG, (err, base64) => {
        if (err) reject(err);
        resolve(base64);
      });
    } catch (error) {
      reject(error);
    }
  });
}
