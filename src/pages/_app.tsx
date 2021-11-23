import { AppComponent } from 'next/dist/shared/lib/router/router';
import 'tailwindcss/tailwind.css';

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
