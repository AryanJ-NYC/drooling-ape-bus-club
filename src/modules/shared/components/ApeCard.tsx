import React from 'react';
import { SanityClient } from '../../../sanity/client';
import type { Ape } from '../../../sanity/types';

const sanityClient = new SanityClient();
export const ApeCard: React.FC<Props> = ({ ape }) => {
  const heroImageUrl =
    sanityClient
      .urlForImageSource(ape.image)
      .auto('format')
      .height(255)
      .width(255)
      .quality(67)
      .url() ?? undefined;
  const xchainUrl = `https://xchain.io/asset/${ape.name}`;
  return (
    <ApeCardContainer>
      <MaybeAnchor href={xchainUrl}>
        <img
          alt={`${ape.name ?? 'unnamed'} asset`}
          className="bg-pink-50 rounded-t-md"
          height="255"
          width="255"
          src={heroImageUrl}
        />
      </MaybeAnchor>
      <div className="bg-pink-50 py-2 rounded-b-md flex flex-col items-center">
        {ape.name ? <p className="tracking-wider">{ape.name}</p> : null}
        {ape.artists?.length ? (
          <p className="text-xs">
            by{' '}
            {ape.artists.map((artist) => (
              <a
                className="text-blue-400 hover:text-blue-600"
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
        <a
          className="cursor-pointer text-blue-400 hover:text-blue-600 text-xs"
          href={xchainUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          xchain
        </a>
      </div>
    </ApeCardContainer>
  );
};

export const ApeCardContainer: React.FC = ({ children }) => (
  <div className="flex flex-col items-center">
    <div className="shadow-xl">{children}</div>
  </div>
);

const MaybeAnchor: React.FC<{
  className?: string;
  href?: string;
}> &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement | HTMLAnchorElement>,
    HTMLDivElement | HTMLAnchorElement
  > = ({ href, ...props }) => {
  if (href) return <a href={href} {...props} target="_blank" rel="noopener noreferrer" />;
  return <div {...props} />;
};

type Props = { ape: Ape };
