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
  const imageUrl = ape.imageUrl;

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">
      <NextSeo
        description={`${ape.name} created by ${artistNames}`}
        openGraph={{ images: [{ height: 800, url: imageUrl, width: 800 }] }}
        title={`${ape.name} | Drooling Ape Bus Club`}
      />
      <div className="flex-1">
        {imageUrl.includes('.mp4') ? (
          <VideoPlayer src={imageUrl} />
        ) : (
          // @ts-expect-error
          <Image alt={`${ape.name}`} {...ape.imageProps} placeholder="blur" />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-8">
        <div className="flex-1 text-center leading-5">
          <p className="text-xl">{ape.name}</p>
          {!!ape.artists?.length && (
            <p>
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
        <div className="flex-1">
          {!!dispensers.length && (
            <div>
              <p className="text-lg">Dispensers</p>
              <div className="space-y-4">
                {dispensers.map((d) => (
                  <Dispenser dispenser={d} key={d.tx_hash} />
                ))}
              </div>
            </div>
          )}
          {!!orders.length && (
            <div>
              <p className="text-lg">Open Orders</p>
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
  );
};

type Props = {
  ape: Ape & { imageProps: ImagePlaceholderProps };
  dispensers: DispenserType[];
  orders: OrderType[];
};

export const getStaticPaths: GetStaticPaths = async () => ({ fallback: true, paths: [] });

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
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
    revalidate: 60 * 15,
  };
};

export default AssetDetailScreen;
