import { NextApiHandler } from 'next';
import { SanityClient } from '../../sanity/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  const nameToImage = apes.reduce((o, ape) => ({ ...o, [ape.name]: ape.imageUrl }), {});
  return res.json(nameToImage);
};

export default handler;
