import type { NextApiRequest, NextApiResponse } from 'next';
import db, { bucket } from '../../utils/db';
import { Item } from '../../utils/types/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.body;
    const ref = db.collection('articulos').doc(id);
    const doc = await ref.get();
    const { image } = doc.data() as Item;
    // # console.log(doc.data());
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
    res.status(200).json({ status: 200 });
}
