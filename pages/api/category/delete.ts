
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';


export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;
    const ref = await db.collection('categorias').doc(id);
    // Update the category name
    await ref.delete();
    res.status(200).json({ status: 200 });
}
