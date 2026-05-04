import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./User/Utils/theme";  // Adjusted import path

const patterns = [
  {
    name: "Default",
    description: "Uses standard diagonal + rows/columns by default",
   
    cells: null,
  },
  {
    name: "Full Row",
    description: "All 5 numbers in any horizontal row must be marked",
    
    cells: [1, 2, 3, 4, 5],
  },
  {
    name: "Full Column",
    description: "All 5 numbers in any vertical column must be marked",
   
    cells: [1, 6, 11, 16, 21],
  },
  {
    name: "Diagonal",
    description: "From top-left to bottom-right or top-right to bottom-left",
 
    cells: [1, 7, 13, 19, 25],
  },
  {
    name: "X Pattern",
    description: "Both diagonals crossed",
  
    cells: [1, 7, 13, 19, 25, 5, 9, 17, 21],
  },
  {
    name: "Full House",
    description: "All 25 numbers must be marked",
    
    cells: Array.from({ length: 25 }, (_, i) => i + 1),
  },
  {
    name: "Corners",
    description: "Only the 4 corners of the card",
    
    cells: [1, 5, 21, 25],
  },
  {
    name: "T Shape",
    description: "Top row + middle column",
    
    cells: [1, 2, 3, 4, 5, 8, 13, 18, 23],
  },
];

export const defaultPatterns = [
  { name: "Diagonal 1", cells: [1, 7, 13, 19, 25] },
  { name: "Diagonal 2", cells: [5, 9, 17, 21] },
  { name: "Row 1", cells: [1, 2, 3, 4, 5] },
  { name: "Row 2", cells: [6, 7, 8, 9, 10] },
  { name: "Row 3", cells: [11, 12, 13, 14, 15] },
  { name: "Row 4", cells: [16, 17, 18, 19, 20] },
  { name: "Row 5", cells: [21, 22, 23, 24, 25] },
  { name: "Col 1", cells: [1, 6, 11, 16, 21] },
  { name: "Col 2", cells: [2, 7, 12, 17, 22] },
  { name: "Col 3", cells: [3, 8, 13, 18, 23] },
  { name: "Col 4", cells: [4, 9, 14, 19, 24] },
  { name: "Col 5", cells: [5, 10, 15, 20, 25] },
  { name: "Corners", cells: [1, 5, 21, 25] },
];

export default function SelectPatternPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patternParam = params.get("pattern");
    if (patternParam) {
      setSelectedPattern(patternParam);
    } else {
      setSelectedPattern(null);
    }
  }, [location.search]);

  const selectPattern = (cells, name) => {
    try {
      const params = new URLSearchParams(location.search);

      const selected = params.get("selected");
      if (selected) {
        params.set("selected", selected);
      }

      if (name === "Default") {
        params.delete("pattern");
      } else {
        params.set("pattern", name);
      }

      navigate(`/homepage?${params.toString()}`, { replace: false });
    } catch (e) {
      console.error("Navigation error:", e);
      alert("Failed to navigate. Please try again.");
    }
  };

  const handleHome = () => {
    navigate('/homepage');
    setMenuOpen(false);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const buttonStyle = (bg) => ({
    backgroundColor: bg,
    color: 'white',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
  });

  return (
    <div className="h-screen w-screen flex flex-col overflow-y-auto overflow-x-hidden" style={{ ...theme.homeContainer, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <div className="relative w-full min-h-full flex flex-col">
       
        <nav className="flex items-center px-8 py-2" style={theme.homeNavbar}>
          <div className="flex items-center flex-wrap gap-10">
            <button onClick={handleHome} style={buttonStyle('#2563EB')}>
              Back To Home
            </button>
            <button onClick={toggleTheme} style={buttonStyle('#3949AB')}>
              Change Theme
            </button>
            
          </div>
        </nav>

        <div className="text-center py-2 text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            🎯 Choose a Pattern
          </span>
        </div>

        <div className="sm:flex items-center justify-between px-3 py-2" style={theme.homeNavbar}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl font-bold px-2 py-1 bg-blue-700 text-white rounded-full shadow sm:hidden"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
          <div className="text-center text-xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse sm:hidden">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              🎯 Choose a Pattern
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl font-bold px-2 py-1 bg-blue-700 text-white rounded-full shadow sm:hidden"
            aria-label="User Menu"
          >
            ⋮
          </button>
        </div>

        <aside
          className={`fixed top-0 left-0 h-full w-64 p-4 shadow-lg transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:hidden`}
          style={theme.homeSidebar}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-lg font-bold text-red-600 mb-3 w-full text-right"
            aria-label="Close Menu"
          >
            ✕
          </button>
          <div className="flex flex-col gap-3 font-semibold">
            <button onClick={toggleTheme} style={buttonStyle('#3949AB')}>
              Change Theme
            </button>
            <button onClick={handleHome} style={buttonStyle('#1E40AF')}>
              Home
            </button>
            <button onClick={() => navigate('/cashier-dashboard')} style={buttonStyle('#1E40AF')}>
              Dashboard
            </button>
            <button onClick={handleLogout} style={buttonStyle('#DC2626')}>
              Logout
            </button>
          </div>
        </aside>

        {(sidebarOpen || menuOpen) && (
          <div
            onClick={() => {
              setSidebarOpen(false);
              setMenuOpen(false);
            }}
            className="fixed inset-0 bg-black opacity-40 z-40 sm:hidden"
          />
        )}

        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Select a Pattern</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((p) => (
              <div
                key={p.name}
                onClick={() => selectPattern(p.cells, p.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer shadow-lg transition ${
                  selectedPattern === p.name || (!selectedPattern && p.name === "Default")
                    ? "bg-blue-800 text-white"
                    : "bg-gray-800 text-white hover:bg-blue-800"
                }`}
                style={{ minHeight: '150px' }}
              >
                <h2 className="text-lg font-bold">{p.name}</h2>
                <p className="text-sm opacity-75 text-center">{p.description}</p>
                {/* Placeholder for image if available */}
                {p.image && <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded" />}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}