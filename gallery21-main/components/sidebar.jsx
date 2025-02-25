'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`sticky left-0 top-0 flex flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px] ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link href={item.route} key={item.label}>
              <a
                className={`flex items-center p-4 rounded-lg justify-start ${isActive ? 'bg-blue-1' : ''}`}
              >
                <img
                  src={item.imgURL}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <p className={`text-lg font-semibold max-lg:hidden ${isOpen ? '' : 'hidden'}`}>
                  {item.label}
                </p>
              </a>
            </Link>
          );
        })}
      </div>
      <button
        className="p-2 mt-4 mx-auto bg-blue-1 rounded-full text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
    </section>
  );
};

export default Sidebar;
