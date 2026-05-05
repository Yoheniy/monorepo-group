import { useEffect, useState } from 'react';

export default function MyTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Use mock data to avoid API issues
    const mockTeams = [
      { 
        id: 1, 
        name: "Varsity Football", 
        department: "Athletics", 
        totalMembers: 25,
        totalMatches: 15,
        wins: 10,
        level: "competitive",
        coach: "Coach Johnson"
      },
      { 
        id: 2, 
        name: "Basketball Team", 
        department: "Sports", 
        totalMembers: 12,
        totalMatches: 20,
        wins: 14,
        level: "recreational",
        coach: "Coach Smith"
      },
      { 
        id: 3, 
        name: "Swimming Team", 
        department: "Aquatics", 
        totalMembers: 18,
        totalMatches: 10,
        wins: 8,
        level: "competitive",
        coach: "Coach Davis"
      }
    ];

    setTimeout(() => {
      setTeams(mockTeams);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#4b5563', fontSize: '18px', fontWeight: '500' }}>Loading teams...</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>Please wait a moment</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', maxWidth: '448px', width: '100%', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #fee2e2' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', color: '#ef4444', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Error Loading Teams</h2>
            <p style={{ color: '#4b5563', marginBottom: '24px' }}>{error || 'Something went wrong'}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>My Teams</h1>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>View and manage your team information</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{teams.length}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Teams</div>
              </div>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                👥
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #e5e7eb' }}>
            <div style={{ width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 16px' }}>👥</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No Teams Found</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              You are not currently assigned to any teams. Please contact your administrator.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
            >
              Refresh Teams
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {teams.map((team) => (
              <div
                key={team.id}
                style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #e5e7eb', overflow: 'hidden' }}
              >
                {/* Team Header */}
                <div style={{ 
                  padding: '24px',
                  background: team.level === 'competitive' 
                    ? 'linear-gradient(to right, #2563eb, #1d4ed8)' 
                    : team.level === 'recreational'
                    ? 'linear-gradient(to right, #10b981, #059669)'
                    : 'linear-gradient(to right, #4b5563, #374151)'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{team.name}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{team.department}</p>
                </div>

                {/* Team Details */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                        {team.totalMembers || 0}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Members</div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                        {team.totalMatches || 0}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Matches</div>
                    </div>
                  </div>

                  {/* Team Level */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Team Level</div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      backgroundColor: team.level === 'competitive' 
                        ? '#dbeafe' 
                        : team.level === 'recreational'
                        ? '#d1fae5'
                        : '#f3f4f6',
                      color: team.level === 'competitive' 
                        ? '#1e40af' 
                        : team.level === 'recreational'
                        ? '#065f46'
                        : '#374151'
                    }}>
                      {team.level || 'Standard'}
                    </div>
                  </div>

                  {/* Coach */}
                  {team.coach && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Head Coach</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <span style={{ color: '#9ca3af' }}>👤</span>
                        <span style={{ fontWeight: '500', color: '#111827' }}>{team.coach}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => alert(`Viewing details for ${team.name}`)}
                    style={{ 
                      width: '100',
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>→</span>
                    View Team Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          <p>© {new Date().getFullYear()} Team Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}