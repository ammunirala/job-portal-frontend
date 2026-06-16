import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, IndianRupee, Calendar } from 'lucide-react';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    salaryMin: '', salaryMax: '', jobType: 'FULL_TIME',
    category: '', deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      });
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:600, margin:'0 auto' }}>

        <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>
          Post a <span className="gradient-text">Job</span>
        </h1>
        <p style={{ color:'#9ca3af', marginBottom:32 }}>
          Fill in the details to attract the right candidates
        </p>

        <div className="glass" style={{ padding:32 }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom:16 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Job Title *</label>
              <div className="input-wrap">
                <Briefcase size={16} color="#9ca3af" />
                <input placeholder="e.g. Java Backend Developer"
                  value={form.title}
                  onChange={e => setForm({...form, title:e.target.value})}
                  required />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Description *</label>
              <textarea
                placeholder="Job description, requirements, responsibilities..."
                value={form.description}
                onChange={e => setForm({...form, description:e.target.value})}
                required rows={4}
                style={{ width:'100%', background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
                  padding:'12px 16px', color:'white',
                  fontFamily:'Inter,sans-serif', fontSize:14,
                  outline:'none', resize:'vertical' }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Location *</label>
              <div className="input-wrap">
                <MapPin size={16} color="#9ca3af" />
                <input placeholder="e.g. Bangalore, Remote"
                  value={form.location}
                  onChange={e => setForm({...form, location:e.target.value})}
                  required />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:12, marginBottom:16 }}>
              <div>
                <label style={{ color:'#9ca3af', fontSize:13,
                  display:'block', marginBottom:8 }}>Min Salary (₹)</label>
                <div className="input-wrap">
                  <IndianRupee size={16} color="#9ca3af" />
                  <input type="number" placeholder="400000"
                    value={form.salaryMin}
                    onChange={e => setForm({...form, salaryMin:e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ color:'#9ca3af', fontSize:13,
                  display:'block', marginBottom:8 }}>Max Salary (₹)</label>
                <div className="input-wrap">
                  <IndianRupee size={16} color="#9ca3af" />
                  <input type="number" placeholder="800000"
                    value={form.salaryMax}
                    onChange={e => setForm({...form, salaryMax:e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:12, marginBottom:16 }}>
              <div>
                <label style={{ color:'#9ca3af', fontSize:13,
                  display:'block', marginBottom:8 }}>Job Type *</label>
                <select value={form.jobType}
                  onChange={e => setForm({...form, jobType:e.target.value})}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
              <div>
                <label style={{ color:'#9ca3af', fontSize:13,
                  display:'block', marginBottom:8 }}>Category</label>
                <div className="input-wrap">
                  <input placeholder="e.g. IT, Finance"
                    value={form.category}
                    onChange={e => setForm({...form, category:e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={{ color:'#9ca3af', fontSize:13,
                display:'block', marginBottom:8 }}>Application Deadline</label>
              <div className="input-wrap">
                <Calendar size={16} color="#9ca3af" />
                <input type="date"
                  value={form.deadline}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, deadline:e.target.value})}
                  style={{ colorScheme:'dark' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width:'100%', borderRadius:12,
                opacity:loading ? 0.6 : 1 }}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}