import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { ApeCard } from '../../modules/shared/components/ApeCard';
import { ApeGrid } from '../../modules/shared/components/ApeGrid';
import { PageLayout } from '../../modules/shared/components/PageLayout';
import { SanityClient } from '../../sanity/client';
import type { Ape } from '../../sanity/types';

const SeriesPage: NextPage<Props> = ({ apes }) => {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <PageLayout>
        <p>Under Contstruction</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ApeGrid>
        {apes.map((a) => (
          <ApeCard ape={a} key={a.name} />
        ))}
      </ApeGrid>
    </PageLayout>
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

  return { props: { apes }, revalidate: 60 * 5 };
};
type Props = { apes: Ape[] };

export default SeriesPage;
