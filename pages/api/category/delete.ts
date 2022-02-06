/* middleware */
import {
    getAppCookies,
    verifyToken
} from '../../../middleware/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import db, { bucket } from '../../../utils/db';

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
        const ref = await db.collection('categorias').doc(id);
        // Update the category name
        await ref.delete();
        res.status(200).json({ status: 200 });
    }
}