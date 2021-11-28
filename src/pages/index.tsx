import type { GetServerSideProps, NextPage } from 'next';
import { PageLayout } from '../modules/shared/PageLayout';
import { SanityClient } from '../sanity/client';

const sanityClient = new SanityClient();

const Home: NextPage<Props> = ({ apes }) => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-green-50 p-16">
        {apes.map((a) => {
          const heroImageUrl =
            sanityClient.urlForImageSource(a.image).auto('format').height(255).width(255).url() ??
            undefined;
          const xchainUrl = a.xchainUrl;
          return xchainUrl ? (
            <div key={heroImageUrl} className="flex flex-shrink">
              <a href={xchainUrl} target="_blank" rel="noopener noreferrer">
                <img src={heroImageUrl} />
              </a>
            </div>
          ) : (
            <div key={heroImageUrl}>
              <img src={heroImageUrl} />
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
type Props = { apes: { image: string; xchainUrl?: string }[] };

export default Home;
