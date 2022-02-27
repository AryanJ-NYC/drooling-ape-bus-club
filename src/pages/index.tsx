import sample from 'lodash/sample';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { ApeCardCaptionContainer, ApeCardContainer } from '../modules/shared/components/ApeCard';
import { ApeGrid } from '../modules/shared/components/ApeGrid';
import { ApeImage } from '../modules/shared/components/ApeImage';
import { VideoPlayer } from '../modules/shared/components/VideoPlayer';
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
          <ApeCardContainer key={seriesNumber}>
            <Link href={`/series/${seriesNumber}`}>
              <a>
                {imageUrl.includes('.mp4') ? (
                  <VideoPlayer src={imageUrl} />
                ) : (
                  <ApeImage alt={`${ape.name ?? 'unnamed'} asset`} src={imageUrl} />
                )}
                <ApeCardCaptionContainer>
                  <p className="tracking-widest uppercase">Series {seriesNumber}</p>
                </ApeCardCaptionContainer>
              </a>
            </Link>
          </ApeCardContainer>
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
