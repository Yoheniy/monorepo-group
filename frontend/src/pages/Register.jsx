import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, BookOpen, IdCard, Calendar, Trophy, Target } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    studentId: '',
    batch: '',
    role: 'PLAYER',
  });
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (idFront) data.append('idFront', idFront);
    if (idBack) data.append('idBack', idBack);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Registration failed');

      setMessage({ text: '⚽ Registration successful! Your account is waiting for approval.', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      let friendlyMessage = '❌ Something went wrong.';
      if (err.message.includes('Email already exists')) friendlyMessage = '⚠️ This email is already registered.';
      else if (err.message.includes('Student ID already exists')) friendlyMessage = '⚠️ This student ID is already used.';
      else if (err.message.includes('All fields')) friendlyMessage = '⚠️ Please fill in all required fields.';

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
    bottom: '25%',
    left: '15%',
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
    maxWidth: '500px',
  };

  const cardStyle = {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(13, 40, 24, 0.92)',
    border: '2px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    padding: '32px 28px',
    position: 'relative',
    overflow: 'hidden',
    maxHeight: '90vh',
    overflowY: 'auto',
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
    marginBottom: '28px',
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
    fontSize: '30px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const subtitleStyle = {
    color: '#a0d9b0',
    fontSize: '14px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '6px',
  };

  const inputContainerStyle = {
    position: 'relative',
  };

  const inputBaseStyle = {
    width: '100%',
    paddingLeft: '42px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    backgroundColor: 'rgba(26, 71, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  };

  const getInputStyle = (fieldName) => {
    const isFocused = focusedField === fieldName;
    return {
      ...inputBaseStyle,
      borderColor: isFocused ? '#00cc66' : 'rgba(255, 255, 255, 0.15)',
      boxShadow: isFocused ? '0 0 0 2px rgba(0, 204, 102, 0.2)' : 'none',
    };
  };

  const fileInputStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(26, 71, 42, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#a0d9b0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  };

  const fileInputFocusStyle = {
    ...fileInputStyle,
    borderColor: '#00cc66',
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
    marginTop: '12px',
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

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '18px',
  };

  const twoColumnGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
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
          
          input, select {
            box-sizing: border-box !important;
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 204, 102, 0.3);
            border-radius: 3px;
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
        {/* Register Card */}
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
              <h1 style={titleStyle}>Join the League</h1>
              <p style={subtitleStyle}>Register to become a team player</p>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              {/* Two column grid for first section */}
              <div style={gridContainerStyle}>
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={inputContainerStyle}>
                    <div style={iconStyle}>
                      <User style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={getInputStyle('fullName')}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <div style={inputContainerStyle}>
                    <div style={iconStyle}>
                      <Mail style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={getInputStyle('email')}
                      placeholder="player@team.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={inputContainerStyle}>
                    <div style={iconStyle}>
                      <Lock style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={getInputStyle('password')}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Two column grid for phone and student ID */}
                <div style={twoColumnGridStyle}>
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <div style={inputContainerStyle}>
                      <div style={iconStyle}>
                        <Phone style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle('phone')}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Student ID</label>
                    <div style={inputContainerStyle}>
                      <div style={iconStyle}>
                        <IdCard style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                      </div>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('studentId')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={getInputStyle('studentId')}
                        placeholder="Student ID"
                      />
                    </div>
                  </div>
                </div>

                {/* Two column grid for department and batch */}
                <div style={twoColumnGridStyle}>
                  <div>
                    <label style={labelStyle}>Department</label>
                    <div style={inputContainerStyle}>
                      <div style={iconStyle}>
                        <BookOpen style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                      </div>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('department')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={getInputStyle('department')}
                        placeholder="Department"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Batch (optional)</label>
                    <div style={inputContainerStyle}>
                      <div style={iconStyle}>
                        <Calendar style={{ width: '18px', height: '18px', color: '#a0d9b0' }} />
                      </div>
                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('batch')}
                        onBlur={() => setFocusedField(null)}
                        style={getInputStyle('batch')}
                        placeholder="Batch"
                      />
                    </div>
                  </div>
                </div>

                {/* ID Uploads - Two columns */}
                <div style={twoColumnGridStyle}>
                  <div>
                    <label style={labelStyle}>ID Front *</label>
                    <input
                      type="file"
                      onChange={(e) => setIdFront(e.target.files[0])}
                      required
                      style={fileInputStyle}
                      onFocus={(e) => e.target.style = fileInputFocusStyle}
                      onBlur={(e) => e.target.style = fileInputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>ID Back *</label>
                    <input
                      type="file"
                      onChange={(e) => setIdBack(e.target.files[0])}
                      required
                      style={fileInputStyle}
                      onFocus={(e) => e.target.style = fileInputFocusStyle}
                      onBlur={(e) => e.target.style = fileInputStyle}
                    />
                  </div>
                </div>

                {/* Hidden role field */}
                <input type="hidden" name="role" value="PLAYER" />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={buttonStyle}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={loadingSpinnerStyle}></div>
                      Registering...
                    </div>
                  ) : (
                    'Join Now'
                  )}
                </button>

                {/* Message */}
                {message.text && (
                  <div style={messageStyle(message.type)}>
                    <span style={{ marginRight: '8px' }}>{message.type === 'success' ? '⚽' : '❌'}</span>
                    {message.text}
                  </div>
                )}
              </div>
            </form>

            {/* Footer */}
            <div style={footerStyle}>
              <p style={footerTextStyle}>
                Already have an account?
                <Link
                  to="/login"
                  style={linkStyle}
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}