import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google authentication failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_placeholder.apps.googleusercontent.com";
  const isPlaceholder = GOOGLE_CLIENT_ID.includes("placeholder");

  useEffect(() => {
    // Initialize Google Sign-in if GSI SDK is loaded on page AND client ID is not placeholder
    if (window.google && !isPlaceholder) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "filled_dark", size: "large", width: "320" }
      );
    }
  }, [isPlaceholder]);

  const handleGoogleMockLogin = async () => {
    // Simulated Google Login for local test environments
    setLoading(true);
    try {
      const mockCredential = btoa(JSON.stringify({
        email: "demo-google-user@domain.com",
        name: "Google Demo Tester"
      }));

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: mockCredential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Mock Google auth error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authVideoBg = document.getElementById("auth-video-bg");
    if (!authVideoBg) return;

    const authBgVideos = [
      "/videos/video1.mp4",
      "/videos/video2.mp4",
      "/videos/video3.mp4",
      "/videos/video4.mp4",
      "/videos/video5.mp4",
      "/videos/video6.mp4"
    ];
    let currentIdx = 0;

    const playNextVideo = (idx) => {
      currentIdx = idx % authBgVideos.length;
      
      // Fade out video briefly before changing source for a smooth transition
      authVideoBg.style.opacity = "0";
      
      setTimeout(() => {
        authVideoBg.src = authBgVideos[currentIdx];
        authVideoBg.load();
        
        // When loaded, fade back in
        authVideoBg.onloadeddata = () => {
          authVideoBg.style.opacity = "0.85";
        };

        authVideoBg.play().catch(err => {
          console.log("Autoplay background video info:", err.message);
        });
      }, 500);
    };

    const handleEnded = () => {
      playNextVideo(currentIdx + 1);
    };

    const handleError = () => {
      console.warn(`Auth Background Video "${authBgVideos[currentIdx]}" not found. Retrying next video in 3 seconds...`);
      setTimeout(() => {
        playNextVideo(currentIdx + 1);
      }, 3000);
    };

    authVideoBg.addEventListener("ended", handleEnded);
    authVideoBg.addEventListener("error", handleError);

    playNextVideo(0);

    return () => {
      authVideoBg.removeEventListener("ended", handleEnded);
      authVideoBg.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div className="auth-screen">
      {/* Video Background Container */}
      <div className="auth-video-bg-container">
        <video id="auth-video-bg" muted autoPlay playsInline style={{ pointerEvents: "none" }}></video>
        <div className="auth-video-overlay"></div>
      </div>

      {/* Aurora effects */}
      <div className="aurora-glow aurora-1 no-print"></div>
      <div className="aurora-glow aurora-2 no-print"></div>
      <div className="aurora-glow aurora-3 no-print"></div>

      <div className="auth-card" style={{ zIndex: 10 }}>
        <div className="auth-header">
          <h3>Welcome Back</h3>
          <p>Log in to your Kraft account to manage and optimize your resumes.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", padding: "10px 14px", borderRadius: "6px", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="auth-email">Email Address <span className="required">*</span></label>
            <input
              type="email"
              id="auth-email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="auth-password">Password <span className="required">*</span></label>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="auth-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
                style={{ background: "none", border: "none", color: "var(--text-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: "20px 0" }}><span>OR</span></div>

        {isPlaceholder ? (
          <button className="btn btn-secondary btn-block" onClick={handleGoogleMockLogin} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.66-.35-1.36-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <div id="google-signin-button"></div>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-muted)", fontSize: "14px" }}>
          Don't have an account? <Link to="/register" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "500" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
