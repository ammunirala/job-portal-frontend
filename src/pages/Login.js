import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, name, email, role } = res.data.data;
      login(token, { name, email, role });
      toast.success(`Welcome back, ${name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13', display:'flex',
      alignItems:'center', justifyContent:'center', padding:24 }}>

      <div style={{ position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', width:400, height:400,
        background:'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents:'none' }} />

      <div className="fade-in" style={{ width:'100%', maxWidth:420,
        position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div className="gradient-btn"
            style={{ width:48, height:48, borderRadius:14,
              margin:'0 auto 16px', fontSize:20 }}>
            <Briefcase size={22} />
          </div>
          <h1 style={{ fontSize:24, fontWeight:700 }}>Welcome back</h1>
          <p style={{ color:'#9ca3af', fontSize:14, marginTop:4 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding:32 }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom:20 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Email</label>
              <div className="input-wrap">
                <Mail size={16} color="#9ca3af" />
                <input type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  required />
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Password</label>
              <div className="input-wrap">
                <Lock size={16} color="#9ca3af" />
                <input type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  required />
                <button type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ background:'none', border:'none',
                    cursor:'pointer', color:'#9ca3af', display:'flex' }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width:'100%', borderRadius:12,
                opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', color:'#9ca3af',
            fontSize:14, marginTop:24 }}>
            Don't have an account?{' '}
            <Link to="/register" className="link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}