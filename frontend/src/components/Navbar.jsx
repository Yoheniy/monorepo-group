// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, User, Shield, Trophy, Calendar, BarChart3, 
  AlertTriangle, Users 
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Trophy },
  { to: '/my-team', label: 'My Team', icon: Users },
  { to: '/matches', label: 'Fixtures', icon: Calendar },
  { to: '/standings', label: 'Standings', icon: BarChart3 },
  { to: '/polls', label: 'Polls', icon: BarChart3 },
  { to: '/injuries', label: 'Injuries', icon: AlertTriangle },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-950 to-black border-b border-purple-900/30 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ASTU PL
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-900/40 text-white'
                      : 'text-gray-300 hover:bg-purple-900/30 hover:text-white'
                  }`
                }
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User / Auth section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold">
                    {user?.fullName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.role || '—'}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-xl transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-900/30">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    isActive
                      ? 'bg-purple-900/40 text-white'
                      : 'text-gray-300 hover:bg-purple-900/30'
                  }`
                }
              >
                <link.icon size={22} />
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold text-xl">
                    {user?.fullName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium">{user?.fullName || 'User'}</p>
                    <p className="text-sm text-gray-400">{user?.role || '—'}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-3 bg-red-900/40 hover:bg-red-900/60 rounded-xl transition"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}