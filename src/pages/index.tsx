import type { GetStaticProps, NextPage } from 'next';
import { ApeCard } from '../modules/shared/components/ApeCard';
import { PageLayout } from '../modules/shared/components/PageLayout';
import { SanityClient } from '../sanity/client';
import type { Ape } from '../sanity/types';

const Home: NextPage<Props> = ({ apes }) => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-16 py-8 bg-gray-50">
        {apes.map((a) => (
          <ApeCard ape={a} key={a.name} />
        ))}
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sanity = new SanityClient();
  const apes = await sanity.getApes();
  return { props: { apes }, revalidate: 60 };
};
type Props = {
  apes: Ape[];
};

export default Home;
