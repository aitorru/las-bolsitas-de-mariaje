import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';

export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    const { origin, destination } = req.body;
    const ref = await db.collection('categorias').doc(origin);
    // Update the category name
    await ref.update({nombre: destination});
    res.status(200).json({ status: 200 });
    
}
