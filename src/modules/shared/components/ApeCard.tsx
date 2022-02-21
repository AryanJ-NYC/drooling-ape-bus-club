import Link from 'next/link';
import React from 'react';
// @ts-expect-error
import { Player } from 'video-react';
import { SanityClient } from '../../../sanity/client';
import type { Ape } from '../../../sanity/types';
import '../../../../node_modules/video-react/dist/video-react.css';

const sanityClient = new SanityClient();
export const ApeCard: React.FC<Props> = ({ ape, order }) => {
  const imageUrl =
    ape.imageUrl ??
    sanityClient.urlForImageSource(ape.image).auto('format').height(255).width(255).url() ??
    undefined;
  const url = `/ape/${ape.name}`;
  return (
    <ApeCardContainer>
      {imageUrl.includes('.mp4') ? (
        <Player fluid={false} height={320} playsInline src={imageUrl} width={320} />
      ) : (
        <Link href={url}>
          <a>
            <img
              alt={`${ape.name ?? 'unnamed'} asset`}
              className="bg-pink-50 rounded-t-md w-96 md:w-80"
              src={imageUrl}
            />
          </a>
        </Link>
      )}

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
        {ape.cheapestPrice ? (
          <p className="text-sm">
            {ape.cheapestPrice.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC
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

type Props = { ape: Ape & { cheapestPrice: number | null }; order: number };
