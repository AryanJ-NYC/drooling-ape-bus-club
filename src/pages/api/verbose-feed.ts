import { NextApiHandler } from 'next';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();
const handler: NextApiHandler = async (_, res) => {
  const serieses = await sanity.getAllApesGroupedBySeries();

  const assets: (Ape & { series: number })[] = [];
  for (const series in serieses) {
    const seriesNumber = Number(series) + 1;
    const apes = await sanity.getApesBySeries(seriesNumber.toString());
    assets.push(...apes.map((a) => ({ ...a, series: seriesNumber })));
  }

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
  return '';
};

export default handler;
