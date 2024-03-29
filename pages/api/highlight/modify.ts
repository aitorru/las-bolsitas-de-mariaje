import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';
import { Item } from '../../../utils/types/types';

export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const { p1, p2, p3, p4, p5, p6 }: 
        {p1: Item, p2: Item, p3: Item, p4: Item, p5: Item, p6: Item } 
        = req.body;
    // Make it simpler making it an array
    const clientData = [p1, p2, p3, p4, p5, p6];
    let index = 0;
    const snapshot = await db.collection('highlight').orderBy('pos').get();
    const updatable: {id: string, refID: string}[] = [];
    snapshot.forEach((doc) => {
        // Check if the id in the db is the same as in the client.
        if(doc.data().refID !== clientData[index].id){
            updatable.push({
                id: doc.id,
                refID: clientData[index].id
            });
        }
        index++;
    });
    // Multi task trick
    await Promise.all(updatable.map(async (up) => {
        const ref =  db.collection('highlight').doc(up.id);
        await ref.update({refID: up.refID});
    }));
    res.status(200).json({ status: 200 });
}
