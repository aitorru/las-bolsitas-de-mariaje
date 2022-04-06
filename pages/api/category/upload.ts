import type { NextApiRequest, NextApiResponse } from 'next';
import db  from '../../../utils/db';

export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.body;
    await db.collection('categorias').add({nombre: name});
    res.status(200).json({ status: 200 });
}
