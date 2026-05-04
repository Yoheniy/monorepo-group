import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Trophy, Target } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (!data.token) throw new Error('Login did not return a token');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage({ text: '⚽ Login successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      let friendlyMessage = '❌ Something went wrong. Please try again.';
      if (err.message.includes('Invalid email or password')) friendlyMessage = '❌ Invalid email or password.';
      else if (err.message.includes('Account not approved')) friendlyMessage = '⏳ Your account is not approved yet.';

      setMessage({ text: friendlyMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a472a 0%, #0d2818 50%, #0a1d12 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  const soccerFieldStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  };

  const centerCircleStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    border: '2px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
  };

  const penaltyAreaStyle = {
    position: 'absolute',
    left: '12%',
    top: '40%',
    width: '120px',
    height: '250px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
  };

  const penaltyAreaRightStyle = {
    position: 'absolute',
    right: '12%',
    top: '40%',
    width: '120px',
    height: '250px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
  };

  const soccerBallStyle = {
    position: 'absolute',
    top: '30%',
    right: '18%',
    width: '35px',
    height: '35px',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #cccccc, #333333)',
    borderRadius: '50%',
    boxShadow: 'inset -3px -3px 8px rgba(0, 0, 0, 0.5)',
  };

  const logoContainerStyle = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    zIndex: '50',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoIconStyle = {
    width: '48px',
    height: '48px',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #cccccc, #333333)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  };

  const ballPatternStyle = {
    position: 'absolute',
    width: '16px',
    height: '16px',
    border: '2px solid #1a472a',
    borderRadius: '50%',
    transform: 'rotate(45deg)',
  };

  const logoTextStyle = {
    fontSize: '26px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #ffffff, #f0f0f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  };

  const mainContainerStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  };

  const cardContainerStyle = {
    width: '100%',
    maxWidth: '420px',
  };

  const cardStyle = {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(13, 40, 24, 0.92)',
    border: '2px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    padding: '36px 28px',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStadiumStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #00ff00, #ffff00, #ff0000)',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '36px',
  };

  const headerIconStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #cccccc, #333333)',
    borderRadius: '50%',
    marginBottom: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const subtitleStyle = {
    color: '#a0d9b0',
    fontSize: '15px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  };

  const inputContainerStyle = {
    position: 'relative',
  };

  // Base input style - DON'T CHANGE THIS
  const inputBaseStyle = {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '14px',
    paddingBottom: '14px',
    backgroundColor: 'rgba(26, 71, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box', // CRITICAL: Prevents layout shifts
  };

  const getInputStyle = (fieldName) => {
    const isFocused = focusedField === fieldName;
    return {
      ...inputBaseStyle,
      borderColor: isFocused ? '#00cc66' : 'rgba(255, 255, 255, 0.15)',
      boxShadow: isFocused ? '0 0 0 2px rgba(0, 204, 102, 0.2)' : 'none',
    };
  };

  const iconStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    paddingLeft: '14px',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  };

  const passwordToggleStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    paddingRight: '14px',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const checkboxStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '3px',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(26, 71, 42, 0.7)',
    marginRight: '8px',
    cursor: 'pointer',
  };

  const forgotPasswordStyle = {
    fontSize: '14px',
    color: '#00cc66',
    textDecoration: 'none',
    fontWeight: '600',
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(to bottom, #00a859 0%, #007a40 100%)',
    color: 'white',
    fontWeight: '700',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 3px 12px rgba(0, 168, 89, 0.25)',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  };

  const loadingSpinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '10px',
  };

  const messageStyle = (type) => ({
    marginTop: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    backgroundColor: type === 'success' ? 'rgba(0, 168, 89, 0.12)' : 'rgba(220, 53, 69, 0.12)',
    borderColor: type === 'success' ? 'rgba(0, 168, 89, 0.3)' : 'rgba(220, 53, 69, 0.3)',
    color: type === 'success' ? '#80e6af' : '#f5a6a6',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '14px',
  });

  const footerStyle = {
    marginTop: '24px',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  };

  const footerTextStyle = {
    color: '#a0d9b0',
    fontSize: '14px',
  };

  const linkStyle = {
    color: '#00cc66',
    fontWeight: '700',
    textDecoration: 'none',
    marginLeft: '4px',
  };

  return (
    <div style={containerStyle}>
      {/* Minimal inline CSS */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          
          input::placeholder {
            color: #8bb997;
          }
          
          button:hover {
            opacity: 0.95;
          }
          
          * {
            box-sizing: border-box;
          }
          
          input {
            box-sizing: border-box !important;
          }
        `}
      </style>

      {/* Soccer Field Background */}
      <div style={soccerFieldStyle}></div>
      
      {/* Center Circle */}
      <div style={centerCircleStyle}></div>
      
      {/* Penalty Areas */}
      <div style={penaltyAreaStyle}></div>
      <div style={penaltyAreaRightStyle}></div>
      
      {/* Static Soccer Ball */}
      <div style={soccerBallStyle}></div>

      {/* ASTU Soccer League Logo */}
      <div style={logoContainerStyle}>
        <div style={logoStyle}>
          <div style={logoIconStyle}>
            <div style={{ ...ballPatternStyle, top: '6px', left: '6px', width: '10px', height: '10px' }}></div>
            <div style={{ ...ballPatternStyle, top: '6px', right: '6px', width: '8px', height: '8px' }}></div>
            <div style={{ ...ballPatternStyle, bottom: '6px', left: '6px', width: '12px', height: '12px' }}></div>
            <div style={{ ...ballPatternStyle, bottom: '6px', right: '6px', width: '8px', height: '8px' }}></div>
            <Trophy style={{ width: '22px', height: '22px', color: '#1a472a' }} />
          </div>
          <span style={logoTextStyle}>ASTU SOCCER</span>
        </div>
      </div>

      {/* Main Container */}
      <div style={mainContainerStyle}>
        {/* Login Card */}
        <div style={cardContainerStyle}>
          {/* Stadium-style Card */}
          <div style={cardStyle}>
            {/* Stadium top stripe */}
            <div style={cardStadiumStyle}></div>
            
            {/* Header */}
            <div style={headerStyle}>
              <div style={headerIconStyle}>
                <Target style={{ width: '28px', height: '28px', color: '#1a472a' }} />
              </div>
              <h1 style={titleStyle}>Player Login</h1>
              <p style={subtitleStyle}>Sign in to access your team dashboard</p>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              {/* Email Input */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={inputContainerStyle}>
                  <div style={iconStyle}>
                    <Mail style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={getInputStyle('email')}
                    placeholder="player@team.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={inputContainerStyle}>
                  <div style={iconStyle}>
                    <Lock style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={getInputStyle('password')}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={passwordToggleStyle}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                    ) : (
                      <Eye style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div style={checkboxContainerStyle}>
                <label style={checkboxLabelStyle}>
                  <input type="checkbox" style={checkboxStyle} />
                  <span style={{ fontSize: '14px', color: '#ffffff', marginLeft: '6px', fontWeight: '500' }}>
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  style={forgotPasswordStyle}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={loadingSpinnerStyle}></div>
                    Signing in...
                  </div>
                ) : (
                  'Enter the Field'
                )}
              </button>

              {/* Message */}
              {message.text && (
                <div style={messageStyle(message.type)}>
                  <span style={{ marginRight: '8px' }}>{message.type === 'success' ? '⚽' : '❌'}</span>
                  {message.text}
                </div>
              )}
            </form>

            {/* Footer */}
            <div style={footerStyle}>
              <p style={footerTextStyle}>
                Not registered yet?
                <Link
                  to="/register"
                  style={linkStyle}
                >
                  Join the League
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}