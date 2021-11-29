import Link from 'next/link';
import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header className="bg-pink-50 py-4">
        <div className="flex items-center justify-between px-8 xl:px-44">
          <Link href="/">
            <a className="uppercase tracking-widest text-xl">Drooling Ape Bus Club</a>
          </Link>
          <a
            className="text-gray-400 hover:text-gray-700"
            href="https://t.me/drooling_ape_bus_club"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane />
          </a>
        </div>
      </header>
      {children}
    </div>
  );
};
