import type { Dispenser as DispenserType, Order as OrderType } from 'counterparty-node-client';
import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Dispenser } from '../../modules/shared/components/Dispenser';
import { Order } from '../../modules/shared/components/Order';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();

const AssetDetailScreen: NextPage<Props> = ({ ape, dispensers, orders }) => {
  const imageUrl = sanity.urlForImageSource(ape.image).height(555).toString();
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">
      <div>
        <img src={imageUrl} />
      </div>
      <div className="flex flex-1 flex-col space-y-8">
        <div>
          <p className="text-xl text-center">{ape.name}</p>
          <p className="text-center">
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
        </div>
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
  );
};

type Props = { ape: Ape; dispensers: DispenserType[]; orders: OrderType[] };
// TODO: change to get static props
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.assetName !== 'string') {
    return { notFound: true };
  }

  const ape = await sanity.getApeByName(params.assetName);
  if (!ape) return { notFound: true };

  const counterparty = new Counterparty();
  const [dispensers, orders] = await Promise.all([
    counterparty.getDispensersByAssetName(params.assetName),
    counterparty.getOrdersByAssetName(params.assetName),
  ]);
  return { props: { ape, dispensers, orders } };
};

export default AssetDetailScreen;
