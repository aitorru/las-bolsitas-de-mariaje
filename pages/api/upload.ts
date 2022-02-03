import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import db, { bucket } from '../../utils/db/index';
import fs from 'fs';
import { getAppCookies, verifyToken } from '../../middleware/utils';

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
    return new Promise((resolve, reject) => {
        const app: any = getAppCookies(req);
        const { token } = app;
        if (token === undefined) {
            res.status(400).json({ status: 400 });
            return reject();
        } else {
            const profile = token ? verifyToken(token.split(' ')[1]) : '';
            if(profile === '') {
                res.status(400).json({ status: 400 });
                return reject();
            }
            const form = new formidable.IncomingForm();
            form.on('error', console.error );
            form.parse(req, async function (err, fields, files: any) {
                if(err) console.log(err);
                await bucket.file(files.image.originalFilename).save(fs.readFileSync(files.image.filepath));
                await db.collection('articulos').add({image: 'gs://las-bolsitas-de-mariaje.appspot.com/' + files.image.originalFilename, nombre: fields.name, categoria: fields.category});
                res.status(200).json({ status: 200 });
                return resolve('ok');
            });
        }
    }).then(() => console.log).catch(err => console.error);
    
}
