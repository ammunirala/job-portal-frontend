import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

const T = {
  bg: "#0f0f13",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  text: "#e8e8f0",
  muted: "#7b7b96",
  accent: "#7c6af7",
  accentGlow: "rgba(124,106,247,0.25)",
  SHORTLISTED: { bg: "rgba(250,204,21,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  REJECTED:    { bg: "rgba(239,68,68,0.10)",  color: "#f87171", border: "rgba(248,113,113,0.3)" },
  HIRED:       { bg: "rgba(34,197,94,0.10)",  color: "#4ade80", border: "rgba(74,222,128,0.3)" },
  APPLIED:     { bg: "rgba(148,163,184,0.10)",color: "#94a3b8", border: "rgba(148,163,184,0.3)" },
};

function StatusBadge({ status }) {
  const s = T[status] || T.APPLIED;
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  );
}

function StatusSelect({ current, onChange, loading }) {
  const options = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];
  return (
    <select
      value={current}
      disabled={loading}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        color: T.text,
        padding: "6px 10px",
        fontSize: 13,
        cursor: loading ? "not-allowed" : "pointer",
        outline: "none",
        transition: "border 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = T.accent)}
      onBlur={(e)  => (e.target.style.borderColor = T.border)}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#1a1a2e" }}>{o}</option>
      ))}
    </select>
  );
}

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: `linear-gradient(135deg, ${T.accent}, #a78bfa)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "16px 20px",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.surface }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ width: "40%", height: 13, borderRadius: 6, background: T.surface }} />
        <div style={{ width: "25%", height: 11, borderRadius: 6, background: T.surface }} />
      </div>
      <div style={{ width: 90, height: 28, borderRadius: 8, background: T.surface }} />
    </div>
  );
}

export default function ApplicantsList() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle]     = useState("Job");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [updating, setUpdating]     = useState({});
  const [toast, setToast]           = useState(null);
  const [filter, setFilter]         = useState("ALL");

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/jobs/${jobId}/applicants`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setApplicants(data);
        } else {
          setApplicants(data.applicants || []);
          if (data.jobTitle) setJobTitle(data.jobTitle);
        }
      })
      .catch(() => setError("Applicants load nahi ho sake. Dobara try karein."))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) =>
          a.applicationId === applicationId ? { ...a, status: newStatus } : a
        )
      );
      showToast(`Status updated → ${newStatus}`, "success");
    } catch {
      showToast("Update fail hua. Phir se try karein.", "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered =
    filter === "ALL"
      ? applicants
      : applicants.filter((a) => a.status === filter);

  const counts = ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].reduce((acc, s) => {
    acc[s] = applicants.filter((a) => a.status === s).length;
    return acc;
  }, {});

  const card = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflow: "hidden",
  };

  const filterBtn = (val) => ({
    padding: "6px 16px",
    borderRadius: 20,
    border: `1px solid ${filter === val ? T.accent : T.border}`,
    background: filter === val ? T.accentGlow : "transparent",
    color: filter === val ? T.accent : T.muted,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "32px 20px", fontFamily: "'Inter', sans-serif", color: T.text }}>
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${toast.type === "success" ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
          color: toast.type === "success" ? "#4ade80" : "#f87171",
          padding: "12px 20px", borderRadius: 12,
          backdropFilter: "blur(10px)",
          fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: T.muted, fontSize: 13, marginBottom: 6 }}>Recruiter Dashboard</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            {jobTitle} — Applicants
          </h1>
          {!loading && !error && (
            <p style={{ color: T.muted, fontSize: 14, marginTop: 6 }}>
              {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!loading && !error && applicants.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { label: "Applied",     key: "APPLIED",     c: T.APPLIED },
              { label: "Shortlisted", key: "SHORTLISTED", c: T.SHORTLISTED },
              { label: "Hired",       key: "HIRED",       c: T.HIRED },
              { label: "Rejected",    key: "REJECTED",    c: T.REJECTED },
            ].map(({ label, key, c }) => (
              <div key={key} style={{
                padding: "6px 14px", borderRadius: 20,
                background: c.bg, border: `1px solid ${c.border}`,
                color: c.color, fontSize: 13, fontWeight: 600,
              }}>
                {counts[key]} {label}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && applicants.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["ALL", "APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={filterBtn(f)}>
                {f === "ALL" ? `All (${applicants.length})` : f}
              </button>
            ))}
          </div>
        )}

        <div style={card}>
          {loading && (
            <div>
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: "#f87171", marginBottom: 16 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "8px 20px", borderRadius: 8,
                  background: T.accentGlow, border: `1px solid ${T.accent}`,
                  color: T.accent, cursor: "pointer", fontSize: 13,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && applicants.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <p style={{ color: T.muted, fontSize: 15 }}>Abhi tak kisi ne apply nahi kiya.</p>
            </div>
          )}

          {!loading && !error && applicants.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ color: T.muted }}>Is category mein koi applicant nahi.</p>
            </div>
          )}

          {!loading && !error && filtered.map((applicant, idx) => (
            <div
              key={applicant.applicationId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                borderBottom: idx < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Avatar name={applicant.applicantName} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {applicant.applicantName}
                </p>
                <p style={{ margin: "2px 0 0", color: T.muted, fontSize: 12 }}>
                  {applicant.applicantEmail}
                  {applicant.appliedAt && (
                    <span style={{ marginLeft: 8 }}>
                      · {new Date(applicant.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </p>
              </div>

              {applicant.resumeUrl && (
              <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    color: T.muted, fontSize: 12, textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = T.accent; e.target.style.color = T.accent; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = T.border; e.target.style.color = T.muted; }}
                >
                  Resume ↗
                </a>
              )}

              <div style={{ display: "none" }}>
                <StatusBadge status={applicant.status} />
              </div>

              <StatusSelect
                current={applicant.status}
                loading={!!updating[applicant.applicationId]}
                onChange={(val) => handleStatusChange(applicant.applicationId, val)}
              />

              {updating[applicant.applicationId] && (
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: `2px solid ${T.border}`,
                  borderTopColor: T.accent,
                  animation: "spin 0.7s linear infinite",
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        select option { background: #1a1a2e; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}