import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin, IndianRupee, Clock, Briefcase,
  CheckCircle, XCircle, Zap, ArrowLeft } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data);
    } catch {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      toast.success('Applied successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleMatchScore = async () => {
    if (!user) { navigate('/login'); return; }
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await api.get(`/match/${id}`);
      setMatchResult(res.data.data);
      toast.success('Match score calculated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to calculate match');
    } finally {
      setMatchLoading(false);
    }
  };

  const typeStyle = {
    FULL_TIME:  { bg:'rgba(74,222,128,0.1)',  color:'#4ade80' },
    PART_TIME:  { bg:'rgba(96,165,250,0.1)',  color:'#60a5fa' },
    INTERNSHIP: { bg:'rgba(251,191,36,0.1)', color:'#fbbf24' },
    REMOTE:     { bg:'rgba(168,85,247,0.1)', color:'#a855f7' },
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80';
    if (score >= 40) return '#fbbf24';
    return '#f87171';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'rgba(74,222,128,0.1)';
    if (score >= 40) return 'rgba(251,191,36,0.1)';
    return 'rgba(248,113,113,0.1)';
  };

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#0f0f13',
        padding:'96px 24px', textAlign:'center' }}>
        <p style={{ color:'#9ca3af' }}>Loading job...</p>
      </div>
    );
  }

  if (!job) return null;

  const ts = typeStyle[job.jobType] || { bg:'rgba(156,163,175,0.1)', color:'#9ca3af' };

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13',
      padding:'96px 24px 48px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>

        {/* Back button */}
        <button onClick={() => navigate('/jobs')}
          style={{ background:'none', border:'none', cursor:'pointer',
            color:'#9ca3af', display:'flex', alignItems:'center',
            gap:6, fontSize:14, marginBottom:24 }}>
          <ArrowLeft size={16}/> Back to Jobs
        </button>

        {/* Job Header */}
        <div className="glass" style={{ padding:32, marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between',
            alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:26, fontWeight:700,
                marginBottom:6 }}>{job.title}</h1>
              <p style={{ color:'#9ca3af', fontSize:15 }}>
                {job.recruiterName}
              </p>
            </div>
            <span style={{ background:ts.bg, color:ts.color,
              fontSize:12, padding:'5px 12px', borderRadius:999,
              fontWeight:500, whiteSpace:'nowrap' }}>
              {job.jobType?.replace('_', ' ')}
            </span>
          </div>

          {/* Job Meta */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:16,
            fontSize:13, color:'#9ca3af', marginBottom:20 }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MapPin size={14}/> {job.location}
            </span>
            {job.salaryMin && (
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <IndianRupee size={14}/>
                ₹{(job.salaryMin/100000).toFixed(1)}L –
                ₹{(job.salaryMax/100000).toFixed(1)}L
              </span>
            )}
            {job.deadline && (
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Clock size={14}/> Deadline: {job.deadline}
              </span>
            )}
            {job.category && (
              <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Briefcase size={14}/> {job.category}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)',
            paddingTop:20 }}>
            <h3 style={{ fontWeight:600, marginBottom:12, fontSize:15 }}>
              Job Description
            </h3>
            <p style={{ color:'#9ca3af', lineHeight:1.8, fontSize:14,
              whiteSpace:'pre-wrap' }}>
              {job.description}
            </p>
          </div>
        </div>

        {/* AI Match Score Section — Jobseeker only */}
        {user?.role === 'JOBSEEKER' && (
          <div className="glass" style={{ padding:24, marginBottom:20,
            border:'1px solid rgba(99,102,241,0.2)' }}>

            <div style={{ display:'flex', alignItems:'center',
              justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <h3 style={{ fontWeight:600, fontSize:15,
                  display:'flex', alignItems:'center', gap:8 }}>
                  <Zap size={18} color="#6366f1"/>
                  AI Resume Match Score
                </h3>
                <p style={{ color:'#9ca3af', fontSize:12, marginTop:4 }}>
                  See how well your profile matches this job
                </p>
              </div>
              <button onClick={handleMatchScore}
                disabled={matchLoading}
                className="btn btn-primary"
                style={{ borderRadius:10, padding:'10px 20px',
                  fontSize:13, opacity: matchLoading ? 0.7 : 1 }}>
                {matchLoading ? 'Analyzing...' : 'Check Match'}
              </button>
            </div>

            {/* Match Result */}
            {matchResult && (
              <div className="fade-in">

                {/* Score circle */}
                <div style={{ display:'flex', alignItems:'center',
                  gap:20, marginBottom:20,
                  padding:20, borderRadius:12,
                  background: getScoreBg(matchResult.matchPercentage) }}>
                  <div style={{ width:80, height:80, borderRadius:'50%',
                    border:`4px solid ${getScoreColor(matchResult.matchPercentage)}`,
                    display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:22, fontWeight:700,
                      color: getScoreColor(matchResult.matchPercentage) }}>
                      {matchResult.matchPercentage}%
                    </span>
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:16,
                      color: getScoreColor(matchResult.matchPercentage) }}>
                      {matchResult.matchPercentage >= 70 ? 'Great Match! 🎉' :
                       matchResult.matchPercentage >= 40 ? 'Decent Match 👍' :
                       'Needs Improvement 📚'}
                    </p>
                    <p style={{ color:'#9ca3af', fontSize:13,
                      marginTop:4, lineHeight:1.6 }}>
                      {matchResult.feedback}
                    </p>
                  </div>
                </div>

                {/* Skills grid */}
                <div style={{ display:'grid',
                  gridTemplateColumns:'1fr 1fr', gap:12 }}>

                  {/* Matching skills */}
                  <div style={{ background:'rgba(74,222,128,0.05)',
                    border:'1px solid rgba(74,222,128,0.2)',
                    borderRadius:12, padding:16 }}>
                    <p style={{ color:'#4ade80', fontWeight:600,
                      fontSize:13, marginBottom:10,
                      display:'flex', alignItems:'center', gap:6 }}>
                      <CheckCircle size={14}/> Matching Skills
                    </p>
                    {matchResult.matchingSkills.length > 0 ? (
                      matchResult.matchingSkills.map((skill, i) => (
                        <span key={i} style={{ display:'inline-block',
                          background:'rgba(74,222,128,0.1)',
                          color:'#4ade80', fontSize:11,
                          padding:'3px 10px', borderRadius:999,
                          margin:'3px 3px 3px 0' }}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p style={{ color:'#9ca3af', fontSize:12 }}>
                        No matching skills found
                      </p>
                    )}
                  </div>

                  {/* Missing skills */}
                  <div style={{ background:'rgba(248,113,113,0.05)',
                    border:'1px solid rgba(248,113,113,0.2)',
                    borderRadius:12, padding:16 }}>
                    <p style={{ color:'#f87171', fontWeight:600,
                      fontSize:13, marginBottom:10,
                      display:'flex', alignItems:'center', gap:6 }}>
                      <XCircle size={14}/> Skills to Learn
                    </p>
                    {matchResult.missingSkills.length > 0 ? (
                      matchResult.missingSkills.map((skill, i) => (
                        <span key={i} style={{ display:'inline-block',
                          background:'rgba(248,113,113,0.1)',
                          color:'#f87171', fontSize:11,
                          padding:'3px 10px', borderRadius:999,
                          margin:'3px 3px 3px 0' }}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p style={{ color:'#9ca3af', fontSize:12 }}>
                        You have all required skills! 🎉
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Apply Section */}
        {user?.role === 'JOBSEEKER' && (
          <div className="glass" style={{ padding:24 }}>
            <h3 style={{ fontWeight:600, marginBottom:16 }}>
              Apply for this Job
            </h3>
            <textarea
              placeholder="Write a cover letter (optional)..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={4}
              style={{ width:'100%',
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12, padding:'12px 16px',
                color:'white', fontFamily:'Inter,sans-serif',
                fontSize:14, outline:'none',
                resize:'vertical', marginBottom:16 }} />
            <button onClick={handleApply} disabled={applying}
              className="btn btn-primary"
              style={{ width:'100%', borderRadius:12,
                opacity: applying ? 0.6 : 1 }}>
              {applying ? 'Applying...' : 'Apply Now 🚀'}
            </button>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="glass" style={{ padding:24,
            textAlign:'center' }}>
            <p style={{ color:'#9ca3af', marginBottom:16 }}>
              Login to apply and check match score
            </p>
            <button onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ borderRadius:12 }}>
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}