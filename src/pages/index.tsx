import sample from 'lodash/sample';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
// @ts-expect-error
import { Player } from 'video-react';
import { ApeCardCaptionContainer, ApeCardContainer } from '../modules/shared/components/ApeCard';
import { ApeGrid } from '../modules/shared/components/ApeGrid';
import { SanityClient } from '../sanity/client';
import type { Ape } from '../sanity/types';

const sanityClient = new SanityClient();
const Home: NextPage<Props> = ({ seriesToApe }) => {
  return (
    <ApeGrid>
      {Object.entries(seriesToApe).map(([seriesNumber, ape]) => {
        const imageUrl =
          ape.imageUrl ??
          sanityClient.urlForImageSource(ape.image).auto('format').height(255).width(255).url() ??
          undefined;
        return (
          <Link key={seriesNumber} href={`/series/${seriesNumber}`}>
            <a>
              <ApeCardContainer>
                {imageUrl.includes('.mp4') ? (
                  <Player fluid={false} height={320} playsInline src={imageUrl} width={320} />
                ) : (
                  <img
                    alt={`${ape.name ?? 'unnamed'} asset`}
                    className="bg-pink-50 rounded-t-md w-96 md:w-80"
                    height="255"
                    width="255"
                    src={imageUrl}
                  />
                )}
                <ApeCardCaptionContainer>
                  <p className="tracking-widest uppercase">Series {seriesNumber}</p>
                </ApeCardCaptionContainer>
              </ApeCardContainer>
            </a>
          </Link>
        );
      })}
    </ApeGrid>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sanity = new SanityClient();
  const apes = await sanity.getAllApesGroupedBySeries();
  const seriesToApe = apes.reduce((prev, curr, currI) => {
    return { [currI + 1]: sample(curr.apes), ...prev };
  }, {});
  return { props: { seriesToApe }, revalidate: 60 * 5 };
};
type Props = {
  seriesToApe: Record<string, Pick<Ape, 'image' | 'imageUrl' | 'name'>>;
};

export default Home;
