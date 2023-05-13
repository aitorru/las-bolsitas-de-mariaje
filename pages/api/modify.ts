/* eslint-disable no-async-promise-executor */
import formidable from 'formidable';
import fs from 'fs';
import db, { bucket } from '../../utils/db/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Item } from '../../utils/types/types';
import Jimp from 'jimp';

export const config = {
    api: {
        bodyParser: false,
        json: {limit: '50mb', extended: true},
        urlencoded: {limit: '50mb', extended: true},
    },
};

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    return await new Promise((resolve) => {
        const form = new formidable.IncomingForm();
        form.on('error', console.error);
        form.parse(req, 
            async function 
            (err: string, fields: formidable.Fields, files: any) {
                //if (err) # console.log(err);
                const ref = db.collection('articulos').doc(fields.id as string);
                const doc = await ref.get();
                const { 
                    categoria,
                    image,
                    precio,
                    descripcion,
                } = doc.data() as Item;
                if (fields.name !== '') {
                    // If name is changed, update c p.
                    const name = fields.name as string;
                    ref.update({nombre: name.replace('/', '')});
                }
                if(fields.category !== categoria) {
                    ref.update({categoria: fields.category});
                }
                if(fields.price !== precio && fields.price !== '') {
                    ref.update({precio: fields.price});
                }
                if(fields.descripcion !== descripcion) {
                    ref.update({descripcion: fields.descripcion});
                }
                if(Object.keys(files).length !== 0) {
                    // Get rid of gs://las-bolsitas-de-mariaje.appspot.com/ 61qv3+vfz3L._AC_UX385_.jpg
                    const sliced = image.split('/');
                    // Operate as normal
                    const file = bucket.file(files.image.originalFilename);

                    const [url, blur] = await Promise.all(
                        [
                            file.getSignedUrl({action: 'read', expires: '03-09-2491'}),
                            blurAndScaleDown(files.image.filepath),
                            file.save(files.image.filepath),
                        ]
                    );
                    try {
                        await bucket
                            .file(sliced[sliced.length - 1]).delete();
                    } catch (error) {
                        console.error(error);
                    }
                    await bucket
                        .file(files.image.originalFilename)
                        .save(fs.readFileSync(files.image.filepath));
                    // Update firebase to end
                    ref.update({
                        image: 'gs://las-bolsitas-de-mariaje.appspot.com/' + files.image.originalFilename,
                        imageUrl: url[0],
                        blur: blur,
                    });
                }
                res.status(200).json({ status: 200, data: doc.data() });
                return resolve('ok');
            });
    });
}

async function blurAndScaleDown(path: string): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const image = await Jimp.read(path);
            image.resize(image.getWidth() / 5, image.getHeight() / 5);
            image.quality(30);
            image.blur(10);
            image.getBase64(Jimp.MIME_JPEG, (err, base64) => {
                if(err) reject(err);
                resolve(base64);
            });
        } catch (error) {
            reject(error);
        }
        
    });
    
}
