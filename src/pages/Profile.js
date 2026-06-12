import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Link2, Briefcase, Upload, Save } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bio:'', skills:'', linkedinUrl:'', experienceYears:0
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(res => {
      const d = res.data.data;
      setForm({
        bio: d.bio || '',
        skills: d.skills || '',
        linkedinUrl: d.linkedinUrl || '',
        experienceYears: d.experienceYears || 0,
      });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profile', form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await api.post('/profile/resume', fd);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:600, margin:'0 auto' }}>

        <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>
          My <span className="gradient-text">Profile</span>
        </h1>
        <p style={{ color:'#9ca3af', marginBottom:32 }}>
          Keep your profile updated
        </p>

        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center',
          gap:16, marginBottom:32 }}>
          <div className="gradient-btn"
            style={{ width:64, height:64, borderRadius:'50%',
              fontSize:24, fontWeight:700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight:600, fontSize:18 }}>{user?.name}</p>
            <p style={{ color:'#9ca3af', fontSize:14 }}>{user?.email}</p>
            <span style={{ background:'rgba(99,102,241,0.15)',
              color:'#6366f1', fontSize:11, padding:'2px 10px',
              borderRadius:999, marginTop:4, display:'inline-block' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="glass" style={{ padding:32, marginBottom:20 }}>
          <form onSubmit={handleSave}>

            <div style={{ marginBottom:20 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({...form, bio:e.target.value})}
                placeholder="Tell recruiters about yourself..."
                rows={3}
                style={{ width:'100%', background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
                  padding:'12px 16px', color:'white', fontFamily:'Inter,sans-serif',
                  fontSize:14, outline:'none', resize:'vertical' }} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Skills</label>
              <div className="input-wrap">
                <Briefcase size={16} color="#9ca3af" />
                <input placeholder="Java, Spring Boot, React, MySQL"
                  value={form.skills}
                  onChange={e => setForm({...form, skills:e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>LinkedIn URL</label>
              <div className="input-wrap">
                <Link2 size={16} color="#9ca3af" />
                <input placeholder="https://linkedin.com/in/..."
                  value={form.linkedinUrl}
                  onChange={e => setForm({...form, linkedinUrl:e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Experience (years)</label>
              <div className="input-wrap">
                <User size={16} color="#9ca3af" />
                <input type="number" min={0} max={50}
                  value={form.experienceYears}
                  onChange={e => setForm({...form,
                    experienceYears:parseInt(e.target.value)})} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width:'100%', borderRadius:12,
                display:'flex', alignItems:'center',
                justifyContent:'center', gap:8,
                opacity:loading ? 0.6 : 1 }}>
              <Save size={16}/>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Resume upload */}
        {user?.role === 'JOBSEEKER' && (
          <div className="glass" style={{ padding:24 }}>
            <h3 style={{ fontWeight:600, marginBottom:16,
              display:'flex', alignItems:'center', gap:8 }}>
              <Upload size={18} color="#6366f1"/> Upload Resume
            </h3>
            <label style={{ display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              padding:'32px', border:'2px dashed rgba(99,102,241,0.3)',
              borderRadius:12, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'}>
              <Upload size={28} color="#6366f1"
                style={{ marginBottom:8 }} />
              <p style={{ color:'#9ca3af', fontSize:14 }}>
                {uploading ? 'Uploading...' : 'Click to upload PDF resume'}
              </p>
              <p style={{ color:'#6b7280', fontSize:12, marginTop:4 }}>
                Max 5MB — PDF only
              </p>
              <input type="file" accept=".pdf"
                onChange={handleResume} style={{ display:'none' }} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}