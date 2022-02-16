import Link from 'next/link';
import React from 'react';
import { SanityClient } from '../../../sanity/client';
import type { Ape } from '../../../sanity/types';

const sanityClient = new SanityClient();
export const ApeCard: React.FC<Props> = ({ ape, order }) => {
  const imageUrl =
    sanityClient
      .urlForImageSource(ape.image)
      .auto('format')
      .height(255)
      .width(255)
      .quality(67)
      .url() ?? undefined;
  const url = `/ape/${ape.name}`;
  return (
    <ApeCardContainer>
      <Link href={url}>
        <a>
          <img
            alt={`${ape.name ?? 'unnamed'} asset`}
            className="bg-pink-50 rounded-t-md w-96 md:w-80"
            src={imageUrl}
          />
        </a>
      </Link>
      <ApeCardCaptionContainer>
        {ape.name ? <p className="tracking-wider">{ape.name}</p> : null}
        <p className="text-xs">Card {order}</p>
        {ape.artists?.length ? (
          <p className="text-xs">
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
        ) : null}
        {ape.cheapestDispenser ? (
          <p className="text-sm">
            {ape.cheapestDispenser.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC
          </p>
        ) : null}
      </ApeCardCaptionContainer>
    </ApeCardContainer>
  );
};

export const ApeCardContainer: React.FC = ({ children }) => (
  <div className="flex flex-col items-center">
    <div className="shadow-xl">{children}</div>
  </div>
);

export const ApeCardCaptionContainer: React.FC = ({ children }) => (
  <div className="bg-pink-50 py-2 rounded-b-md flex flex-col items-center space-y-0.5">
    {children}
  </div>
);

type Props = { ape: Ape & { cheapestDispenser: number | null }; order: number };
