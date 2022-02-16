import { AppComponent } from 'next/dist/shared/lib/router/router';
import 'tailwindcss/tailwind.css';
import { Toaster } from 'react-hot-toast';
import { PageLayout } from '../modules/shared/components/PageLayout';

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return (
    <PageLayout>
      <Component {...pageProps} />
      <Toaster />
    </PageLayout>
  );
};

export default MyApp;
