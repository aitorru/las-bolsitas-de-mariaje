/* middleware */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    await res.revalidate(req.body.route);
    res.json({'status': 200});
}
