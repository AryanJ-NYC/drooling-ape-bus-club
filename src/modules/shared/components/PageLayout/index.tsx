import React from 'react';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { Header } from './Header';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 px-8 md:px-16 py-8">{children}</main>
        <footer className="bg-purple-50 px-8 md:px-24 py-4 flex justify-center space-x-6">
          <a
            className="text-lime-500 hover:text-lime-600 cursor-pointer"
            href="https://twitter.com/DroolingApes"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="h-8 w-8" />
          </a>
          <a
            className="text-lime-500 hover:text-lime-600 cursor-pointer"
            href="https://t.me/drooling_ape_bus_club"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane className="h-8 w-8" />
          </a>
        </footer>
      </div>
    </div>
  );
};
