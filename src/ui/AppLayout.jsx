import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="grid h-screen grid-cols-[26rem_1fr] grid-rows-[auto_1fr]">
      <Header />
      <Sidebar />
      <main className="bg-grey-50 overflow-scroll pt-16 pr-20 pb-26 pl-20">
        <div className="mx-auto my-0 flex max-w-[120rem] flex-col gap-13">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
