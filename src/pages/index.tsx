import async from 'async';
import sample from 'lodash/sample';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { ApeCardCaptionContainer, ApeCardContainer } from '../modules/shared/components/ApeCard';
import { ApeGrid } from '../modules/shared/components/ApeGrid';
import { ApeImage } from '../modules/shared/components/ApeImage';
import { VideoPlayer } from '../modules/shared/components/VideoPlayer';
import { getImageProps } from '../modules/shared/lib/images';
import type { ImagePlaceholderProps } from '../modules/types';
import { SanityClient } from '../sanity/client';
import type { Ape } from '../sanity/types';

const Home: NextPage<Props> = ({ seriesToApe }) => {
  return (
    <ApeGrid>
      {Object.entries(seriesToApe).map(([seriesNumber, ape]) => {
        const imageUrl = ape.imageUrl;
        return (
          <ApeCardContainer key={seriesNumber}>
            <Link href={`/series/${seriesNumber}`}>
              <a className="flex flex-col">
                {imageUrl.includes('.mp4') ? (
                  <div>
                    <VideoPlayer src={imageUrl} />
                  </div>
                ) : (
                  // @ts-expect-error
                  <ApeImage alt={`${seriesNumber} series asset`} {...ape.imageProps} />
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
  const serieses = await sanity.getAllApesGroupedBySeries();
  const apesWithPlaceholders = await async.map(
    serieses,
    async (series: { apes: [{ imageUrl: string }] }) => {
      const ape = sample(series.apes);
      const placeholder = ape?.imageUrl ? await getImageProps(ape?.imageUrl) : null;
      return {
        ...ape,
        imageProps: { ...placeholder },
      };
    }
  );
  const seriesToApe = apesWithPlaceholders.reduce((prev, curr, currI) => {
    return { [currI + 1]: curr, ...prev };
  }, {});
  return { props: { seriesToApe }, revalidate: 60 * 5 };
};
type Props = {
  seriesToApe: Record<
    string,
    Pick<Ape, 'imageUrl'> & {
      imageProps: ImagePlaceholderProps;
    }
  >;
};

export default Home;
