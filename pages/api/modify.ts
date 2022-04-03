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
    return await new Promise((resolve) => {
        const form = new formidable.IncomingForm();
        form.on('error', console.error);
        form.parse(req, 
            async function 
            (err: string, fields: formidable.Fields, files: any) {
                if (err) console.log(err);
                const ref = db.collection('articulos').doc(fields.id as string);
                const doc = await ref.get();
                const { 
                    categoria,
                    image,
                    precio,
                    descripcion,
                    nombre,
                } = doc.data() as Item;
                console.log(fields, doc.data());
                if (fields.name !== '') {
                // If name is changed, update c p.
                    console.log('Updating name...');
                    ref.update({nombre: fields.name});
                    await res.unstable_revalidate('/c/' + categoria);
                }
                if(fields.category !== categoria) {
                    console.log('Updating category...');
                    ref.update({categoria: fields.category});
                    await res.unstable_revalidate('/c/' + categoria);
                    await res.unstable_revalidate('/c/' + fields.category);
                }
                if(fields.price !== precio && fields.price !== '') {
                    console.log('Updating price');
                    ref.update({precio: fields.price});
                    await res.unstable_revalidate('/p/' + nombre);
                }
                if(fields.descripcion !== descripcion) {
                    console.log('Updating description');
                    ref.update({descripcion: fields.descripcion});
                    await res.unstable_revalidate('/p/' + nombre);
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
                    await res.unstable_revalidate('/p/' + nombre);
                }
                res.status(200).json({ status: 200, data: doc.data() });
                return resolve('ok');
            });
    });
}
