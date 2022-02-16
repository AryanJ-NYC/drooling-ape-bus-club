import { satoshisToBitcoin } from 'bitcoin-conversion';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { ApeCard } from '../../modules/shared/components/ApeCard';
import { ApeGrid } from '../../modules/shared/components/ApeGrid';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { SanityClient } from '../../sanity/client';
import type { Ape } from '../../sanity/types';

const SeriesPage: NextPage<Props> = ({ apes }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Under Contstruction</p>;
  }

  return (
    <ApeGrid>
      {apes.map((a, i) => (
        <ApeCard ape={a} key={a.name} order={i + 1} />
      ))}
    </ApeGrid>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { fallback: true, paths: [] };
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
  const dispensers = await cp.getDispensersByAssetNames(apeNames);
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

  return {
    props: {
      apes: apes.map((a) => ({
        ...a,
        cheapestDispenser: apeNameToCheapestDispenserPrice[a.name] ?? null,
      })),
    },
    revalidate: 60 * 5,
  };
};
type Props = {
  apes: (Ape & { cheapestDispenser: number | null })[];
};

export default SeriesPage;
