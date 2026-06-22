import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { templatePresets } from "../lib/templates";

// Lightweight high-fidelity mini resume preview renderer
function ResumeMiniPreview({ resumeData, templateId }) {
  const unpacked = resumeData || {};
  const fullname = unpacked.fullname || unpacked.personal?.name || "Your Name";
  const jobtitle = unpacked.jobtitle || unpacked.personal?.jobtitle || "Profession";
  const photo = unpacked.photo || unpacked.personal?.photo || "";
  const summary = unpacked.summary || unpacked.personal?.summary || "Short professional summary goes here to describe your background.";
  const skills = unpacked.skills || "React, JavaScript, CSS";
  const education = unpacked.education || [];
  const experience = unpacked.experience || [];

  const preset = templatePresets.find(t => t.id === templateId) || templatePresets[0];
  const isSingleColumn = preset.layout === "classic" || preset.layout === "timeline" || preset.layout === "bold-header";

  return (
    <div className="resume-mini-wrapper" style={{
      width: "84px",
      height: "118px",
      overflow: "hidden",
      position: "relative",
      borderRadius: "4px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "#ffffff"
    }}>
      <div 
        className={`a4-sheet layout-${preset.layout} theme-${preset.theme} font-${preset.font} header-${preset.header} ${preset.id}`}
        style={{
          transform: "scale(0.105)",
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          width: "800px",
          height: "1130px",
          margin: 0,
          padding: "3rem",
          boxSizing: "border-box",
          pointerEvents: "none",
          userSelect: "none",
          backgroundColor: "#ffffff",
          color: "#2c3e50"
        }}
      >
        {isSingleColumn ? (
          <>
            <div className="resume-header" style={{ marginBottom: "2rem" }}>
              <div className="resume-header-text">
                <h2 className="resume-title" style={{ fontSize: "28px", fontWeight: "800", color: "var(--theme-color, #1a1a3e)" }}>{fullname}</h2>
                <h3 className="resume-subtitle" style={{ fontSize: "16px", marginTop: "4px" }}>{jobtitle}</h3>
              </div>
            </div>
            <div className="resume-body">
              {summary && (
                <div className="resume-section">
                  <h4 className="section-title" style={{ fontSize: "14px", fontWeight: "700" }}>Summary</h4>
                  <div className="section-divider" style={{ height: "2px", background: "var(--theme-color, #ccc)", margin: "4px 0" }}></div>
                  <p style={{ fontSize: "11px", lineHeight: "1.4" }}>{summary}</p>
                </div>
              )}
              <div className="resume-section" style={{ marginTop: "1.5rem" }}>
                <h4 className="section-title" style={{ fontSize: "14px", fontWeight: "700" }}>Experience</h4>
                <div className="section-divider" style={{ height: "2px", background: "var(--theme-color, #ccc)", margin: "4px 0" }}></div>
                {experience.length > 0 ? (
                  experience.slice(0, 2).map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "12px" }}>
                        <span>{exp.role || "Role"}</span>
                        <span>{exp.dates}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "gray" }}>{exp.company}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: "11px", color: "gray" }}>Software Engineer at Acme Corp</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="resume-header" style={{ marginBottom: "1.5rem" }}>
              <h2 className="resume-title" style={{ fontSize: "28px", fontWeight: "800", color: "var(--theme-color, #1a1a3e)" }}>{fullname}</h2>
              <h3 className="resume-subtitle" style={{ fontSize: "16px", marginTop: "4px" }}>{jobtitle}</h3>
            </div>
            <div className="resume-split-body" style={{ display: "flex", gap: "1.5rem" }}>
              <div className="resume-sidebar-col" style={{ width: "35%" }}>
                {photo && (
                  <div className="resume-photo-container sidebar-photo" style={{ marginBottom: "1rem" }}>
                    <img src={photo} alt="Profile" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--theme-color, #ccc)" }} />
                  </div>
                )}
                <div className="sidebar-section" style={{ marginBottom: "1rem" }}>
                  <h4 className="section-title" style={{ fontSize: "13px", fontWeight: "700" }}>Contact</h4>
                  <div className="section-divider" style={{ height: "1px", background: "rgba(0,0,0,0.1)", margin: "4px 0" }}></div>
                  <div style={{ fontSize: "10px", lineHeight: "1.3" }}>
                    <div>email@address.com</div>
                    <div>+1 234 567 890</div>
                  </div>
                </div>
                <div className="sidebar-section">
                  <h4 className="section-title" style={{ fontSize: "13px", fontWeight: "700" }}>Skills</h4>
                  <div className="section-divider" style={{ height: "1px", background: "rgba(0,0,0,0.1)", margin: "4px 0" }}></div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px" }}>
                    {skills.split(",").slice(0, 5).map((s, idx) => (
                      <span key={idx} className="skill-capsule" style={{ fontSize: "9px", padding: "1px 4px", background: "#f1f5f9", borderRadius: "3px" }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="resume-main-col" style={{ width: "65%" }}>
                {summary && (
                  <div className="resume-section" style={{ marginBottom: "1rem" }}>
                    <h4 className="section-title" style={{ fontSize: "13px", fontWeight: "700" }}>Summary</h4>
                    <div className="section-divider" style={{ height: "1.5px", background: "var(--theme-color, #ccc)", margin: "4px 0" }}></div>
                    <p style={{ fontSize: "11px", lineHeight: "1.3" }}>{summary}</p>
                  </div>
                )}
                <div className="resume-section">
                  <h4 className="section-title" style={{ fontSize: "13px", fontWeight: "700" }}>Experience</h4>
                  <div className="section-divider" style={{ height: "1.5px", background: "var(--theme-color, #ccc)", margin: "4px 0" }}></div>
                  {experience.length > 0 ? (
                    experience.slice(0, 2).map((exp, idx) => (
                      <div key={idx} style={{ marginBottom: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "11px" }}>
                          <span>{exp.role}</span>
                          <span>{exp.dates}</span>
                        </div>
                        <div style={{ fontSize: "10px", color: "gray" }}>{exp.company}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "10px", color: "gray" }}>Senior Developer at Tech Labs</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Client-side resume profile optimization analyzer
function calculateResumeScore(resume) {
  const unpacked = resume.resumeData || {};
  
  // 1. Structure Check (20% weight)
  const hasSummary = (unpacked.summary || "").trim().length > 15;
  const hasEducation = (unpacked.education || []).length > 0;
  const hasExperience = (unpacked.experience || []).length > 0;
  const hasProjects = (unpacked.projects || []).length > 0;
  const structureScore = ((hasSummary + hasEducation + hasExperience + hasProjects) / 4) * 100;
  
  // 2. Contact Check (20% weight)
  const hasEmail = (unpacked.email || unpacked.personal?.email || "").trim().length > 5;
  const hasPhone = (unpacked.phone || unpacked.personal?.phone || "").trim().length > 7;
  const hasLinkedin = (unpacked.linkedin || unpacked.personal?.linkedin || "").trim().length > 10;
  const contactScore = ((hasEmail + hasPhone + hasLinkedin) / 3) * 100;
  
  // 3. Skills Check (60% weight)
  const skillsStr = (unpacked.skills || "").toLowerCase();
  const hardSkillsList = ['react', 'redux', 'typescript', 'javascript', 'html', 'css', 'git', 'github', 
    'python', 'django', 'flask', 'node', 'express', 'sql', 'mysql', 'postgres', 'mongodb', 'docker', 
    'redis', 'aws', 'gcp', 'kubernetes', 'azure', 'graphql', 'rest', 'api', 'java', 'php', 'figma', 
    'ci/cd', 'linux', 'sass', 'tailwind', 'angular', 'vue', 'golang', 'rust', 'ruby', 'rails', 
    'flutter', 'next.js', 'svelte', 'bootstrap', 'webpack', 'vite', 'jenkins', 'terraform', 
    'ansible', 'nginx', 'agile', 'scrum', 'jira', 'confluence', 'seo', 'excel', 'tableau', 'jest'];
  
  let skillMatches = 0;
  hardSkillsList.forEach(skill => {
    if (skillsStr.includes(skill)) skillMatches++;
  });
  const skillScore = Math.min(100, Math.round((skillMatches / 4) * 100)); // 4+ matches gives full score
  
  const score = Math.round((structureScore * 0.2) + (contactScore * 0.2) + (skillScore * 0.6));
  return Math.max(35, score); // minimum floor score is 35
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user details & resumes
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const userData = await userRes.json();
        setUser(userData);

        const resumesRes = await fetch(`${API_URL}/api/resumes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resumesData = await resumesRes.json();
        setResumes(resumesData);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Click outside to close dropdown
  useEffect(() => {
    if (!showProfileDropdown) return;
    const handleOutsideClick = () => setShowProfileDropdown(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showProfileDropdown]);

  const handleCreateResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "My Resume",
          templateId: "tpl-1",
        }),
      });

      if (!res.ok) throw new Error("Could not create resume draft");
      const newResume = await res.json();
      navigate(`/editor/${newResume.id}?new=true`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateResumeFromTemplate = async (templateId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "My Resume",
          templateId: templateId,
        }),
      });

      if (!res.ok) throw new Error("Could not create resume draft");
      const newResume = await res.json();
      navigate(`/editor/${newResume.id}?new=true`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete resume");
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="dashboard-loading">
          <div style={{ border: "4px solid rgba(255,255,255,0.05)", borderTop: "4px solid #ef4444", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", marginBottom: "16px" }}></div>
          <h3>Loading your dashboard...</h3>
        </div>
      </div>
    );
  }

  const avgAtsScore = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + calculateResumeScore(r), 0) / resumes.length)
    : 0;

  return (
    <div className="dashboard-container">
      {/* Abstract Glowing Mesh Auras */}
      <div className="dashboard-glow-mesh-1"></div>
      <div className="dashboard-glow-mesh-2"></div>

      <header className="dashboard-header">
        <div className="header-brand">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 style={{ display: "flex", alignItems: "center", gap: "1px", margin: 0 }}>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "0.08em", color: "#111827" }}>KRAFT</span>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "#ef4444" }}>.</span>
            </h1>
          </Link>
        </div>

        {user && (
          <div 
            className="profile-dropdown-wrapper" 
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileDropdown(!showProfileDropdown);
            }}
          >
            <div className="avatar-placeholder">
              {user.name ? user.name[0].toUpperCase() : "S"}
            </div>
            <div className="user-info">
              <span className="user-name" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {user.name} <span style={{ fontSize: "8px", color: "#8f95b2", transform: showProfileDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </span>
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-profile-header">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-stats">
                  <div className="dropdown-stats-row">
                    <span>Resumes created:</span>
                    <strong>{resumes.length} / 5</strong>
                  </div>
                  <div className="dropdown-stats-row">
                    <span>Average ATS Score:</span>
                    <strong>{avgAtsScore}%</strong>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-logout-btn">
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="dashboard-main">
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", padding: "10px 14px", borderRadius: "6px", fontSize: "14px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <div className="main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2>My Resumes</h2>
            <p>Create a new resume or edit your saved drafts below. Your changes auto-save as you type.</p>
          </div>
          {resumes.length > 0 && (
            <div className="header-stats-bar">
              Resumes: <span>{resumes.length}/5</span>
              <span className="stats-sep">|</span>
              Avg. ATS Score: <span>{avgAtsScore}%</span>
            </div>
          )}
        </div>

        <div className="resumes-grid">
          {/* Create card */}
          <div className="create-card" onClick={handleCreateResume}>
            <div className="create-inner">
              <div className="plus-circle-container">
                <span className="plus-icon">+</span>
              </div>
              <h3>Create New Resume</h3>
              <p>Answer Internshala questions and build from templates.</p>
            </div>
          </div>

          {/* Active Resumes */}
          {resumes.map((resume) => {
            const score = calculateResumeScore(resume);
            const isReady = score >= 75;
            return (
              <div key={resume.id} className="resume-card">
                <div className="card-body" style={{ position: "relative" }}>
                  {/* Status Badge */}
                  <span className={`card-status-badge ${isReady ? "status-ready" : "status-draft"}`}>
                    ● {isReady ? "Ready" : "Draft"}
                  </span>
                  
                  <div className="template-preview-thumbnail">
                    <ResumeMiniPreview resumeData={resume.resumeData} templateId={resume.templateId} />
                    <span className="template-badge">{(() => { const tpl = templatePresets.find(t => t.id === resume.templateId); return tpl ? tpl.name : 'Template'; })()}</span>
                  </div>
                  <h3>{resume.title}</h3>
                  <span className="updated-at">
                    Updated: {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="card-actions" style={{ alignItems: "center" }}>
                  {/* ATS Score Tag */}
                  <span className="ats-score-badge">
                    ATS: {score}%
                  </span>
                  
                  <Link to={`/editor/${resume.id}`} className="action-btn edit-btn">
                    Edit Resume
                  </Link>
                  <button
                    onClick={(e) => handleDeleteResume(resume.id, e)}
                    className="action-btn delete-btn"
                    title="Delete Draft"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Template Discovery Carousel Row */}
        <div className="template-carousel-section">
          <h2>Explore Professional Templates</h2>
          <p>Start a new resume draft immediately from one of our popular custom designs.</p>
          
          <div className="template-carousel-container">
            {[
              { id: "tpl-121", name: "Tech Minimalist", category: "Minimalist Tech", tag: "ATS Optimized" },
              { id: "tpl-140", name: "Emerald Corporate", category: "Executive Elite", tag: "Professional" },
              { id: "tpl-160", name: "Slate Executive", category: "Executive Elite", tag: "ATS Optimized" },
              { id: "tpl-180", name: "Creative Lavender", category: "Creative Design", tag: "Creative" },
              { id: "tpl-200", name: "Steel Developer", category: "Tech & Dev", tag: "ATS Optimized" },
              { id: "tpl-210", name: "Charcoal Magazine", category: "Creative Design", tag: "Creative" }
            ].map((tpl) => (
              <div 
                key={tpl.id} 
                className="template-discover-card"
                onClick={() => handleCreateResumeFromTemplate(tpl.id)}
              >
                <div className="template-discover-thumb">
                  <span className="template-discover-badge">{tpl.tag}</span>
                  <ResumeMiniPreview resumeData={{}} templateId={tpl.id} />
                </div>
                <div className="template-discover-info">
                  <h4>{tpl.name}</h4>
                  <span>{tpl.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
