// src/layouts/UserLayout.jsx
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

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
