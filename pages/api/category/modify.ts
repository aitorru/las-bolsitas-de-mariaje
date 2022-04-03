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
    const { origin, destination } = req.body;
    const ref = await db.collection('categorias').doc(origin);
    // Update the category name
    await ref.update({nombre: destination});
    await res.unstable_revalidate('/');
    res.status(200).json({ status: 200 });
    
}
