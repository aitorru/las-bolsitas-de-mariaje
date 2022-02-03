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
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const app: any = getAppCookies(req);
    const { token } = app;
    if (token === undefined) {
        res.status(400).json({ status: 400 });
    } else {
        const profile = token ? verifyToken(token.split(' ')[1]) : '';
        if(profile === '') {
            res.status(400).json({ status: 400 });
        }
        const form = new formidable.IncomingForm();
        form.on('error', console.error );
        form.parse(req, function (err, fields, files: any) {
            if(err) console.log(err);
            bucket.file(files.image.originalFilename).save(fs.readFileSync(files.image.filepath));
            db.collection('articulos').add({image: 'gs://las-bolsitas-de-mariaje.appspot.com/' + files.image.originalFilename, nombre: fields.name, categoria: fields.category});
        });
        res.status(200).json({ status: 200 });
    }
}
