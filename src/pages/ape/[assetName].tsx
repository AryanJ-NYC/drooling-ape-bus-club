import type { Dispenser as DispenserType, Order as OrderType } from 'counterparty-node-client';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Dispenser } from '../../modules/shared/components/Dispenser';
import { Order } from '../../modules/shared/components/Order';
import { VideoPlayer } from '../../modules/shared/components/VideoPlayer';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { getImageProps } from '../../modules/shared/lib/images';
import { ImagePlaceholderProps } from '../../modules/types';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();

const AssetDetailScreen: NextPage<Props> = ({ ape, dispensers, orders }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Under Contstruction</p>;
  }

  const artistNames = ape.artists?.map((a) => a.name).join(', ');
  const { imageUrl, name } = ape;

  return (
    <div className="flex flex-col items-center space-y-4">
      <NextSeo
        description={`${name} created by ${artistNames}`}
        openGraph={{ images: [{ height: 800, url: imageUrl, width: 800 }] }}
        title={`${name} | Drooling Ape Bus Club`}
      />
      <div className="flex-1 text-center leading-5">
        <a
          className="text-blue-400 hover:text-blue-600"
          href={`https://dankset.io/assets/${name}`}
          target="_blank"
          rel="noreferrer"
        >
          <h1 className="text-3xl md:text-5xl overflow-x-hidden overflow-ellipsis font-medium tracking-wider">
            {name}
          </h1>
        </a>
        {!!ape.artists?.length && (
          <p className="text-lg">
            by{' '}
            {ape.artists.map((artist) => (
              <a
                className="px-0.5 text-blue-400 hover:text-blue-600"
                href={artist.webpage}
                key={artist.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.name}
              </a>
            ))}
          </p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6 xl:gap-x-24">
        <div className="flex justify-center max-w-2xl">
          {imageUrl.includes('.mp4') ? (
            <VideoPlayer src={imageUrl} />
          ) : (
            <div>
              {/* @ts-expect-error */}
              <Image alt={`${name}`} {...ape.imageProps} placeholder="blur" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-y-8">
          <div className="flex flex-col gap-y-6">
            {!!dispensers.length && (
              <div>
                <p className="text-lg font-medium">Dispensers</p>
                <div className="space-y-4">
                  {dispensers.map((d) => (
                    <Dispenser dispenser={d} key={d.tx_hash} />
                  ))}
                </div>
              </div>
            )}
            {!!orders.length && (
              <div>
                <p className="text-lg font-medium">Open Orders</p>
                <div className="space-y-4">
                  {orders.map((o) => (
                    <Order order={o} key={o.tx_hash} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type Context = { assetName: string };
type Props = {
  ape: Ape & { imageProps: ImagePlaceholderProps };
  dispensers: DispenserType[];
  orders: OrderType[];
};

export const getStaticPaths: GetStaticPaths<Context> = async () => {
  const apes = await sanity.getApeNames();
  return { fallback: true, paths: apes.map((ape) => ({ params: { assetName: ape.name } })) };
};

export const getStaticProps: GetStaticProps<Props, Context> = async ({ params }) => {
  if (typeof params?.assetName !== 'string') {
    return { notFound: true };
  }

  const counterparty = new Counterparty();
  const ape = await sanity.getApeByName(params.assetName);

  if (!ape) return { notFound: true };

  const [dispensers, orders, imageProps] = await Promise.all([
    counterparty.getDispensersByAssetName(params.assetName),
    counterparty.getOrdersByAssetName(params.assetName),
    getImageProps(ape.imageUrl),
  ]);
  return {
    props: {
      ape: { ...ape, imageProps },
      dispensers,
      orders,
    },
    revalidate: 60 * 30,
  };
};

export default AssetDetailScreen;
