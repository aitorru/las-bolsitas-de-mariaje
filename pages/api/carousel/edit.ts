/* eslint-disable no-async-promise-executor */
import { getAppCookies, verifyToken } from '../../../middleware/utils';
import formidable from 'formidable';
import fs from 'fs';
import db, { bucket } from '../../../utils/db/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Carousel } from '../../../utils/types/types';

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
    await new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.on('error', console.error);
        form.parse(req, async function (err, fields, files: any) {
            if (err) console.log(err);
            const ref = db.collection('carousel').doc(fields.id as string);
            const doc = await ref.get();
            const {
                image,
            } = doc.data() as Carousel;
            console.log(fields, doc.data());
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
            await res.unstable_revalidate('/');
            res.status(200).json({ status: 200 });
            return resolve('ok');
        });
    }); 
}
