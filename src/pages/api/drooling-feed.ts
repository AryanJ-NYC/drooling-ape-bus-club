import { NextApiHandler } from 'next';
import { SanityClient } from '../../sanity/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  const nameToImage = apes
    .filter((a) => a.xchainUrl)
    .reduce((o, ape) => ({ ...o, [ape.name]: sanity.urlForImageSource(ape.image).url() }), {});
  return res.json(nameToImage);
};

export default handler;
