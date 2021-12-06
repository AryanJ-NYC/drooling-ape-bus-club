import Head from 'next/head';
import React from 'react';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import squareLogo from '../../../../../public/logo_square.png';
import { Header } from './Header';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <SEO />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 px-16 py-8">{children}</main>
        <footer className="bg-purple-50 px-8 md:px-24 py-4 flex justify-center space-x-6">
          <a
            className="text-purple-400 hover:text-purple-500 cursor-pointer"
            href="https://twitter.com/DroolingApes"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="h-5 w-5" />
          </a>
          <a
            className="text-purple-400 hover:text-purple-500 cursor-pointer"
            href="https://t.me/drooling_ape_bus_club"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane className="h-5 w-5" />
          </a>
        </footer>
      </div>
    </div>
  );
};

const description = 'Because the other apes are boring.';
const cardImageSrc = 'https://drooling-ape-bus-club.s3.amazonaws.com/DERPYMONA.jpg';
const title = 'Drooling Ape Bus Club';
const SEO: React.FC = () => {
  return (
    <Head>
      <link rel="shortcut icon" href={squareLogo.src} type="image/x-icon" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={cardImageSrc} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={cardImageSrc} />
      <meta name="twitter:creator" content="@AryanJabbari" />
      <meta name="twitter:title" content={title} />

      <meta name="og:image" content={cardImageSrc} />
      <meta name="og:type" content="website" />
      <meta name="og:title" content={title} />
    </Head>
  );
};
