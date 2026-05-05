import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <Outlet />
      </main>
    </div>
  );
}
