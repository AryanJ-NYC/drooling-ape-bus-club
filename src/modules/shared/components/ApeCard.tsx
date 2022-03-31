import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWRImmutable from 'swr/immutable';
import type { Ape } from '../../../sanity/types';
import { ImagePlaceholderProps } from '../../types';
import { ApeImage } from './ApeImage';
import { VideoPlayer } from './VideoPlayer';

export const ApeCard: React.FC<Props> = ({ ape, order }) => {
  const imageUrl = ape.imageUrl;
  const url = `/ape/${ape.name}`;
  const { data, isValidating } = useSWRImmutable([ape.name, 'cheapestPrice'], async (apeName) => {
    const response = await fetch(`/api/apes/${apeName}/cheapest`);
    return response.json();
  });

  return (
    <ApeCardContainer>
      {imageUrl.includes('.mp4') ? (
        <VideoPlayer src={imageUrl} />
      ) : (
        <Link href={url}>
          <a>
            {/* @ts-expect-error */}
            <ApeImage alt={`${ape.name ?? 'unnamed'} asset`} {...ape.imageProps} />
          </a>
        </Link>
      )}

      <ApeCardCaptionContainer>
        {ape.name ? (
          <Link href={url}>
            <a className="text-blue-400 hover:text-blue-600 tracking-wider">{ape.name}</a>
          </Link>
        ) : null}
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
        {data?.cheapestPrice ? (
          <p className="text-sm">
            {data.cheapestPrice.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC
          </p>
        ) : !data && isValidating ? (
          <Skeleton />
        ) : null}
      </ApeCardCaptionContainer>
    </ApeCardContainer>
  );
};

export const ApeCardContainer: React.FC = ({ children }) => (
  <div className="flex flex-col h-full shadow-xl w-full">{children}</div>
);

export const ApeCardCaptionContainer: React.FC = ({ children }) => (
  <div className="bg-pink-50 py-2 flex flex-col flex-grow items-center space-y-0.5">{children}</div>
);

type Props = {
  ape: Ape & { imageProps: ImagePlaceholderProps };
  order: number;
};
