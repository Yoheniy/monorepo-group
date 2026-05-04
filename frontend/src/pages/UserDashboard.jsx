// src/components/AdminSidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  Users, Clock, UsersRound, Trophy, Table, CalendarDays, Goal, AlertTriangle, BarChart3, Vote, LogOut 
} from 'lucide-react';

const navGroups = [
  {
    title: "Users & Approvals",
    items: [
      { to: '/admin/users', icon: Users, label: 'All Users' },
      { to: '/admin/pending', icon: Clock, label: 'Pending Registrations' },
    ]
  },
  {
    title: "Teams & Participants",
    items: [
      { to: '/admin/teams', icon: UsersRound, label: 'Teams' },
      { to: '/admin/participants', icon: Users, label: 'Players & Coaches' },
    ]
  },
  {
    title: "Tournaments & Leagues",
    items: [
      { to: '/admin/tournaments', icon: Trophy, label: 'Tournaments' },
      { to: '/admin/standings', icon: Table, label: 'Standings' },
    ]
  },
  {
    title: "Matches & Events",
    items: [
      { to: '/admin/matches', icon: CalendarDays, label: 'Matches & Fixtures' },
      { to: '/admin/match-events', icon: Goal, label: 'Match Events' },
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
      { to: '/admin/polls', icon: BarChart3, label: 'Polls' },
      { to: '/admin/votes', icon: Vote, label: 'Votes' },
    ]
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-900 to-purple-900 text-white flex flex-col h-screen fixed">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-indigo-300">ASTU Premier League</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h3 className="px-4 text-xs uppercase font-semibold text-indigo-300 tracking-wider mb-3">
              {group.title}
            </h3>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive ? 'bg-white/15 text-white' : 'hover:bg-white/10'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 rounded-lg transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}