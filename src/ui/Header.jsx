import HeaderMenu from './HeaderMenu';
import UserAvatar from '../features/authentication/UserAvatar';

export default function Header() {
  return (
    <header className="bg-grey-0 flex items-center justify-end gap-10 border-b border-gray-100 px-19 py-5">
      <UserAvatar />
      <HeaderMenu />
    </header>
  );
}
