import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, TrendingUp, ArrowRight, Code, Database, Globe, Zap } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Active Jobs', value: '500+', icon: Briefcase },
    { label: 'Companies', value: '200+', icon: Users },
    { label: 'Hired', value: '1.2K', icon: TrendingUp },
  ];

  const categories = [
    { name: 'Software Dev', icon: Code, count: '120 jobs', color: '#6366f1' },
    { name: 'Data Science', icon: Database, count: '85 jobs', color: '#a855f7' },
    { name: 'Web Dev', icon: Globe, count: '95 jobs', color: '#ec4899' },
    { name: 'Full Stack', icon: Zap, count: '110 jobs', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f13' }}>

      {/* Hero */}
      <section style={{ position:'relative', paddingTop:140, paddingBottom:80,
        paddingInline:24, overflow:'hidden', textAlign:'center' }}>

        {/* Glow blobs */}
        <div style={{ position:'absolute', top:100, left:'50%',
          transform:'translateX(-50%)', width:500, height:500,
          background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents:'none' }} />

        <div className="fade-in" style={{ maxWidth:800, margin:'0 auto',
          position:'relative', zIndex:1 }}>

          {/* Pill badge */}
          <div className="float" style={{ display:'inline-flex', alignItems:'center',
            gap:8, background:'rgba(99,102,241,0.1)',
            border:'1px solid rgba(99,102,241,0.3)',
            borderRadius:999, padding:'6px 16px', fontSize:13,
            color:'#6366f1', marginBottom:24 }}>
            <span style={{ width:8, height:8, background:'#4ade80',
              borderRadius:'50%', display:'inline-block' }} className="pulse" />
            Now hiring freshers — 2026 batch open!
          </div>

          <h1 style={{ fontSize:'clamp(40px, 8vw, 72px)', fontWeight:800,
            lineHeight:1.1, marginBottom:24 }}>
            Find Your Dream
            <span className="gradient-text" style={{ display:'block' }}>
              Tech Job
            </span>
          </h1>

          <p style={{ color:'#9ca3af', fontSize:18, marginBottom:40,
            maxWidth:560, margin:'0 auto 40px' }}>
            Connect with top companies. Apply with one click.
            Track your applications in real-time.
          </p>

          {/* Search bar */}
          <div style={{ display:'flex', gap:12, maxWidth:640,
            margin:'0 auto 48px' }}>
            <div className="input-wrap" style={{ flex:1 }}>
              <Search size={18} color="#9ca3af" />
              <input placeholder="Job title, skills..." />
            </div>
            <Link to="/jobs" className="btn btn-primary"
              style={{ borderRadius:12, padding:'0 24px', whiteSpace:'nowrap',
                display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
              Search <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:16, maxWidth:480, margin:'0 auto' }}>
            {stats.map(s => (
              <div key={s.label} className="glass" style={{ padding:20 }}>
                <p className="gradient-text"
                  style={{ fontSize:28, fontWeight:700 }}>{s.value}</p>
                <p style={{ color:'#9ca3af', fontSize:12, marginTop:4 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding:'60px 24px', maxWidth:1000,
        margin:'0 auto' }}>
        <h2 style={{ fontSize:28, fontWeight:700, textAlign:'center',
          marginBottom:40 }}>
          Browse by <span className="gradient-text">Category</span>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:16 }}>
          {categories.map(cat => (
            <Link to="/jobs" key={cat.name} className="card"
              style={{ textAlign:'center', cursor:'pointer' }}>
              <div style={{ width:52, height:52, borderRadius:14,
                background:`${cat.color}22`, display:'flex',
                alignItems:'center', justifyContent:'center',
                margin:'0 auto 16px' }}>
                <cat.icon size={24} color={cat.color} />
              </div>
              <p style={{ fontWeight:600, fontSize:14 }}>{cat.name}</p>
              <p style={{ color:'#9ca3af', fontSize:12, marginTop:4 }}>
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'60px 24px 80px' }}>
        <div className="glass" style={{ maxWidth:700, margin:'0 auto',
          textAlign:'center', padding:'60px 40px', position:'relative',
          overflow:'hidden', border:'1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))',
            pointerEvents:'none' }} />
          <h2 style={{ fontSize:32, fontWeight:700, marginBottom:16 }}>
            Ready to start your{' '}
            <span className="gradient-text">journey?</span>
          </h2>
          <p style={{ color:'#9ca3af', marginBottom:32 }}>
            Join thousands of developers who found their dream job
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
            <Link to="/register" className="btn btn-primary"
              style={{ borderRadius:12 }}>
              Create Account
            </Link>
            <Link to="/jobs" className="btn btn-ghost"
              style={{ borderRadius:12 }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}