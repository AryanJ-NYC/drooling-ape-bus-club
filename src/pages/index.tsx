import sample from 'lodash/sample';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
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
          sanityClient
            .urlForImageSource(ape.image)
            .auto('format')
            .height(255)
            .width(255)
            .quality(67)
            .url() ?? undefined;
        return (
          <Link key={seriesNumber} href={`/series/${seriesNumber}`}>
            <a>
              <ApeCardContainer>
                <img
                  alt={`${ape.name ?? 'unnamed'} asset`}
                  className="bg-pink-50 rounded-t-md"
                  height="255"
                  width="255"
                  src={imageUrl}
                />
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
  seriesToApe: Record<string, Ape>;
};

export default Home;
