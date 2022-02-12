/* eslint-disable no-async-promise-executor */
import { getAppCookies, verifyToken } from '../../middleware/utils';
import formidable from 'formidable';
import fs from 'fs';
import db, { bucket } from '../../utils/db/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Item } from '../../utils/types/types';

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
    try {
        await new Promise((resolve, reject) => {
            const app: any = getAppCookies(req);
            const { token } = app;
            if (token === undefined) {
                res.status(400).json({ status: 400 });
                return reject();
            } else {
                const profile = token ? verifyToken(token.split(' ')[1]) : '';
                if (profile === '') {
                    res.status(400).json({ status: 400 });
                    return reject();
                }
                const form = new formidable.IncomingForm();
                form.on('error', console.error);
                form.parse(req, async function (err, fields, files: any) {
                    if (err) console.log(err);
                    const ref = db.collection('articulos').doc(fields.id as string);
                    const doc = await ref.get();
                    const { 
                        categoria,
                        image,
                        precio,
                        descripcion
                    } = doc.data() as Item;
                    console.log(fields, doc.data());
                    if (fields.name !== '') {
                        console.log('Updating name...');
                        ref.update({nombre: fields.name});
                    }
                    if(fields.category !== categoria) {
                        console.log('Updating category...');
                        ref.update({categoria: fields.category});
                    }
                    if(fields.price !== precio && fields.price !== '') {
                        console.log('Updating price');
                        ref.update({precio: fields.price});
                    }
                    if(fields.descripcion !== descripcion) {
                        console.log('Updating description');
                        ref.update({descripcion: fields.descripcion});
                    }
                    if(Object.keys(files).length !== 0) {
                        console.log('Updating image...');
                        // Get rid of gs://las-bolsitas-de-mariaje.appspot.com/ 61qv3+vfz3L._AC_UX385_.jpg
                        const sliced = image.split('/');
                        // Operate as normal
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
                        ref.update({image: 'gs://las-bolsitas-de-mariaje.appspot.com/' + files.image.originalFilename});
                    }
                    res.status(200).json({ status: 200, data: doc.data() });
                    return resolve('ok');
                });
            }
        });
        return console.log;
    } catch (err_1) {
        return console.error;
    }

}