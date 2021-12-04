import shuffle from 'lodash.shuffle';
import type { GetStaticProps, NextPage } from 'next';
import { PageLayout } from '../modules/shared/components/PageLayout';
import { SanityClient } from '../sanity/client';
import type { Ape } from '../sanity/types';

const sanityClient = new SanityClient();

const Home: NextPage<Props> = ({ apes }) => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-16 py-8 bg-gray-50">
        {apes.map((a) => {
          const heroImageUrl =
            sanityClient
              .urlForImageSource(a.image)
              .auto('format')
              .height(255)
              .width(255)
              .quality(67)
              .url() ?? undefined;
          const xchainUrl = `https://xchain.io/asset/${a.name}`;
          return (
            <div className="flex flex-col items-center" key={heroImageUrl}>
              <div className="shadow-xl">
                <MaybeAnchor href={xchainUrl}>
                  <img
                    alt={`${a.name ?? 'unnamed'} asset`}
                    className="bg-pink-50 rounded-t-md"
                    height="255"
                    width="255"
                    src={heroImageUrl}
                  />
                </MaybeAnchor>
                <div className="bg-pink-50 py-2 rounded-b-md flex flex-col items-center">
                  {a.name ? <p className="tracking-wider">{a.name}</p> : null}
                  {a.artists?.length ? (
                    <p className="text-xs">
                      by{' '}
                      {a.artists.map((artist) => (
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
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  const shuffledApes = [apes[0], ...shuffle(apes.slice(1))];
  return { props: { apes: shuffledApes }, revalidate: 30 };
};
type Props = {
  apes: Ape[];
};

export default Home;
