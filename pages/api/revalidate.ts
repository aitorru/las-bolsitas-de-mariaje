/* middleware */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    console.log('Revalidating: ' + req.body.route);
    await res.unstable_revalidate(req.body.route);
    res.json({'status': 200});
}
