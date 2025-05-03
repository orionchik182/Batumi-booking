import React from 'react';
import Logout from '../features/authentication/Logout';

export default function Header() {
  return (
    <header className="bg-grey-0 border-b border-gray-100 px-19 py-5">
      <Logout />
    </header>
  );
}
