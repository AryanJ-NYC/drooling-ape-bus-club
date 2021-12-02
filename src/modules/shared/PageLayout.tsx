import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import logo from '../../../public/logo.png';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header className="bg-pink-50 py-4">
        <div className="flex items-center justify-between px-8 md:px-24 xl:px-32">
          <Link href="/">
            <a className="flex items-end space-x-4">
              <Image alt="Drooling Ape Bus Club logo" height="80" width="80" src={logo} />
              <p className="hidden lg:block text-xl tracking-widest uppercase">
                Drooling Ape Bus Club
              </p>
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
