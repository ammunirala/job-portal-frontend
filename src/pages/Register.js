import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    name:'', email:'', password:'', role:'JOBSEEKER'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13', display:'flex',
      alignItems:'center', justifyContent:'center', padding:24 }}>

      <div style={{ position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', width:400, height:400,
        background:'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        pointerEvents:'none' }} />

      <div className="fade-in" style={{ width:'100%', maxWidth:420,
        position:'relative', zIndex:1 }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div className="gradient-btn"
            style={{ width:48, height:48, borderRadius:14,
              margin:'0 auto 16px' }}>
            <Briefcase size={22} />
          </div>
          <h1 style={{ fontSize:24, fontWeight:700 }}>Create Account</h1>
          <p style={{ color:'#9ca3af', fontSize:14, marginTop:4 }}>
            Join thousands of developers
          </p>
        </div>

        <div className="glass" style={{ padding:32 }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom:16 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Full Name</label>
              <div className="input-wrap">
                <User size={16} color="#9ca3af" />
                <input type="text" placeholder="Amresh Kumar"
                  value={form.name}
                  onChange={e => setForm({...form, name:e.target.value})}
                  required />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
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

            <div style={{ marginBottom:20 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Password</label>
              <div className="input-wrap">
                <Lock size={16} color="#9ca3af" />
                <input type="password" placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  required />
              </div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom:24 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>I am a...</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
                gap:12 }}>
                {[
                  { val:'JOBSEEKER', label:'🔍 Job Seeker' },
                  { val:'RECRUITER', label:'🏢 Recruiter' }
                ].map(r => (
                  <button key={r.val} type="button"
                    onClick={() => setForm({...form, role:r.val})}
                    style={{
                      padding:'12px', borderRadius:12, fontSize:14,
                      fontWeight:500, cursor:'pointer',
                      fontFamily:'Inter, sans-serif',
                      transition:'all 0.2s',
                      background: form.role === r.val
                        ? 'linear-gradient(135deg,#6366f1,#a855f7)'
                        : 'rgba(255,255,255,0.05)',
                      border: form.role === r.val
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.1)',
                      color:'white'
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width:'100%', borderRadius:12,
                opacity:loading ? 0.6 : 1 }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', color:'#9ca3af',
            fontSize:14, marginTop:24 }}>
            Already have an account?{' '}
            <Link to="/login" className="link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}