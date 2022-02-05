/* middleware */
import {
    getAppCookies,
    verifyToken
} from '../../middleware/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import db, { bucket } from '../../utils/db';

type Item = {
    image: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const app: any = getAppCookies(req);
    const { token } = app;
    if (token === undefined) {
        res.status(400).json({ status: 400, message: 'Token undefined' });
    } else {
        const profile = token ? verifyToken(token.split(' ')[1]) : '';
        if (profile === '') {
            res.status(400).json({ status: 400 });
            return;
        }
        const { id } = req.body;
        const ref = db.collection('articulos').doc(id);
        const doc = await ref.get();
        const { image } = doc.data() as Item;
        console.log(doc.data());
        // Get rid of gs://las-bolsitas-de-mariaje.appspot.com/ 61qv3+vfz3L._AC_UX385_.jpg
        const sliced = image.split('/');
        // Operate as normal
        try {
            await bucket.file(sliced[sliced.length - 1]).delete();
        } catch (error) {
            console.error(error);
        }
        try {
            await ref.delete();
        } catch (error) {
            console.error(error);
        }
        res.status(200).json({ status: 200, message: profile });
    }
}