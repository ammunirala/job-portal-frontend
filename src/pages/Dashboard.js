import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, CheckCircle, XCircle, Clock,
  TrendingUp, Plus, MapPin } from 'lucide-react';

const statusCfg = {
  APPLIED:     { color:'#60a5fa', bg:'rgba(96,165,250,0.1)',   Icon: Clock },
  SHORTLISTED: { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  Icon: TrendingUp },
  HIRED:       { color:'#4ade80', bg:'rgba(74,222,128,0.1)',   Icon: CheckCircle },
  REJECTED:    { color:'#f87171', bg:'rgba(248,113,113,0.1)', Icon: XCircle },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (user?.role === 'JOBSEEKER') fetchApplications();
   if (user?.role === 'RECRUITER') fetchMyJobs();
 }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data.data.content || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my');
      setMyJobs(res.data.data.content || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:40 }}>
          <div>
            <h1 style={{ fontSize:30, fontWeight:700 }}>
              Hey, <span className="gradient-text">{user?.name}! 👋</span>
            </h1>
            <p style={{ color:'#9ca3af', marginTop:6 }}>
              {user?.role === 'JOBSEEKER'
                ? 'Track your applications below'
                : 'Manage your job postings'}
            </p>
          </div>
          {user?.role === 'RECRUITER' && (
            <button className="btn btn-primary"
              style={{ borderRadius:12, display:'flex',
                alignItems:'center', gap:6 }}>
              <Plus size={16}/> Post Job
            </button>
          )}
        </div>

        {/* Jobseeker */}
        {user?.role === 'JOBSEEKER' && (
          <>
            {/* Stat cards */}
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
              {Object.entries(statusCfg).map(([status, cfg]) => {
                const count = applications.filter(a => a.status === status).length;
                return (
                  <div key={status} className="stat-card">
                    <div style={{ width:36, height:36, borderRadius:10,
                      background:cfg.bg, display:'flex',
                      alignItems:'center', justifyContent:'center',
                      marginBottom:12 }}>
                      <cfg.Icon size={18} color={cfg.color} />
                    </div>
                    <p style={{ fontSize:28, fontWeight:700 }}>{count}</p>
                    <p style={{ color:'#9ca3af', fontSize:12, marginTop:4,
                      textTransform:'capitalize' }}>
                      {status.toLowerCase()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Applications list */}
            <div className="glass" style={{ padding:24 }}>
              <h2 style={{ fontWeight:600, marginBottom:20 }}>
                My Applications
              </h2>
              {loading ? (
                <p style={{ color:'#9ca3af', fontSize:14 }}>Loading...</p>
              ) : applications.length === 0 ? (
                <div style={{ textAlign:'center', padding:'48px 0' }}>
                  <Briefcase size={40} color="#4b5563"
                    style={{ margin:'0 auto 12px', display:'block' }} />
                  <p style={{ color:'#9ca3af', fontSize:14 }}>
                    No applications yet
                  </p>
                  <Link to="/jobs" className="link"
                    style={{ fontSize:14, marginTop:8, display:'inline-block' }}>
                    Browse Jobs →
                  </Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {applications.map(app => {
                    const cfg = statusCfg[app.status];
                    return (
                      <div key={app.id}
                        style={{ display:'flex', justifyContent:'space-between',
                          alignItems:'center', padding:'16px 20px',
                          background:'rgba(255,255,255,0.03)',
                          borderRadius:12,
                          border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <p style={{ fontWeight:500, fontSize:14 }}>
                            {app.jobTitle}
                          </p>
                          <p style={{ color:'#9ca3af', fontSize:12,
                            marginTop:2, display:'flex',
                            alignItems:'center', gap:4 }}>
                            <MapPin size={10}/> {app.companyLocation}
                          </p>
                        </div>
                        <span style={{ background:cfg.bg, color:cfg.color,
                          fontSize:11, padding:'4px 12px',
                          borderRadius:999, fontWeight:500 }}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Recruiter */}
        {user?.role === 'RECRUITER' && (
          <div className="glass" style={{ padding:24 }}>
            <h2 style={{ fontWeight:600, marginBottom:20 }}>
              My Job Postings
            </h2>
            {loading ? (
              <p style={{ color:'#9ca3af', fontSize:14 }}>Loading...</p>
            ) : myJobs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 0' }}>
                <p style={{ color:'#9ca3af', fontSize:14 }}>
                  No jobs posted yet
                </p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {myJobs.map(job => (
                  <div key={job.id}
                    style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'center', padding:'16px 20px',
                      background:'rgba(255,255,255,0.03)',
                      borderRadius:12,
                      border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p style={{ fontWeight:500, fontSize:14 }}>
                        {job.title}
                      </p>
                      <p style={{ color:'#9ca3af', fontSize:12,
                        marginTop:2 }}>{job.location}</p>
                    </div>
                    <span style={{
                      background: job.status === 'ACTIVE'
                        ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                      color: job.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                      fontSize:11, padding:'4px 12px',
                      borderRadius:999, fontWeight:500 }}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}