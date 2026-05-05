import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, Clock, UsersRound, Trophy, Table, CalendarDays, Goal, AlertTriangle, 
  BarChart3, Vote, LogOut, ShieldCheck 
} from 'lucide-react';

const navGroups = [
  {
    title: "Users & Approvals",
    items: [
      { to: '/admin/users', icon: Users, label: 'All Users & Approvals' },
      
    ]
  },
  {
    title: "Teams & Participants",
    items: [
      { to: '/admin/teams', icon: UsersRound, label: 'Teams' },
  
    ]
  },
  {
    title: "Tournaments & Leagues",
    items: [
      { to: '/admin/tournaments', icon: Trophy, label: 'Tournaments & Seasons' },
     
    ]
  },
  {
    title: "Matches & Events",
    items: [
      { to: '/admin/matches', icon: CalendarDays, label: 'Matches & Fixtures' },
     
    ]
  },
  {
    title: "Injuries",
    items: [
      { to: '/admin/injuries', icon: AlertTriangle, label: 'Injury Reports' },
    ]
  },
  {
    title: "Voting & Polls",
    items: [
      { to: '/admin/polls', icon: BarChart3, label: 'Polls & Voting' },
     
    ]
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-900 to-purple-900 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <ShieldCheck size={32} className="text-purple-300" />
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-purple-200 opacity-80">ASTU Premier League</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h3 className="px-4 text-xs uppercase font-semibold text-purple-300 tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/15 text-white font-medium shadow-sm' 
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 rounded-xl transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}