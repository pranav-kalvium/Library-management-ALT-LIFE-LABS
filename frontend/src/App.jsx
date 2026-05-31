import React from 'react';
import Dashboard from './components/Dashboard';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  padding: '0 40px',
  background: '#111827',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  fontFamily: "'Source Sans 3', sans-serif",
};

const logoStyle = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#ffffff',
  letterSpacing: '-0.02em',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const logoBadgeStyle = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '4px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Source Sans 3', 'Segoe UI', -apple-system, sans-serif;
    background: #f0f2f5;
    color: #1f2937;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }
`;

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <nav style={navStyle}>
        <div style={logoStyle}>
          <span>📖 LibMgmt</span>
          <span style={logoBadgeStyle}>Dashboard</span>
        </div>
      </nav>
      <Dashboard />
    </>
  );
}
