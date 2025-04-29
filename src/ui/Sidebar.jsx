import React from 'react';
import Logo from './Logo';
import MainNav from './MainNav';
import Uploader from '../data/Uploader';


export default function Sidebar() {
  
  return (
    <aside className="bg-grey-0 row-span-full flex flex-col gap-12 border-r border-gray-100 px-10 py-13">
      <Logo />
      <MainNav />
      <Uploader />
    </aside>
  );
}
