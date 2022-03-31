import sample from 'lodash/sample';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ApeCard } from '../../modules/shared/components/ApeCard';
import { ApeGrid } from '../../modules/shared/components/ApeGrid';
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

  const apesWithImageProps = await Promise.all(
    apes.map(async (a) => {
      const imageProps = await getImageProps(a.imageUrl);

      return {
        ...a,
        imageProps,
      };
    })
  );

  return { props: { apes: apesWithImageProps }, revalidate: 60 * 30 };
};

type Props = {
  apes: (Ape & { imageProps: ImagePlaceholderProps })[];
};

const SeriesPageWithFallback: React.FC<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Under Contstruction</p>;
  }
  return <SeriesPage {...props} />;
};

export default SeriesPageWithFallback;
