import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div className="gradient-btn"
          style={{ width:36, height:36, borderRadius:10 }}>
          <Briefcase size={18} />
        </div>
        <span style={{ fontWeight:700, fontSize:18 }}
          className="gradient-text">HYRO</span>
      </Link>

      {/* Center links */}
      <div style={{ display:'flex', alignItems:'center', gap:32 }}>
        <Link to="/jobs"
          style={{ color:'#9ca3af', fontSize:14, transition:'color 0.2s' }}
          onMouseEnter={e => e.target.style.color='#fff'}
          onMouseLeave={e => e.target.style.color='#9ca3af'}>
          Browse Jobs
        </Link>
      </div>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {!user ? (
          <>
            <Link to="/login"
              style={{ color:'#9ca3af', fontSize:14 }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary"
              style={{ padding:'8px 20px', borderRadius:10, fontSize:14 }}>
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard"
              style={{ color:'#9ca3af', fontSize:14, display:'flex',
                alignItems:'center', gap:6 }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/profile"
              style={{ color:'#9ca3af', fontSize:14, display:'flex',
                alignItems:'center', gap:6 }}>
              <User size={16} /> Profile
            </Link>
            <div className="gradient-btn"
              style={{ width:36, height:36, borderRadius:'50%',
                fontWeight:700, fontSize:14 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={logout}
              style={{ background:'none', border:'none', cursor:'pointer',
                color:'#9ca3af', display:'flex' }}>
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}