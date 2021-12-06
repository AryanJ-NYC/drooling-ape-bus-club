import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import horizontalLogo from '../../../../../public/logo_horizontal.png';
import squareLogo from '../../../../../public/logo_square.png';

export const Header = () => {
  return (
    <header className="bg-pink-50 py-3 flex items-center justify-between px-16">
      <Link href="/">
        <a className="flex items-end space-x-4">
          <div className="block lg:hidden">
            <Image alt="Drooling Ape Bus Club logo" height="80" width="80" src={squareLogo} />
          </div>
          <div className="hidden lg:block">
            <Image alt="Drooling Ape Bus Club logo" height="80" width="250" src={horizontalLogo} />
          </div>
        </a>
      </Link>
      <Link href="/submit">
        <a className="text-lg">Submit an Ape</a>
      </Link>
    </header>
  );
};
