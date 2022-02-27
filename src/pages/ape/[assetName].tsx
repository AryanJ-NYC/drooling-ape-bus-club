import type { Dispenser as DispenserType, Order as OrderType } from 'counterparty-node-client';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';
import React from 'react';
import { Dispenser } from '../../modules/shared/components/Dispenser';
import { Order } from '../../modules/shared/components/Order';
import { VideoPlayer } from '../../modules/shared/components/VideoPlayer';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { ImagePlaciceholderProps } from '../../modules/types';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();

const AssetDetailScreen: NextPage<Props> = ({ ape, dispensers, orders }) => {
  const imageUrl = ape.imageUrl;
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">
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
          <p>{ape.supply} Issued</p>
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
  ape: Ape & {
    divisible: boolean;
    imageProps: ImagePlaciceholderProps;
    supply: number;
    description: string;
  };
  dispensers: DispenserType[];
  orders: OrderType[];
};
// TODO: change to get static props
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.assetName !== 'string') {
    return { notFound: true };
  }

  const counterparty = new Counterparty();
  const [ape, [assetInfo]] = await Promise.all([
    sanity.getApeByName(params.assetName),
    counterparty.getAssetInfo([params.assetName]),
  ]);
  if (!ape) return { notFound: true };

  const [dispensers, orders, { img, base64: blurDataURL }] = await Promise.all([
    counterparty.getDispensersByAssetName(params.assetName),
    counterparty.getOrdersByAssetName(params.assetName),
    getPlaiceholder(ape.imageUrl),
  ]);
  return {
    props: {
      ape: { ...ape, ...assetInfo, imageProps: { ...img, blurDataURL } },
      dispensers,
      orders,
    },
  };
};

export default AssetDetailScreen;
