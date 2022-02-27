import { DefaultSeo } from 'next-seo';
import { AppComponent } from 'next/dist/shared/lib/router/router';
import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import squareLogo from '../../public/logo_square.png';
import { PageLayout } from '../modules/shared/components/PageLayout';

const cardImageSrc = 'https://drooling-ape-bus-club.s3.amazonaws.com/logo_square.png';
const description = 'Because the other apes are boring.';
const title = 'Drooling Ape Bus Club';
const url = 'droolingapebus.club';

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return (
    <PageLayout>
      <Head>
        <link rel="shortcut icon" href={squareLogo.src} type="image/x-icon" />
        <title>{title}</title>
      </Head>
      <DefaultSeo
        title={title}
        description={description}
        openGraph={{
          description,
          images: [{ height: 800, url: cardImageSrc, width: 800 }],
          site_name: title,
          title,
          url,
        }}
        twitter={{
          handle: '@DroolingApes',
          cardType: 'summary_large_image',
          site: url,
        }}
      />
      <Component {...pageProps} />
      <Toaster />
    </PageLayout>
  );
};

export default MyApp;
