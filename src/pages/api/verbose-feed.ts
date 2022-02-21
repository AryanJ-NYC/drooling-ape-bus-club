import { NextApiHandler } from 'next';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();
const handler: NextApiHandler = async (_, res) => {
  const assets = await sanity.getApes();
  const massagedAssets = assets.reduce((prev, asset, i) => {
    const img_url = getImageUrl(asset);
    return {
      ...prev,
      [asset.name]: {
        artists: asset.artists,
        asset: asset.name,
        img_url,
        order: (i % 69) + 1,
        series: asset.series,
      },
    };
  }, {});
  res.json(massagedAssets);
};

const getImageUrl = (asset: Ape): string => {
  if (asset.imageUrl) return asset.imageUrl;
  if (asset.image) return sanity.urlForImageSource(asset.image).url();
  return '';
};

export default handler;
