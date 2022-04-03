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
        const { origin, destination } = req.body;
        const ref = await db.collection('categorias').doc(origin);
        // Update the category name
        await ref.update({nombre: destination});
        await res.unstable_revalidate('/');
        res.status(200).json({ status: 200 });
    }
}
