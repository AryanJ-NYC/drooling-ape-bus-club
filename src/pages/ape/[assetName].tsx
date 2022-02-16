import { Dispenser as DispenserType } from 'counterparty-node-client/dist/types/Dispenser';
import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Dispenser } from '../../modules/shared/components/Dispenser';
import { Counterparty } from '../../modules/shared/lib/Counterparty';
import { SanityClient } from '../../sanity/client';
import { Ape } from '../../sanity/types';

const sanity = new SanityClient();

const AssetDetailScreen: NextPage<Props> = ({ ape, dispensers }) => {
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
        <div>
          <p className="text-lg">Dispensers</p>
          <div className="space-y-4">
            {dispensers.map((d) => (
              <Dispenser dispenser={d} key={d.tx_hash} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = { ape: Ape; dispensers: DispenserType[] };
// TODO: change to get static props
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.assetName !== 'string') {
    return { notFound: true };
  }

  const ape = await sanity.getApeByName(params.assetName);
  if (!ape) return { notFound: true };

  const counterparty = new Counterparty();
  const dispensers = await counterparty.getDispensersByAssetName(params.assetName);
  return { props: { ape, dispensers } };
};

export default AssetDetailScreen;
