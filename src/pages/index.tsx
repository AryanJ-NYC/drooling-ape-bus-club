import type { GetServerSideProps, NextPage } from 'next';
import { PageLayout } from '../modules/shared/PageLayout';
import { SanityClient } from '../sanity/client';

const sanityClient = new SanityClient();

const Home: NextPage<Props> = ({ apes }) => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-16 py-8">
        {apes.map((a) => {
          const heroImageUrl =
            sanityClient.urlForImageSource(a.image).auto('format').height(255).width(255).url() ??
            undefined;
          const xchainUrl = a.xchainUrl;
          return (
            <div className="flex flex-col items-center" key={heroImageUrl}>
              <div className="shadow-xl">
                <img
                  alt={`${a.name ?? 'unnamed'} asset`}
                  className="bg-pink-50 rounded-t-md"
                  height="255"
                  width="255"
                  src={heroImageUrl}
                />
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
                  {xchainUrl ? (
                    <a
                      className="cursor-pointer text-blue-400 hover:text-blue-600 text-xs"
                      href={xchainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      xchain
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  return { props: { apes } };
};
type Props = {
  apes: {
    artists: { name: string; webpage: string }[];
    image: string;
    name: string;
    xchainUrl?: string;
  }[];
};

export default Home;
