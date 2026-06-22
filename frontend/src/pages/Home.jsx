import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const faqs = [
    {
      q: "Is Kraft Onboarder completely free?",
      a: "Yes! All 120 professional layouts, PDF downloads, and live ATS matching features are 100% free with no credit card required."
    },
    {
      q: "How does the live ATS Match scanner work?",
      a: "Our scanner analyzes your draft against your target job description. It rates your competency match, checks contact links, flags weak buzzwords, and scores layout quality to optimize your call-backs."
    },
    {
      q: "Can I customize the colors, headers, and spacing?",
      a: "Absolutely! Kraft lets you swap themes (like Midnight, Plum, Sapphire, Onyx), change typography (Lora serif, Outfit modern, Roboto Mono monospace), and adjust vertical columns instantly in the editor."
    },
    {
      q: "How secure is my profile information?",
      a: "Your data is strictly yours. We store it securely in your account to enable auto-saving. We never sell your personal information or resume drafts to third-party databases."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-container">
      {/* Aurora Background Effects */}
      <div className="aurora-glow aurora-1 no-print"></div>
      <div className="aurora-glow aurora-2 no-print"></div>
      <div className="aurora-glow aurora-3 no-print"></div>

      <header className="landing-header">
        <div className="logo" style={{ color: "#ffffff", fontWeight: "900", letterSpacing: "2px" }}>
          KRAFT
        </div>
        <nav className="landing-nav">
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-btn hero-btn primary" style={{ padding: "8px 20px" }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn" style={{ color: "#8f95b2", textDecoration: "none", alignSelf: "center", marginRight: "10px" }}>
                Log In
              </Link>
              <Link to="/register" className="nav-btn hero-btn primary" style={{ padding: "8px 20px" }}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="landing-hero" style={{ padding: "60px 20px" }}>
        <div className="hero-content">
          <span style={{ color: "var(--color-primary)", fontWeight: "600", fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
            The Ultimate Profile Builder
          </span>
          <h1>Build ATS-Optimized Resumes in Seconds</h1>
          <p>
            Create a professional, print-ready resume, analyze your ATS compatibility score in real-time, scan for formatting bugs, and download in PDF or editable formats.
          </p>
          <div className="hero-actions">
            {isLoggedIn ? (
              <Link to="/dashboard" className="hero-btn primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="hero-btn primary">
                  Start for Free
                </Link>
                <Link to="/login" className="hero-btn secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="landing-features" style={{ marginTop: "80px" }}>
            <div className="feature-card">
              <h3>ATS Match Scoring</h3>
              <p>
                Analyze structural quality, key competency match, action verbs, and links overlap against any job description.
              </p>
            </div>
            <div className="feature-card">
              <h3>120+ Professional Designs</h3>
              <p>
                Switch between 120 elegant templates (Obsidian Executive, Emerald Executive, Ruby Timeline) and custom layouts instantly.
              </p>
            </div>
            <div className="feature-card">
              <h3>Live Optimization</h3>
              <p>
                Watch your match rating increase in real-time as you write and incorporate missing technical keywords in the editor.
              </p>
            </div>
          </div>

          {/* Interactive FAQ Section */}
          <div className="landing-faq-section" style={{ marginTop: "60px", width: "100%", maxWidth: "900px", textAlign: "left" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", textAlign: "center", marginBottom: "45px" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ 
                  background: "rgba(10, 10, 12, 0.55)", 
                  border: "1px solid rgba(255, 255, 255, 0.04)", 
                  borderRadius: "8px", 
                  overflow: "hidden", 
                  transition: "all 0.2s ease" 
                }}>
                  <button 
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      padding: "20px 24px",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ 
                      transform: activeFaq === idx ? "rotate(45deg)" : "rotate(0deg)", 
                      transition: "transform 0.2s ease",
                      color: "var(--color-primary)",
                      fontSize: "20px"
                    }}>+</span>
                  </button>
                  {activeFaq === idx && (
                    <div style={{ 
                      padding: "0 24px 24px 24px", 
                      color: "#8f95b2", 
                      fontSize: "14px", 
                      lineHeight: "1.6",
                      borderTop: "1px solid rgba(255,255,255,0.02)",
                      animation: "fadeIn 0.2s ease"
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Kraft Onboarder. All rights reserved.</p>
        <p style={{ color: "#8f95b2", fontSize: "13px", marginTop: "10px" }}>
          Built for job seekers globally.
        </p>
      </footer>
    </div>
  );
}

export default Home;
