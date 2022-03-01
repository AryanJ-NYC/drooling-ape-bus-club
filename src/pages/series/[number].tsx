import { getXcpBtcRate, satoshisToBitcoin } from 'bitcoin-conversion';
import Decimal from 'decimal.js-light';
import sample from 'lodash/sample';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ApeCard } from '../../modules/shared/components/ApeCard';
import { ApeGrid } from '../../modules/shared/components/ApeGrid';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { getImageProps } from '../../modules/shared/lib/images';
import { ImagePlaceholderProps } from '../../modules/types';
import { SanityClient } from '../../sanity/client';
import type { Ape } from '../../sanity/types';

const SeriesPage: NextPage<Props> = ({ apes }) => {
  const router = useRouter();
  const randomApeImage = useMemo(
    () =>
      sample(
        apes
          .filter((a) => !a.imageUrl.endsWith('.mp4') && !a.imageUrl.endsWith('.gif'))
          .map((a) => a.imageUrl)
      ),
    [apes]
  );
  return (
    <ApeGrid>
      <NextSeo
        openGraph={{ images: [{ height: 800, url: randomApeImage!, width: 800 }] }}
        title={`Drooling Ape Bus Club | Series ${router.query.number}`}
      />
      {apes.map((a, i) => (
        <ApeCard ape={a} key={a.name} order={i + 1} />
      ))}
    </ApeGrid>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const serieses = await sanity.getAllApesGroupedBySeries();
  return { fallback: true, paths: serieses.map((_, i) => ({ params: { number: `${i + 1}` } })) };
};

const sanity = new SanityClient();
export const getStaticProps: GetStaticProps<Props, { number: string }> = async ({ params }) => {
  if (!params) throw new Error();
  const apes = await sanity.getApesBySeries(params.number);
  if (!apes?.length) {
    return { notFound: true };
  }

  const cp = new Counterparty();
  const apeNames = apes.map((a) => a.name);
  const [dispensers, orders] = await Promise.all([
    cp.getDispensersByAssetNames(apeNames),
    cp.getordersByAssetNames(apeNames),
  ]);

  const apeNameToCheapestDispenserPrice = dispensers.reduce((prev, dispenser) => {
    if (!prev[dispenser.asset]) {
      return { ...prev, [dispenser.asset]: satoshisToBitcoin(dispenser.satoshirate) };
    }

    const currentValue = prev[dispenser.asset];
    return {
      ...prev,
      [dispenser.asset]: Math.min(currentValue ?? 0, satoshisToBitcoin(dispenser.satoshirate)),
    };
  }, {} as Record<string, number | undefined>);

  const xcpRate = await getXcpBtcRate();
  const apeNameToCheapestOrderPrice = orders
    .filter((o) => o.get_asset === 'XCP')
    .reduce((prev, order) => {
      const assetName = order.give_asset;
      const currentValue = prev[assetName];
      const priceInBtc = satoshisToBitcoin(
        new Decimal(xcpRate).mul(order.get_quantity).div(order.give_quantity).toNumber()
      );
      if (!currentValue) {
        return {
          ...prev,
          [order.give_asset]: priceInBtc,
        };
      }
      return {
        ...prev,
        [assetName]: Math.min(currentValue ?? 0, priceInBtc),
      };
    }, {} as Record<string, number>);

  const apesWithCheapestPrice = await Promise.all(
    apes.map(async (a) => {
      const cheapestDispenser = apeNameToCheapestDispenserPrice[a.name];
      const cheapestOrder = apeNameToCheapestOrderPrice[a.name];
      const imageProps = await getImageProps(a.imageUrl);

      return {
        ...a,
        imageProps,
        cheapestPrice: getCheapestPrice({ cheapestDispenser, cheapestOrder }),
      };
    })
  );
  return { props: { apes: apesWithCheapestPrice } };
};

const getCheapestPrice = ({ cheapestDispenser, cheapestOrder }: CheapestPriceParams) => {
  if (cheapestDispenser && !cheapestOrder) return cheapestDispenser;
  if (!cheapestDispenser && cheapestOrder) return cheapestOrder;
  if (cheapestDispenser && cheapestOrder) return Math.min(cheapestDispenser, cheapestOrder);
  return null;
};
type CheapestPriceParams = {
  cheapestDispenser: number | undefined;
  cheapestOrder: number | undefined;
};
type Props = {
  apes: (Ape & { cheapestPrice: number | null; imageProps: ImagePlaceholderProps })[];
};

const SeriesPageWithFallback: React.FC<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Under Contstruction</p>;
  }
  return <SeriesPage {...props} />;
};

export default SeriesPageWithFallback;
