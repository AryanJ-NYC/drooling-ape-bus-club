import { NextApiHandler } from 'next';
import { SanityClient } from '../../sanity/client';

const handler: NextApiHandler = async (_, res) => {
  const sanity = new SanityClient();
  const assets = await sanity.getApes();
  const massagedAssets = assets.reduce(
    (prev, asset, i) => ({
      ...prev,
      [asset.name]: {
        artists: asset.artists,
        asset: asset.name,
        img_url: sanity.urlForImageSource(asset.image).url(),
        order: (i % 69) + 1,
        series: asset.series,
      },
    }),
    {}
  );
  res.json(massagedAssets);
};

export default handler;
