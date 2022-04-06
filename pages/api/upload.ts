import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import db, { bucket } from '../../utils/db/index';
import fs from 'fs';
import Jimp from 'jimp';

type Data = {
    status: number
}
export const config = {
    api: {
        bodyParser: false,
        json: {limit: '50mb', extended: true},
        urlencoded: {limit: '50mb', extended: true},
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    return new Promise((resolve) => {
        const form = new formidable.IncomingForm();
        form.on('error', console.error );
        form.parse(req, async function (err, fields, files: any) {
            if(err) console.log(err);
            const file = bucket.file(files.image.originalFilename);
            const fileToSave = file.save(fs.readFileSync(files.image.filepath));
            const [url, plaiceholder] = await Promise.all(
                [
                    file.getSignedUrl({action: 'read', expires: '03-09-2491'}), 
                    blurAndScaleDown(files.image.filepath)
                ]
            );
            const docToAdd = db.collection('articulos')
                .add(
                    {
                        image: 'gs://las-bolsitas-de-mariaje.appspot.com/' + files.image.originalFilename,
                        imageUrl: url,
                        blur: plaiceholder,
                        nombre: fields.name,
                        categoria: fields.category,
                        precio: fields.price,
                        descripcion: fields.descripcion,
                    }
                );
            await Promise.all([fileToSave, docToAdd]);
            res.status(200).json({ status: 200 });
            return resolve('ok');
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
            image.gaussian(10);
            image.getBase64(Jimp.MIME_JPEG, (err, base64) => {
                if(err) reject(err);
                resolve(base64);
            });
        } catch (error) {
            reject(error);
        }
        
    });
    
}
