import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Filter } from 'lucide-react';

const typeStyle = {
  FULL_TIME:   { bg:'rgba(74,222,128,0.1)',  color:'#4ade80' },
  PART_TIME:   { bg:'rgba(96,165,250,0.1)',  color:'#60a5fa' },
  INTERNSHIP:  { bg:'rgba(251,191,36,0.1)', color:'#fbbf24' },
  REMOTE:      { bg:'rgba(168,85,247,0.1)', color:'#a855f7' },
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (location) params.append('location', location);
      if (jobType) params.append('jobType', jobType);
      params.append('page', 0);
      params.append('size', 20);
      const res = await api.get(`/jobs/search?${params}`);
      setJobs(res.data.data.content || []);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        <h1 style={{ fontSize:32, fontWeight:700, marginBottom:8 }}>
          Browse <span className="gradient-text">Jobs</span>
        </h1>
        <p style={{ color:'#9ca3af', marginBottom:32 }}>
          Find your perfect opportunity
        </p>

        {/* Filters */}
        <div className="glass" style={{ padding:24, marginBottom:32,
          display:'grid',
          gridTemplateColumns:'1fr 1fr 180px 48px', gap:12 }}>
          <div className="input-wrap">
            <Search size={16} color="#9ca3af" />
            <input placeholder="Job title or skills..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()} />
          </div>
          <div className="input-wrap">
            <MapPin size={16} color="#9ca3af" />
            <input placeholder="Location..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()} />
          </div>
          <select value={jobType}
            onChange={e => setJobType(e.target.value)}>
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
          <button onClick={fetchJobs} className="btn btn-primary"
            style={{ borderRadius:12, padding:0 }}>
            <Filter size={18} />
          </button>
        </div>

        {/* Jobs grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} className="skeleton"
                style={{ height:160, borderRadius:16 }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <Briefcase size={48} color="#4b5563"
              style={{ margin:'0 auto 16px' }} />
            <p style={{ color:'#9ca3af' }}>
              No jobs found. Try different filters.
            </p>
          </div>
        ) : (
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(340px,1fr))',
            gap:16 }}>
            {jobs.map(job => {
              const ts = typeStyle[job.jobType] || { bg:'rgba(156,163,175,0.1)', color:'#9ca3af' };
              return (
                <Link to={`/jobs/${job.id}`} key={job.id}
                  className="card" style={{ display:'block' }}>

                  <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontWeight:600, fontSize:16,
                        marginBottom:4 }}>{job.title}</h3>
                      <p style={{ color:'#9ca3af', fontSize:13 }}>
                        {job.recruiterName}
                      </p>
                    </div>
                    <span style={{ background:ts.bg, color:ts.color,
                      fontSize:11, padding:'4px 10px', borderRadius:999,
                      fontWeight:500, whiteSpace:'nowrap' }}>
                      {job.jobType?.replace('_',' ')}
                    </span>
                  </div>

                  <div style={{ display:'flex', flexWrap:'wrap',
                    gap:12, fontSize:12, color:'#9ca3af', marginBottom:16 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <MapPin size={12}/> {job.location}
                    </span>
                    {job.salaryMin && (
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <IndianRupee size={12}/>
                        {(job.salaryMin/100000).toFixed(1)}L –{' '}
                        {(job.salaryMax/100000).toFixed(1)}L
                      </span>
                    )}
                    {job.deadline && (
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <Clock size={12}/> {job.deadline}
                      </span>
                    )}
                  </div>

                  {job.category && (
                    <span style={{ background:'rgba(99,102,241,0.15)',
                      color:'#6366f1', fontSize:11, padding:'3px 10px',
                      borderRadius:999 }}>
                      {job.category}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}