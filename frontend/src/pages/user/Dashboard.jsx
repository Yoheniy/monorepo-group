import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Target,
  Gamepad2,
  Shield,
  TrendingUp,
  Star,
  Shirt,
  Zap,
  MapPin
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [teamStats, setTeamStats] = useState({
    goals: 24,
    assists: 12,
    wins: 8,
    draws: 3,
    losses: 2,
    rating: 8.9
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        // 1. Profile
        const userRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData.user || userData);

        // 2. Matches
        const matchRes = await fetch(
          'http://localhost:5000/api/matches?status=SCHEDULED&limit=5',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const matchData = await matchRes.json();
        setUpcomingMatches(matchData.matches || []);

        // 3. Standings
        const tournamentId = 1;
        const standingsRes = await fetch(
          `http://localhost:5000/api/standings?tournamentId=${tournamentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const standingsData = await standingsRes.json();
        setStandings(standingsData.standings || []);

        // 4. Polls
        const pollsRes = await fetch('http://localhost:5000/api/polls', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pollsData = await pollsRes.json();
        setPolls(
          pollsData.polls?.filter(p => new Date(p.endsAt) > new Date()) || []
        );
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Functional button handlers
  const handleViewFullTable = () => {
    navigate('/standings');
    console.log('Navigating to full standings table');
  };

  const handleViewAllMatches = () => {
    navigate('/matches');
    console.log('Navigating to all matches');
  };

  const handleJoinMatch = (matchId) => {
    console.log(`Joining match ${matchId}`);
    // Add match joining logic here
  };

  const handleViewPlayerStats = () => {
    navigate('/player-stats');
    console.log('Navigating to player stats');
  };

  const handleViewTeamDetails = (teamId) => {
    navigate(`/team/${teamId}`);
    console.log(`Viewing team details for team ${teamId}`);
  };

  const handleVotePoll = (pollId, optionId) => {
    console.log(`Voting for poll ${pollId}, option ${optionId}`);
    // Add voting logic here
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'join-team':
        navigate('/teams/join');
        break;
      case 'create-team':
        navigate('/teams/create');
        break;
      case 'schedule-match':
        navigate('/matches/schedule');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  // Container styles with soccer field theme
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2a1a 0%, #1a3d27 50%, #0f2a1a 100%)',
    color: '#ffffff',
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

  const soccerFieldGridStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 255, 100, 0.05) 2px, transparent 2px),
      linear-gradient(90deg, rgba(0, 255, 100, 0.05) 2px, transparent 2px),
      radial-gradient(circle at 50% 50%, rgba(0, 255, 100, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '100px 100px, 100px 100px, 20px 20px',
    animation: 'fieldMove 20s linear infinite',
    pointerEvents: 'none',
  };

  const centerCircleStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    border: '2px solid rgba(0, 255, 100, 0.2)',
    borderRadius: '50%',
    pointerEvents: 'none',
  };

  const penaltyAreaStyle = {
    position: 'absolute',
    left: '10%',
    top: '35%',
    width: '150px',
    height: '300px',
    border: '2px solid rgba(0, 255, 100, 0.15)',
    borderRight: 'none',
    borderRadius: '10px 0 0 10px',
    pointerEvents: 'none',
  };

  const soccerBallElement = {
    position: 'absolute',
    top: '20%',
    right: '15%',
    width: '40px',
    height: '40px',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #cccccc, #333333)',
    borderRadius: '50%',
    boxShadow: 'inset -5px -5px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 100, 0.5)',
    animation: 'floatBall 3s ease-in-out infinite',
  };

  // Card styles with soccer theme
  const grassCardStyle = {
    backdropFilter: 'blur(20px)',
    background: 'linear-gradient(135deg, rgba(26, 71, 42, 0.9), rgba(13, 40, 24, 0.9))',
    border: '2px solid rgba(0, 255, 100, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  };

  const grassCardHoverStyle = {
    borderColor: 'rgba(0, 255, 100, 0.5)',
    boxShadow: '0 0 30px rgba(0, 255, 100, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)',
    transform: 'translateY(-2px)',
  };

  // Button styles with soccer theme
  const soccerButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #00cc66, #00994d)',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(0, 204, 102, 0.4)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textTransform: 'uppercase',
  };

  const soccerButtonHoverStyle = {
    background: 'linear-gradient(135deg, #00e673, #00b359)',
    boxShadow: '0 6px 20px rgba(0, 204, 102, 0.6)',
    transform: 'translateY(-2px)',
  };

  const secondaryButtonStyle = {
    ...soccerButtonStyle,
    background: 'rgba(0, 255, 100, 0.1)',
    border: '1px solid rgba(0, 255, 100, 0.3)',
    color: '#00ff99',
  };

  const secondaryButtonHoverStyle = {
    ...secondaryButtonStyle,
    background: 'rgba(0, 255, 100, 0.2)',
    borderColor: 'rgba(0, 255, 100, 0.5)',
  };

  // Heading styles
  const mainHeadingStyle = {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(45deg, #ffffff, #00ff99)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '1px',
    textShadow: '0 0 30px rgba(0, 255, 153, 0.3)',
  };

  const sectionTitleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#00ff99',
    marginBottom: '20px',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  // Loading spinner
  const loadingSpinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(0, 255, 100, 0.1)',
    borderTopColor: '#00ff99',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2a1a 0%, #1a3d27 100%)',
      }}>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={loadingSpinnerStyle}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2a1a 0%, #1a3d27 100%)',
        color: '#ffffff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle style={{ width: '80px', height: '80px', margin: '0 auto 20px', color: '#ff5555' }} />
          <p style={{ fontSize: '20px', color: '#ff5555' }}>{error}</p>
          <button 
            style={{ ...soccerButtonStyle, marginTop: '20px' }}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Inline CSS Animations */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes fieldMove {
            0% { background-position: 0 0, 0 0, 0 0; }
            100% { background-position: 100px 100px, 100px 100px, 20px 20px; }
          }
          
          @keyframes floatBall {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes goalFlash {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(0, 255, 100, 0.2); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            overflow-x: hidden;
          }
        `}
      </style>

      {/* Soccer field background elements */}
      <div style={soccerFieldGridStyle}></div>
      <div style={centerCircleStyle}></div>
      <div style={penaltyAreaStyle}></div>
      <div style={{
        ...penaltyAreaStyle,
        left: 'auto',
        right: '10%',
        borderLeft: '2px solid rgba(0, 255, 100, 0.15)',
        borderRight: 'none',
        borderRadius: '0 10px 10px 0',
      }}></div>
      <div style={soccerBallElement}></div>

      {/* Main content */}
      <div style={{ padding: '32px', position: 'relative', zIndex: '1' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={mainHeadingStyle}>
                ⚽ WELCOME, {user?.fullName?.split(' ')[0]?.toUpperCase() || 'PLAYER'}
              </h1>
              <p style={{ color: '#a0d9b0', fontSize: '18px' }}>
                {user?.role} • <span style={{ color: '#00ff99' }}>ASTU SOCCER LEAGUE</span>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #00cc66, #00994d)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 204, 102, 0.5)',
                cursor: 'pointer',
              }}
              onClick={handleViewPlayerStats}
              >
                <Target style={{ width: '24px', height: '24px', color: '#ffffff' }} />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '30px',
            flexWrap: 'wrap',
          }}>
            <button 
              style={secondaryButtonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButtonStyle)}
              onClick={() => handleQuickAction('schedule-match')}
            >
              <Calendar style={{ width: '18px', height: '18px' }} />
              SCHEDULE MATCH
            </button>
           
            <button 
              style={secondaryButtonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButtonStyle)}
              onClick={() => navigate('/polls')}
            >
              <BarChart3 style={{ width: '18px', height: '18px' }} />
              VOTE IN POLLS
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div style={{
            ...grassCardStyle,
            borderColor: 'rgba(0, 204, 102, 0.4)',
          }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, grassCardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, grassCardStyle)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #00cc66, #00994d)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shirt style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
              <div>
                <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '4px' }}>YOUR ROLE</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#00ff99' }}>{user?.role || 'Player'}</p>
                <button 
                  style={{ 
                    marginTop: '8px',
                    padding: '6px 12px',
                    background: 'rgba(0, 204, 102, 0.1)',
                    border: '1px solid rgba(0, 204, 102, 0.3)',
                    color: '#00cc66',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={handleViewPlayerStats}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>

          <div style={{
            ...grassCardStyle,
            borderColor: 'rgba(255, 204, 0, 0.4)',
          }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, grassCardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, grassCardStyle)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #ffcc00, #cc9900)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Trophy style={{ width: '28px', height: '28px', color: '#1a3d27' }} />
              </div>
              <div>
                <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '4px' }}>NEXT MATCH</p>
                {upcomingMatches[0] ? (
                  <>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffcc00' }}>
                      {upcomingMatches[0].homeTeam?.name} vs {upcomingMatches[0].awayTeam?.name}
                    </p>
                    <p style={{ color: '#a0d9b0', fontSize: '12px' }}>
                      <Clock style={{ width: '12px', height: '12px', marginRight: '4px', display: 'inline-block' }} />
                      {new Date(upcomingMatches[0].date).toLocaleDateString()} at {upcomingMatches[0].time || 'TBD'}
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffcc00' }}>No upcoming matches</p>
                )}
              </div>
            </div>
          </div>

          <div style={{
            ...grassCardStyle,
            borderColor: 'rgba(0, 153, 255, 0.4)',
          }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, grassCardHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, grassCardStyle)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0099ff, #0066cc)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BarChart3 style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
              <div>
                <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '4px' }}>ACTIVE POLLS</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#0099ff' }}>{polls.length}</p>
                {polls.length > 0 && (
                  <button 
                    style={{ 
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: 'rgba(0, 153, 255, 0.1)',
                      border: '1px solid rgba(0, 153, 255, 0.3)',
                      color: '#0099ff',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/polls')}
                  >
                    Vote Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '40px' }}>
          {/* Left column - League Table */}
          <div 
            style={grassCardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, grassCardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, grassCardStyle)}
          >
            <div style={sectionTitleStyle}>
              <Trophy style={{ width: '24px', height: '24px' }} />
              LEAGUE STANDINGS
            </div>
            
            {standings.length === 0 ? (
              <p style={{ color: '#a0d9b0', textAlign: 'center', padding: '40px' }}>
                No standings data available
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, rgba(0, 204, 102, 0.2), rgba(0, 153, 77, 0.2))',
                    }}>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#00ff99', fontWeight: '600' }}>POS</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: '#00ff99', fontWeight: '600' }}>TEAM</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>P</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>W</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>D</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>L</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>GD</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: '#00ff99', fontWeight: '600' }}>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.slice(0, 8).map((team, index) => (
                      <tr 
                        key={team.id} 
                        style={{
                          background: index < 4 ? 'rgba(0, 204, 102, 0.1)' : 
                                     index >= standings.length - 3 ? 'rgba(255, 77, 77, 0.1)' : 
                                     'rgba(30, 45, 30, 0.6)',
                          borderBottom: '1px solid rgba(0, 255, 100, 0.1)',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 255, 100, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = index < 4 ? 'rgba(0, 204, 102, 0.1)' : 
                                     index >= standings.length - 3 ? 'rgba(255, 77, 77, 0.1)' : 
                                     'rgba(30, 45, 30, 0.6)'}
                        onClick={() => handleViewTeamDetails(team.team?.id || index)}
                      >
                        <td style={{ padding: '16px', fontWeight: '700', color: index < 3 ? '#ffcc00' : '#ffffff' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #00cc66, #00994d)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '700',
                          }}>
                            {team.team?.name?.charAt(0) || 'T'}
                          </div>
                          {team.team?.name || `Team ${index + 1}`}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#a0d9b0' }}>{team.played || 0}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#00ff99' }}>{team.wins || 0}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#ffcc00' }}>{team.draws || 0}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#ff5555' }}>{team.losses || 0}</td>
                        <td style={{ padding: '16px', textAlign: 'center', color: team.goalDifference > 0 ? '#00ff99' : team.goalDifference < 0 ? '#ff5555' : '#ffcc00' }}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#00ff99' }}>
                          {team.points || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <button 
              style={{ 
                marginTop: '24px',
                ...soccerButtonStyle,
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, soccerButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, soccerButtonStyle)}
              onClick={handleViewFullTable}
            >
              <Trophy style={{ width: '18px', height: '18px' }} />
              VIEW FULL STANDINGS
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Right column - Upcoming Matches */}
          <div 
            style={grassCardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, grassCardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, grassCardStyle)}
          >
            <div style={sectionTitleStyle}>
              <Gamepad2 style={{ width: '24px', height: '24px' }} />
              UPCOMING MATCHES
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingMatches.length === 0 ? (
                <p style={{ color: '#a0d9b0', textAlign: 'center', padding: '20px' }}>
                  No upcoming matches scheduled
                </p>
              ) : (
                upcomingMatches.slice(0, 3).map((match, index) => (
                  <div 
                    key={match.id} 
                    style={{
                      background: 'rgba(30, 45, 30, 0.8)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(0, 255, 100, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 255, 100, 0.4)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 100, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 255, 100, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleJoinMatch(match.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: '#00ff99' }} />
                        <span style={{ color: '#a0d9b0', fontSize: '13px' }}>
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin style={{ width: '14px', height: '14px', color: '#ffcc00' }} />
                        <span style={{ color: '#ffcc00', fontSize: '12px', fontWeight: '600' }}>
                          {match.venue || 'Main Field'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #00cc66, #00994d)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '14px',
                        }}>
                          {match.homeTeam?.name?.charAt(0) || 'H'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600' }}>{match.homeTeam?.name || 'Home Team'}</p>
                          <p style={{ color: '#a0d9b0', fontSize: '12px' }}>Home</p>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <div style={{
                          padding: '6px 12px',
                          background: index === 0 ? 'linear-gradient(135deg, #ff3333, #cc0000)' : 'rgba(0, 255, 100, 0.1)',
                          borderRadius: '20px',
                          color: index === 0 ? '#ffffff' : '#00ff99',
                          fontSize: '12px',
                          fontWeight: '700',
                          animation: index === 0 ? 'pulse 2s infinite' : 'none',
                        }}>
                          {index === 0 ? 'LIVE' : match.time || '19:00'}
                        </div>
                        <p style={{ fontSize: '12px', color: '#a0d9b0', marginTop: '4px' }}>VS</p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: '600' }}>{match.awayTeam?.name || 'Away Team'}</p>
                          <p style={{ color: '#a0d9b0', fontSize: '12px' }}>Away</p>
                        </div>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #0099ff, #0066cc)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '14px',
                        }}>
                          {match.awayTeam?.name?.charAt(0) || 'A'}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      style={{ 
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(0, 255, 100, 0.1)',
                        border: '1px solid rgba(0, 255, 100, 0.3)',
                        color: '#00ff99',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 100, 0.2)';
                        e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 100, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 100, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinMatch(match.id);
                      }}
                    >
                      {index === 0 ? 'WATCH LIVE' : 'SET REMINDER'}
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <button 
              style={{ 
                marginTop: '24px',
                width: '100%',
                ...soccerButtonStyle,
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, soccerButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, soccerButtonStyle)}
              onClick={handleViewAllMatches}
            >
              <Calendar style={{ width: '18px', height: '18px' }} />
              VIEW ALL MATCHES
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Bottom Player Stats */}
        <div style={grassCardStyle}>
          <div style={sectionTitleStyle}>
            <TrendingUp style={{ width: '24px', height: '24px' }} />
            YOUR SEASON STATS
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{
              padding: '20px',
              background: 'rgba(30, 45, 30, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 100, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              animation: teamStats.goals > 20 ? 'goalFlash 3s infinite' : 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 100, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 100, 0.2)'}
            >
              <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Zap style={{ width: '14px', height: '14px' }} />
                GOALS
              </p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#00ff99' }}>{teamStats.goals}</p>
              <div style={{
                height: '4px',
                background: 'rgba(0, 255, 100, 0.2)',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(100, (teamStats.goals / 30) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ff99, #00cc66)',
                  borderRadius: '2px',
                }}></div>
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(30, 45, 30, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 153, 255, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 153, 255, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 153, 255, 0.2)'}
            >
              <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Shield style={{ width: '14px', height: '14px' }} />
                ASSISTS
              </p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#0099ff' }}>{teamStats.assists}</p>
              <div style={{
                height: '4px',
                background: 'rgba(0, 153, 255, 0.2)',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(100, (teamStats.assists / 20) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0099ff, #0066cc)',
                  borderRadius: '2px',
                }}></div>
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(30, 45, 30, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 204, 0, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 204, 0, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 204, 0, 0.2)'}
            >
              <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Trophy style={{ width: '14px', height: '14px' }} />
                WIN RATE
              </p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#ffcc00' }}>
                {Math.round((teamStats.wins / (teamStats.wins + teamStats.draws + teamStats.losses)) * 100)}%
              </p>
              <div style={{
                height: '4px',
                background: 'rgba(255, 204, 0, 0.2)',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.round((teamStats.wins / (teamStats.wins + teamStats.draws + teamStats.losses)) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffcc00, #cc9900)',
                  borderRadius: '2px',
                }}></div>
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(30, 45, 30, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.2)'}
            >
              <p style={{ color: '#a0d9b0', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Star style={{ width: '14px', height: '14px' }} />
                RATING
              </p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#ffcc00' }}>{teamStats.rating}/10</p>
              <div style={{
                height: '4px',
                background: 'rgba(255, 204, 0, 0.2)',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${teamStats.rating * 10}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffcc00, #cc9900)',
                  borderRadius: '2px',
                }}></div>
              </div>
            </div>
          </div>
          
          <button 
            style={{ 
              marginTop: '24px',
              ...soccerButtonStyle,
            }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, soccerButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, soccerButtonStyle)}
            onClick={handleViewPlayerStats}
          >
            <BarChart3 style={{ width: '18px', height: '18px' }} />
            VIEW DETAILED STATS
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}