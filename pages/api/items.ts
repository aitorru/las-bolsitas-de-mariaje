// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db/index'

type Data = {
  payload: string
}

type Item = {
    nombre: string,
    image: string,
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    const snapshot = await db.collection('articulos').get()
    let DATA: Item[] = []
    snapshot.forEach(doc => {
        console.log(doc.data())
        DATA.push({
            nombre: doc.data().nombre,
            image: doc.data().image
        })
    })
    res.status(200).json({ payload: JSON.stringify(DATA) })
}
