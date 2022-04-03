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
    const { name } = req.body;
    await db.collection('categorias').add({nombre: name});
    await res.unstable_revalidate('/');
    res.status(200).json({ status: 200 });
}
