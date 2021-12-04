import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import horizontalLogo from '../../../../public/logo_horizontal.png';
import squareLogo from '../../../../public/logo_square.png';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <SEO />
      <header className="bg-pink-50 py-4">
        <div className="flex items-center justify-between px-8 md:px-24">
          <Link href="/">
            <a className="flex items-end space-x-4">
              <div className="block lg:hidden">
                <Image alt="Drooling Ape Bus Club logo" height="80" width="80" src={squareLogo} />
              </div>
              <div className="hidden lg:block">
                <Image
                  alt="Drooling Ape Bus Club logo"
                  height="80"
                  width="250"
                  src={horizontalLogo}
                />
              </div>
            </a>
          </Link>
          <a
            className="text-gray-400 hover:text-gray-700"
            href="https://t.me/drooling_ape_bus_club"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane className="h-10 w-10" />
          </a>
        </div>
      </header>
      {children}
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

      <meta name="twitter:card" content="summary_large_image" />
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
