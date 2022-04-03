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
    const { id } = req.body;
    const ref = await db.collection('categorias').doc(id);
    // Update the category name
    await ref.delete();
    await res.unstable_revalidate('/');
    res.status(200).json({ status: 200 });
}
