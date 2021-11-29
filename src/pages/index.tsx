import type { GetServerSideProps, NextPage } from 'next';
import { PageLayout } from '../modules/shared/PageLayout';
import { SanityClient } from '../sanity/client';

const sanityClient = new SanityClient();

const Home: NextPage<Props> = ({ apes }) => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-green-50 px-16 py-8">
        {apes.map((a) => {
          const heroImageUrl =
            sanityClient.urlForImageSource(a.image).auto('format').height(255).width(255).url() ??
            undefined;
          const xchainUrl = a.xchainUrl;
          return (
            <div className="flex flex-col items-center" key={heroImageUrl}>
              {a.name ? <p>{a.name}</p> : null}
              <MaybeAnchor className="flex flex-shrink" href={xchainUrl}>
                <img src={heroImageUrl} />
              </MaybeAnchor>
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  return { props: { apes } };
};
type Props = { apes: { image: string; name: string; xchainUrl?: string }[] };

export default Home;
