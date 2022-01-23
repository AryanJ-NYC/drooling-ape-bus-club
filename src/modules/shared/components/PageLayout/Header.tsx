import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import noop from 'lodash/noop';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { AiOutlineCheck as CheckIcon } from 'react-icons/ai';
import { HiOutlineSelector as SelectorIcon } from 'react-icons/hi';
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
      <SeriesDropdown />
      <Link href="/submit">
        <a className="text-lg">Submit an Ape</a>
      </Link>
    </header>
  );
};

const series = [1, 2, 3, 4];
const SeriesDropdown: React.FC = () => {
  const router = useRouter();
  const selectedSeries = router.query.number ?? null;

  return (
    <Listbox value={selectedSeries} onChange={noop}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md shadow-pink-300 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <span className="block truncate">Series {selectedSeries}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {series.map((s) => {
              const selected = Number(selectedSeries) === s;
              return (
                <Link href={`/series/${s}`} key={s}>
                  <a className="cursor-pointer">
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'select-none relative py-2 pl-10 pr-4',
                          active ? 'text-purple-900 bg-purple-100' : 'text-gray-900'
                        )
                      }
                      value={s}
                    >
                      <span
                        className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}
                      >
                        {s}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </Listbox.Option>
                  </a>
                </Link>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
