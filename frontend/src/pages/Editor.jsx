import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { templatePresets, themeHexMap, themeLightHexMap, themeDarkBgMap } from "../lib/templates";
import { runAtsAnalysis, jdPresets, buzzwordRules } from "../lib/ats";

const renderMiniLayoutThumbnail = (preset) => {
  const accent = themeHexMap[preset.theme] || "#475569";
  const lightBg = themeLightHexMap[preset.theme] || "#f1f5f9";
  const darkBg = themeDarkBgMap[preset.theme] || "#1c1c1e";
  const isDarkLayout = preset.layout === "dark-left" || preset.layout === "dark-right";
  const isBoldHeader = preset.layout === "bold-header";
  const isMagazine = preset.layout === "magazine";
  const isSplit = preset.layout.startsWith("split-") || isDarkLayout || isMagazine;

  // Outer thumbnail box styling: white-ish sheet preview
  const sheetStyle = {
    height: "100px",
    background: "#ffffff",
    borderRadius: "6px",
    padding: "6px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    position: "relative",
    boxSizing: "border-box",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    marginBottom: "12px"
  };

  // Main text bar line helper
  const bar = (width, customStyle = {}) => (
    <div style={{ height: "3px", background: "#e2e8f0", borderRadius: "1.5px", width: width, ...customStyle }} />
  );

  // Title text bar helper (colored with theme accent)
  const titleBar = (width) => (
    <div style={{ height: "4px", background: accent, borderRadius: "2px", width: width }} />
  );

  // Render header block
  let headerBlock = null;
  if (isBoldHeader) {
    // Bold full-width colored header
    headerBlock = (
      <div style={{ 
        height: "24px", 
        background: darkBg, 
        borderRadius: "4px 4px 0 0", 
        margin: "-6px -8px 4px -8px", 
        padding: "4px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        boxSizing: "border-box"
      }}>
        {bar("45%", { background: "rgba(255,255,255,0.8)" })}
        {bar("25%", { background: "rgba(255,255,255,0.4)" })}
      </div>
    );
  } else {
    // Regular top header
    headerBlock = (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "3px", borderBottom: preset.header === "border" ? `1px solid ${accent}` : "none", paddingBottom: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {titleBar("40%")}
          {bar("15%")}
        </div>
        {bar("20%")}
      </div>
    );
  }

  // Render body
  let bodyBlock = null;
  if (isSplit) {
    // Split layout (left sidebar, right sidebar, or magazine)
    const isRight = preset.layout === "split-right" || preset.layout === "dark-right";
    
    // Sidebar column
    const sidebarStyle = {
      width: "30%",
      background: isDarkLayout ? darkBg : lightBg,
      borderRadius: "3px",
      padding: "4px 3px",
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      boxSizing: "border-box"
    };

    const sidebarContent = (
      <>
        <div style={{ height: "4px", background: isDarkLayout ? accent : "transparent", width: "100%" }} />
        {bar("80%", { background: isDarkLayout ? "rgba(255,255,255,0.6)" : "#cbd5e1" })}
        {bar("50%", { background: isDarkLayout ? "rgba(255,255,255,0.4)" : "#cbd5e1" })}
        {bar("70%", { background: isDarkLayout ? "rgba(255,255,255,0.5)" : "#cbd5e1" })}
      </>
    );

    // Main column
    const mainStyle = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    };

    const mainContent = (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {titleBar("45%")}
          {bar("100%")}
          {bar("85%")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {titleBar("30%")}
          {bar("95%")}
        </div>
      </>
    );

    bodyBlock = (
      <div style={{ display: "flex", gap: "4px", flex: 1, flexDirection: isRight ? "row-reverse" : "row" }}>
        <div style={sidebarStyle}>{sidebarContent}</div>
        <div style={mainStyle}>{mainContent}</div>
      </div>
    );
  } else {
    // Single-column classic or timeline
    bodyBlock = (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {titleBar("30%")}
          {bar("100%")}
          {bar("90%")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {titleBar("25%")}
          {bar("95%")}
          {bar("60%")}
        </div>
      </div>
    );
  }

  return (
    <div style={sheetStyle}>
      {headerBlock}
      {bodyBlock}
    </div>
  );
};

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNewQuery = searchParams.get("new") === "true";

  // State definitions
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI Tabs & Accordions
  const [activeTab, setActiveTab] = useState("builder"); // "builder" or "ats"
  const [expandedAccordions, setExpandedAccordions] = useState({
    contact: true,
    summary: false,
    experience: false,
    responsibility: false,
    projects: false,
    education: false,
    certifications: false,
    skills: false
  });
  
  // Mobile specific view state: "edit" (form) or "preview" (A4 sheet)
  const [mobileView, setMobileView] = useState("edit");

  // Onboarding Wizard Stepper
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    firstname: "",
    lastname: "",
    jobtitle: "",
    email: "",
    phone: "",
    location: "",
    gender: "Female",
    photo: "",
    education: [],
    experience: [],
    responsibility: [],
    projects: [],
    certifications: [],
    skills: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: ""
  });

  // Template select modal
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [layoutCategory, setLayoutCategory] = useState("All");

  // Download choice modal
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Upgrade premium modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  // ATS scanner state
  const [jdText, setJdText] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [scanLimitReached, setScanLimitReached] = useState(false);
  const [scanLimitMessage, setScanLimitMessage] = useState("");
  const [customKeywords, setCustomKeywords] = useState("");
  const [atsActiveTab, setAtsActiveTab] = useState("overview");

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const previewContainerRef = useRef(null);

  // 1. Fetch User and Resume details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
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

        const resumeRes = await fetch(`${API_URL}/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resumeRes.ok) throw new Error("Resume not found");
        const resumeData = await resumeRes.json();

        // Merge loaded resume data JSON with defaults
        const unpacked = resumeData.resumeData || {};
        const mergedData = {
          id: resumeData.id,
          title: resumeData.title,
          templateId: resumeData.templateId,
          firstname: unpacked.firstname || "",
          lastname: unpacked.lastname || "",
          fullname: unpacked.fullname || unpacked.personal?.name || "",
          jobtitle: unpacked.jobtitle || unpacked.personal?.jobtitle || "",
          email: unpacked.email || unpacked.personal?.email || "",
          phone: unpacked.phone || unpacked.personal?.phone || "",
          location: unpacked.location || unpacked.personal?.location || "",
          gender: unpacked.gender || "Female",
          photo: unpacked.photo || unpacked.personal?.photo || "",
          summary: unpacked.summary || unpacked.personal?.summary || "",
          skills: unpacked.skills || "",
          linkedin: unpacked.linkedin || unpacked.personal?.linkedin || "",
          github: unpacked.github || unpacked.personal?.github || "",
          portfolio: unpacked.portfolio || unpacked.personal?.portfolio || "",
          education: unpacked.education || [],
          experience: unpacked.experience || [],
          responsibility: unpacked.responsibility || [],
          projects: unpacked.projects || [],
          certifications: unpacked.certifications || []
        };

        setResume(mergedData);
        setWizardData(mergedData);

        // Only trigger the onboarding wizard for brand-new resumes (via Dashboard "Create New" → ?new=true)
        // When editing an existing resume, never show the wizard — preserve all saved data
        if (isNewQuery) {
          setShowWizard(true);
        }
      } catch (err) {
        console.error("Editor initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, isNewQuery]);

  // 2. Debounced Auto-Save to backend API
  useEffect(() => {
    if (!resume || !resume.id) return;

    const timer = setTimeout(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/resumes/${resume.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: resume.title,
            templateId: resume.templateId,
            resumeData: resume
          })
        });

        if (response.ok) {
          addToast("Changes autosaved to cloud database", "success");
        }
      } catch (err) {
        console.error("Autosave error:", err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resume]);

  // 3. Screen preview scaling engine
  const scaleResumePreview = () => {
    const sheet = document.getElementById("resume-a4-sheet");
    if (!sheet) return;

    const container = sheet.parentElement;
    if (!container) return;

    // Reset inline styles
    sheet.style.transform = "";
    sheet.style.transformOrigin = "";
    sheet.style.width = "";
    sheet.style.height = "";
    container.style.height = "";

    const containerWidth = container.clientWidth;
    const sheetWidth = 794; // Absolute A4 width at 96 DPI

    if (containerWidth < sheetWidth && containerWidth > 0) {
      const scale = containerWidth / sheetWidth;
      sheet.style.width = "794px";
      sheet.style.height = "1123px";
      sheet.style.transform = `scale(${scale})`;
      sheet.style.transformOrigin = "top center";
      
      const scaledHeight = 1123 * scale;
      container.style.height = `${scaledHeight + 20}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", scaleResumePreview);
    const timeout = setTimeout(scaleResumePreview, 250);
    return () => {
      window.removeEventListener("resize", scaleResumePreview);
      clearTimeout(timeout);
    };
  }, [resume, showLayoutSelector, showWizard]);

  // Re-scale preview when swapping mobile views
  useEffect(() => {
    if (mobileView === "preview") {
      setTimeout(scaleResumePreview, 150);
    }
  }, [mobileView]);

  // 4. Printing layout isolation (beforeprint / afterprint)
  useEffect(() => {
    const handleBeforePrint = () => {
      const sheet = document.getElementById("resume-a4-sheet");
      if (sheet) {
        sheet.dataset.origTransform = sheet.style.transform;
        sheet.dataset.origWidth = sheet.style.width;
        sheet.dataset.origHeight = sheet.style.height;
        sheet.dataset.origTransformOrigin = sheet.style.transformOrigin;

        // Force standard print values
        sheet.style.transform = "none";
        sheet.style.transformOrigin = "unset";
        sheet.style.width = "210mm";
        sheet.style.height = "297mm";
      }
    };

    const handleAfterPrint = () => {
      const sheet = document.getElementById("resume-a4-sheet");
      if (sheet) {
        sheet.style.transform = sheet.dataset.origTransform || "";
        sheet.style.transformOrigin = sheet.dataset.origTransformOrigin || "";
        sheet.style.width = sheet.dataset.origWidth || "";
        sheet.style.height = sheet.dataset.origHeight || "";
      }
      scaleResumePreview();
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // 5. Toast alerts manager
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // 6. Accordion accordion expander toggle
  const toggleAccordion = (sec) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  // 7. General form input handler
  const handleInputChange = (field, value) => {
    setResume(prev => {
      const updated = { ...prev, [field]: value };
      // Keep fullname updated if first or last name changes
      if (field === "firstname" || field === "lastname") {
        updated.fullname = `${updated.firstname} ${updated.lastname}`.trim();
      }
      return updated;
    });
  };

  // Photo uploading handler (base64 conversion)
  const handlePhotoUpload = (e, isWizard = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800000) {
      alert("Image is too large! Choose an image file smaller than 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isWizard) {
        setWizardData(prev => ({ ...prev, photo: reader.result }));
      } else {
        setResume(prev => ({ ...prev, photo: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (isWizard = false) => {
    if (isWizard) {
      setWizardData(prev => ({ ...prev, photo: "" }));
    } else {
      setResume(prev => ({ ...prev, photo: "" }));
    }
  };

  // Dynamic lists handlers
  const handleAddItem = (type) => {
    setResume(prev => {
      const list = [...(prev[type] || [])];
      let newItem = {};
      if (type === "education") newItem = { degree: "", school: "", years: "", score: "" };
      else if (type === "experience" || type === "responsibility") newItem = { role: "", company: "", dates: "", desc: "", organization: "" };
      else if (type === "projects") newItem = { name: "", tech: "", desc: "" };
      else if (type === "certifications") newItem = { name: "", organization: "" };

      return { ...prev, [type]: [...list, newItem] };
    });
  };

  const handleRemoveItem = (type, index) => {
    setResume(prev => {
      const list = [...(prev[type] || [])];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };

  const handleItemChange = (type, index, field, value) => {
    setResume(prev => {
      const list = [...(prev[type] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });
  };

  // 8. Onboarding Wizard Actions
  const handleWizardNext = () => {
    if (wizardStep < 5) {
      setWizardStep(prev => prev + 1);
    } else {
      // Done wizard! Save details and close wizard modal
      const nameStr = `${wizardData.firstname} ${wizardData.lastname}`.trim();
      const finalResumeData = {
        ...resume,
        ...wizardData,
        fullname: nameStr
      };
      setResume(finalResumeData);
      setShowWizard(false);
      addToast("Wizard profile compiled. Ready to edit!", "success");
      setTimeout(scaleResumePreview, 300);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const handleWizardAddItem = (type) => {
    setWizardData(prev => {
      const list = [...(prev[type] || [])];
      let newItem = {};
      if (type === "education") newItem = { degree: "", school: "", years: "", score: "" };
      else if (type === "experience" || type === "responsibility") newItem = { role: "", company: "", dates: "", desc: "", organization: "" };
      else if (type === "projects") newItem = { name: "", tech: "", desc: "" };
      else if (type === "certifications") newItem = { name: "", organization: "" };

      return { ...prev, [type]: [...list, newItem] };
    });
  };

  const handleWizardRemoveItem = (type, index) => {
    setWizardData(prev => {
      const list = [...(prev[type] || [])];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };

  const handleWizardItemChange = (type, index, field, value) => {
    setWizardData(prev => {
      const list = [...(prev[type] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });
  };

  // 9. Premium Gates and Layout Selector
  const handleSelectTemplate = (tplId) => {
    const preset = templatePresets.find(t => t.id === tplId);
    const isPremiumTemplate = preset?.isPremium || false;
    const userIsPremium = user?.isPremium || false;

    if (isPremiumTemplate && !userIsPremium) {
      // Locked! Open upgrade modal
      setShowUpgradeModal(true);
      return;
    }

    setResume(prev => ({ ...prev, templateId: tplId }));
    setShowLayoutSelector(false);
    addToast(`Switched layout template to ${templatePresets.find(t=>t.id===tplId)?.name}`, "info");
    setTimeout(scaleResumePreview, 150);
  };

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setBillingLoading(true);
      const res = await fetch(`${API_URL}/api/billing/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize Stripe checkout session");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err.message);
      setBillingLoading(false);
    }
  };

  // 10. ATS Scanner Trigger
  const handleRunAtsScan = async () => {
    if (!jdText.trim()) {
      addToast("Please paste a target Job Description first", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // 1. Check rate limits on backend Express service
      const res = await fetch(`${API_URL}/api/ats/scan-limit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const limitData = await res.json();

      if (res.status === 429) {
        setScanLimitReached(true);
        setScanLimitMessage(limitData.message);
        setShowUpgradeModal(true);
        return;
      }

      // 2. Perform match analysis
      const analysis = runAtsAnalysis(resume, jdText, customKeywords);
      setAtsResult(analysis);
      addToast("ATS analysis successfully completed!", "success");
    } catch (err) {
      console.error("Scan error:", err);
      addToast("Error running scanner match", "danger");
    }
  };

  const handlePresetSelect = (presetKey) => {
    const text = jdPresets[presetKey] || "";
    setJdText(text);
  };

  // 11. Exporters (PDF and DOCX)
  const triggerPdfPrint = () => {
    setShowDownloadModal(false);
    addToast("Generating PDF… please wait.", "info");
    
    const runExport = () => {
      const originalElement = document.getElementById("resume-a4-sheet");
      if (!originalElement) {
        addToast("Resume preview not found. Please try again.", "error");
        return;
      }

      // 1. Create a deep clone of the A4 resume preview sheet ONLY
      const clone = originalElement.cloneNode(true);
      clone.removeAttribute("id");
      
      // 2. Reset ALL inline styles the scaling engine may have added
      clone.style.cssText = `
        position: static;
        width: 794px;
        height: 1123px;
        transform: none;
        transform-origin: top left;
        box-shadow: none;
        border: none;
        margin: 0;
        overflow: hidden;
        opacity: 1;
        background: #ffffff;
        box-sizing: border-box;
      `;
      
      // 3. Create an isolated wrapper positioned off-screen
      const wrapper = document.createElement("div");
      wrapper.id = "pdf-export-wrapper";
      wrapper.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 794px;
        height: 1123px;
        overflow: hidden;
        z-index: -9999;
        background: #ffffff;
        pointer-events: none;
      `;
      
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const opt = {
        margin:       0,
        filename:     `${resume.fullname || "Resume"}_CV.pdf`,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  {
          scale:           2,
          useCORS:         true,
          letterRendering: true,
          width:           794,
          height:          1123,
          x:               0,
          y:               0,
          scrollX:         0,
          scrollY:         0,
          windowWidth:     794,
          windowHeight:    1123
        },
        jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" }
      };

      // 4. Wait for fonts, then generate PDF and trigger native browser download
      document.fonts.ready.then(() => {
        window.html2pdf().from(clone).set(opt).save().then(() => {
          document.body.removeChild(wrapper);
          addToast("PDF downloaded successfully!", "success");
        }).catch(err => {
          console.error("PDF download error:", err);
          if (wrapper.parentNode) document.body.removeChild(wrapper);
          addToast("PDF export failed. Please try again.", "error");
        });
      });
    };

    if (window.html2pdf) {
      runExport();
    } else {
      // Dynamic import html2pdf.js from CDN (correct SRI hash)
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==";
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = runExport;
      script.onerror = () => {
        console.error("Failed to load html2pdf.js from CDN.");
        addToast("Could not load PDF library. Check your internet connection and try again.", "error");
      };
      document.body.appendChild(script);
    }
  };

  const downloadDocx = () => {
    setShowDownloadModal(false);
    
    const layoutPreset = templatePresets.find(t => t.id === resume.templateId) || templatePresets[0];
    const themeColor = themeHexMap[layoutPreset.theme] || '#475569';
    const fullname = resume.fullname || `${resume.firstname || 'John'} ${resume.lastname || 'Doe'}`;
    const jobtitle = resume.jobtitle || 'Professional';
    
    // Compile sidebar HTML blocks
    let sidebarHtml = '';
    
    // Photo block
    if (resume.photo) {
      sidebarHtml += `
        <div style="text-align: center; margin-bottom: 10pt;">
          <img src="${resume.photo}" width="70" height="70" style="border-radius: 35px; border: 2px solid ${themeColor};" />
        </div>
      `;
    }
    
    // Contact Info sidebar block
    sidebarHtml += `
      <div style="margin-bottom: 8pt;">
        <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Contact</h4>
    `;
    if (resume.email) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>Email:</strong><br/>${resume.email}</p>`;
    if (resume.phone) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt;"><strong>Phone:</strong><br/>${resume.phone}</p>`;
    if (resume.location) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt;"><strong>Location:</strong><br/>${resume.location}</p>`;
    sidebarHtml += `</div>`;
    
    // Links block
    const hasLinks = resume.linkedin || resume.github || resume.portfolio;
    if (hasLinks) {
      sidebarHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Links</h4>
      `;
      if (resume.linkedin) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>LinkedIn:</strong><br/>${resume.linkedin}</p>`;
      if (resume.github) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>GitHub:</strong><br/>${resume.github}</p>`;
      if (resume.portfolio) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>Portfolio:</strong><br/>${resume.portfolio}</p>`;
      sidebarHtml += `</div>`;
    }
    
    // Education block (for sidebar if split layout)
    const validEdu = resume.education.filter(e => e.degree || e.school);
    let sidebarEduHtml = '';
    if (validEdu.length > 0) {
      sidebarEduHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Education</h4>
      `;
      validEdu.forEach(item => {
        sidebarEduHtml += `
          <div style="margin-bottom: 3pt;">
            <p style="font-size: 8pt; font-weight: bold; margin-bottom: 0.5pt;">${item.degree}</p>
            <p style="font-size: 7.5pt; margin: 0; color: #444444;">${item.school}</p>
            <p style="font-size: 7.5pt; margin: 0; color: #666666;">${item.years} | ${item.score}</p>
          </div>
        `;
      });
      sidebarEduHtml += `</div>`;
    }
    
    // Skills block
    const skillsList = resume.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillsList.length > 0) {
      sidebarHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Skills</h4>
          <p style="font-size: 8pt; line-height: 1.3; margin: 0;">${skillsList.join(' • ')}</p>
        </div>
      `;
    }
    
    // Certifications block
    const validCert = resume.certifications.filter(c => c.name || c.organization);
    let sidebarCertHtml = '';
    if (validCert.length > 0) {
      sidebarCertHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Certifications</h4>
      `;
      validCert.forEach(item => {
        sidebarCertHtml += `
          <div style="margin-bottom: 3pt;">
            <p style="font-size: 8pt; font-weight: bold; margin-bottom: 0.5pt;">${item.name}</p>
            <p style="font-size: 7.5pt; margin: 0; color: #444444;">${item.organization}</p>
          </div>
        `;
      });
      sidebarCertHtml += `</div>`;
    }
    
    // Main column blocks
    let mainHtml = '';
    
    // Professional Summary block
    if (resume.summary && resume.summary.trim() !== '') {
      mainHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Summary</h4>
          <p style="font-size: 8.5pt; line-height: 1.2; margin: 0; color: #333333;">${resume.summary}</p>
        </div>
      `;
    }
    
    // Experience block
    const validExp = resume.experience.filter(e => e.role || e.company || e.desc);
    if (validExp.length > 0) {
      mainHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Experience</h4>
      `;
      validExp.forEach(item => {
        const descLines = item.desc ? item.desc.split('\n') : [];
        mainHtml += `
          <div style="margin-bottom: 5pt;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 1.5pt;">
              <tr>
                <td style="font-weight: bold; font-size: 8.5pt; color: #111111;">${item.role || 'Designation'}</td>
                <td style="text-align: right; font-size: 8pt; color: #555555; font-weight: bold;">${item.dates || 'Duration'}</td>
              </tr>
              <tr>
                <td colspan="2" style="font-style: italic; font-size: 8pt; color: #444444; padding-top: 1px;">${item.company || 'Company'}</td>
              </tr>
            </table>
            ${descLines.length > 0 ? `
            <ul style="margin: 0; padding: 0 0 0 10pt;">
              ${descLines.map(line => line.trim() ? `<li style="font-size: 8pt; color: #333333; margin-bottom: 0.5pt; line-height: 1.15;">${line.trim()}</li>` : '').join('')}
            </ul>` : ''}
          </div>
        `;
      });
      mainHtml += `</div>`;
    }
    
    // POR block
    const validPor = resume.responsibility.filter(r => r.role || r.organization || r.desc);
    if (validPor.length > 0) {
      mainHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Positions of Responsibility</h4>
      `;
      validPor.forEach(item => {
        const descLines = item.desc ? item.desc.split('\n') : [];
        mainHtml += `
          <div style="margin-bottom: 5pt;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 1.5pt;">
              <tr>
                <td style="font-weight: bold; font-size: 8.5pt; color: #111111;">${item.role || 'Leadership Role'}</td>
                <td style="text-align: right; font-size: 8pt; color: #555555; font-weight: bold;">${item.dates || 'Duration'}</td>
              </tr>
              <tr>
                <td colspan="2" style="font-style: italic; font-size: 8pt; color: #444444; padding-top: 1px;">${item.organization || 'Organization / Club'}</td>
              </tr>
            </table>
            ${descLines.length > 0 ? `
            <ul style="margin: 0; padding: 0 0 0 10pt;">
              ${descLines.map(line => line.trim() ? `<li style="font-size: 8pt; color: #333333; margin-bottom: 0.5pt; line-height: 1.15;">${line.trim()}</li>` : '').join('')}
            </ul>` : ''}
          </div>
        `;
      });
      mainHtml += `</div>`;
    }

    // Projects block
    const validProj = resume.projects.filter(p => p.name || p.tech || p.desc);
    if (validProj.length > 0) {
      mainHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Projects</h4>
      `;
      validProj.forEach(item => {
        mainHtml += `
          <div style="margin-bottom: 5pt;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 1.5pt;">
              <tr>
                <td style="font-weight: bold; font-size: 8.5pt; color: #111111;">${item.name || 'Project Title'}</td>
                <td style="text-align: right; font-size: 8pt; color: #555555; font-style: italic;">${item.tech || 'Tech Stack'}</td>
              </tr>
            </table>
            ${item.desc ? `<p style="font-size: 8pt; line-height: 1.15; margin: 0 0 0 5pt; color: #333333;">${item.desc}</p>` : ''}
          </div>
        `;
      });
      mainHtml += `</div>`;
    }
    
    // Education block (for classic/single-column layout)
    let classicEduHtml = '';
    if (validEdu.length > 0) {
      classicEduHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Education</h4>
          <table width="100%" cellpadding="3" cellspacing="0" style="border: 1px solid #e2e8f0; border-collapse: collapse; margin-top: 3pt; font-size: 8pt; font-family: Arial, sans-serif;">
            <thead>
              <tr style="background-color: #f8fafc; font-weight: bold;">
                <th align="left" style="border-bottom: 1px solid #e2e8f0; padding: 3px;">Education / Stream</th>
                <th align="left" style="border-bottom: 1px solid #e2e8f0; padding: 3px;">School / College</th>
                <th align="left" style="border-bottom: 1px solid #e2e8f0; padding: 3px;">Year</th>
                <th align="left" style="border-bottom: 1px solid #e2e8f0; padding: 3px;">CGPA / Performance</th>
              </tr>
            </thead>
            <tbody>
      `;
      validEdu.forEach(item => {
        classicEduHtml += `
          <tr>
            <td style="border-bottom: 1px solid #e2e8f0; padding: 3px;"><strong>${item.degree}</strong></td>
            <td style="border-bottom: 1px solid #e2e8f0; padding: 3px;">${item.school}</td>
            <td style="border-bottom: 1px solid #e2e8f0; padding: 3px;">${item.years}</td>
            <td style="border-bottom: 1px solid #e2e8f0; padding: 3px;">${item.score}</td>
          </tr>
        `;
      });
      classicEduHtml += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Certifications block (for classic/single-column layout)
    let classicCertHtml = '';
    if (validCert.length > 0) {
      classicCertHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Certifications</h4>
      `;
      validCert.forEach(item => {
        classicCertHtml += `
          <div style="margin-bottom: 4pt;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 1pt;">
              <tr>
                <td style="font-weight: bold; font-size: 8.5pt; color: #111111;">${item.name}</td>
                <td style="text-align: right; font-size: 8pt; color: #555555;">${item.dates || ''}</td>
              </tr>
            </table>
            <p style="font-size: 8pt; margin: 0 0 0 5pt; color: #444444; font-style: italic;">${item.organization}</p>
          </div>
        `;
      });
      classicCertHtml += `</div>`;
    }
    
    // Choose layout style
    let finalBodyContent = '';
    const isSplit = layoutPreset.layout.includes('split');
    
    if (isSplit) {
      // 2-Column Table structure (Sidebar & Main content)
      const isSplitLeft = layoutPreset.layout === 'split-left';
      
      const headerBlock = `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10pt; border-bottom: 2pt solid ${themeColor}; padding-bottom: 6pt;">
          <tr>
            <td>
              <h2 style="font-size: 18pt; font-weight: bold; color: #111111; margin: 0 0 2pt 0; font-family: Arial, sans-serif;">${fullname}</h2>
              <h3 style="font-size: 10pt; font-weight: normal; color: ${themeColor}; margin: 0; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">${jobtitle}</h3>
            </td>
          </tr>
        </table>
      `;
      
      const leftColContent = sidebarHtml + sidebarEduHtml + sidebarCertHtml;
      const rightColContent = mainHtml;
      
      const cols = isSplitLeft 
        ? `
          <td width="30%" valign="top" style="background-color: #fcfcfc; border-right: 1px solid #eeeeee; padding-right: 10pt;">
            ${leftColContent}
          </td>
          <td width="70%" valign="top" style="padding-left: 12pt;">
            ${rightColContent}
          </td>
        `
        : `
          <td width="70%" valign="top" style="padding-right: 12pt;">
            ${rightColContent}
          </td>
          <td width="30%" valign="top" style="background-color: #fcfcfc; border-left: 1px solid #eeeeee; padding-left: 10pt;">
            ${leftColContent}
          </td>
        `;
        
      finalBodyContent = `
        ${headerBlock}
        <table width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
          <tr>
            ${cols}
          </tr>
        </table>
      `;
    } else {
      // Single-column structure
      let contactItems = [];
      if (resume.email) contactItems.push(resume.email);
      if (resume.phone) contactItems.push(resume.phone);
      if (resume.location) contactItems.push(resume.location);
      
      let linkItems = [];
      if (resume.linkedin) linkItems.push(resume.linkedin);
      if (resume.github) linkItems.push(resume.github);
      if (resume.portfolio) linkItems.push(resume.portfolio);
      
      const photoHtml = resume.photo 
        ? `<td width="70" valign="middle" align="right" style="padding-left: 8px;">
             <img src="${resume.photo}" width="60" height="60" style="border-radius: 30px; border: 1.5pt solid ${themeColor};" />
           </td>` 
        : '';
        
      const headerBlock = `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10pt; border-bottom: 2pt solid ${themeColor}; padding-bottom: 6pt;">
          <tr>
            <td valign="middle" align="left">
              <h2 style="font-size: 20pt; font-weight: bold; color: #111111; margin: 0 0 2pt 0; font-family: Arial, sans-serif; text-transform: uppercase;">${fullname}</h2>
              <h3 style="font-size: 10.5pt; font-weight: bold; color: ${themeColor}; margin: 0 0 4pt 0; font-family: Arial, sans-serif; text-transform: uppercase;">${jobtitle}</h3>
              <p style="font-size: 8pt; color: #555555; margin: 0 0 2pt 0;">${contactItems.join('  •  ')}</p>
              ${linkItems.length > 0 ? `<p style="font-size: 8pt; color: ${themeColor}; margin: 0;">${linkItems.join('  •  ')}</p>` : ''}
            </td>
            ${photoHtml}
          </tr>
        </table>
      `;
      
      finalBodyContent = `
        ${headerBlock}
        ${mainHtml}
        ${classicEduHtml}
        ${classicCertHtml}
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Skills</h4>
          <p style="font-size: 8.5pt; line-height: 1.3; margin: 0; color: #333333;">${skillsList.join('  •  ')}</p>
        </div>
      `;
    }
    
    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page Section1 {
              size: 8.5in 11in;
              margin: 0.4in 0.4in 0.4in 0.4in;
              mso-header-margin: 0.2in;
              mso-footer-margin: 0.2in;
              mso-paper-source: 0;
            }
            div.Section1 {
              page: Section1;
            }
            body {
              font-family: 'Arial', 'Calibri', sans-serif;
              font-size: 8.5pt;
              line-height: 1.15;
              color: #333333;
            }
            p, td, li, h2, h3, h4 {
              font-family: 'Arial', 'Calibri', sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="Section1">
            ${finalBodyContent}
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const filename = `${fullname.trim().replace(/\s+/g, '_')}_Resume.doc`; // .doc is more widely supported for this type of export
    
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    
    addToast('DOCX exported successfully!', 'success');
  };

  // 12. Dynamic UI renders for templates A4 sheet
  const currentResumeState = resume;
  const renderResumeHTML = (customResume = null) => {
    const resume = customResume || currentResumeState;
    if (!resume) return null;
    const activeTemplate = templatePresets.find(t => t.id === resume.templateId) || templatePresets[0];
    const layout = activeTemplate.layout;

    if (layout === "classic" || layout === "timeline" || layout === "bold-header") {
      // Single column templates (Classic, Timeline)
      return (
        <>
          <div className="resume-header">
            <div className="resume-header-text">
              <h2 id="resume-name" className="resume-title">{resume.fullname || "John Doe"}</h2>
              <h3 id="resume-title-label" className="resume-subtitle">{resume.jobtitle || "Frontend Developer"}</h3>
              
              <div className="resume-contact-row">
                {resume.email && <span id="resume-email-tag">{resume.email}</span>}
                {resume.email && resume.phone && <span className="separator">&bull;</span>}
                {resume.phone && <span id="resume-phone-tag">{resume.phone}</span>}
                {resume.phone && resume.location && <span className="separator">&bull;</span>}
                {resume.location && <span id="resume-location-tag">{resume.location}</span>}
              </div>
              
              {(resume.linkedin || resume.github || resume.portfolio) && (
                <div className="resume-links-row">
                  {resume.linkedin && <span id="resume-linkedin-tag">{resume.linkedin}</span>}
                  {resume.linkedin && resume.github && <span className="separator">&bull;</span>}
                  {resume.github && <span id="resume-github-tag">{resume.github}</span>}
                  {resume.github && resume.portfolio && <span className="separator">&bull;</span>}
                  {resume.portfolio && <span id="resume-portfolio-tag">{resume.portfolio}</span>}
                </div>
              )}
            </div>
            {resume.photo && (
              <div className="resume-photo-container" id="resume-photo-container">
                <img id="resume-photo-img" src={resume.photo} alt="Profile Photo" />
              </div>
            )}
          </div>

          <div className="resume-body">
            {resume.summary && (
              <div className="resume-section" id="resume-section-summary">
                <h4 className="section-title">Professional Summary</h4>
                <div className="section-divider"></div>
                <p id="resume-summary-text" className="section-content">{resume.summary}</p>
              </div>
            )}

            {resume.experience && resume.experience.length > 0 && (
              <div className="resume-section" id="resume-section-experience">
                <h4 className="section-title">Jobs & Internships</h4>
                <div className="section-divider"></div>
                <div className="experience-container" id="resume-experience-display">
                  {resume.experience.map((item, idx) => (
                    <div key={idx} className="res-item-row">
                      <div className="res-item-header">
                        <span>{item.role || "Designation"}</span>
                        <span>{item.dates || "Duration"}</span>
                      </div>
                      <div className="res-item-subtitle">
                        <span>{item.company || "Company"}</span>
                      </div>
                      {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.responsibility && resume.responsibility.length > 0 && (
              <div className="resume-section" id="resume-section-responsibility">
                <h4 className="section-title">Positions of Responsibility</h4>
                <div className="section-divider"></div>
                <div className="experience-container" id="resume-responsibility-display">
                  {resume.responsibility.map((item, idx) => (
                    <div key={idx} className="res-item-row">
                      <div className="res-item-header">
                        <span>{item.role || "Leadership Role"}</span>
                        <span>{item.dates || "Duration"}</span>
                      </div>
                      <div className="res-item-subtitle">
                        <span>{item.organization || "Organization"}</span>
                      </div>
                      {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.projects && resume.projects.length > 0 && (
              <div className="resume-section" id="resume-section-projects">
                <h4 className="section-title">Projects</h4>
                <div className="section-divider"></div>
                <div className="projects-container" id="resume-projects-display">
                  {resume.projects.map((item, idx) => (
                    <div key={idx} className="res-item-row">
                      <div className="res-item-header">
                        <span>{item.name || "Project Title"}</span>
                        <span>{item.tech || "Tech Stack"}</span>
                      </div>
                      {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.education && resume.education.length > 0 && (
              <div className="resume-section" id="resume-section-education">
                <h4 className="section-title">Education History</h4>
                <div className="section-divider"></div>
                <table className="education-table">
                  <thead>
                    <tr>
                      <th>Education / Stream</th>
                      <th>School / College</th>
                      <th>Year</th>
                      <th>CGPA / Performance</th>
                    </tr>
                  </thead>
                  <tbody id="resume-education-table-body">
                    {resume.education.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.degree}</td>
                        <td>{item.school}</td>
                        <td>{item.years}</td>
                        <td>{item.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {resume.certifications && resume.certifications.length > 0 && (
              <div className="resume-section" id="resume-section-certifications">
                <h4 className="section-title">Certifications</h4>
                <div className="section-divider"></div>
                <div className="experience-container" id="resume-cert-display">
                  {resume.certifications.map((item, idx) => (
                    <div key={idx} className="res-item-row" style={{ padding: "0", border: "none" }}>
                      <div className="res-item-header">
                        <span style={{ fontWeight: "600" }}>{item.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{item.organization}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.skills && (
              <div className="resume-section" id="resume-section-skills">
                <h4 className="section-title">Skills</h4>
                <div className="section-divider"></div>
                <div className="skills-grid" id="resume-skills-display">
                  {resume.skills.split(",").map(s => s.trim()).filter(s => s).map((skill, idx) => (
                    <span key={idx} className="skill-capsule">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      );
    } else {
      // Split layout templates (split-left, split-right, dark-left, dark-right, magazine)
      return (
        <>
          <div className="resume-header">
            <h2 id="resume-name" className="resume-title">{resume.fullname || "John Doe"}</h2>
            <h3 id="resume-title-label" className="resume-subtitle">{resume.jobtitle || "Frontend Developer"}</h3>
          </div>

          <div className="resume-split-body">
            <div className="resume-sidebar-col">
              {resume.photo && (
                <div className="resume-photo-container sidebar-photo" id="resume-photo-container">
                  <img id="resume-photo-img" src={resume.photo} alt="Profile Photo" />
                </div>
              )}

              {(resume.email || resume.phone || resume.location) && (
                <div className="sidebar-section contact-info-sidebar">
                  <h4 className="section-title">Contact</h4>
                  <div className="section-divider"></div>
                  {resume.email && (
                    <div className="sidebar-contact-item" id="sidebar-email-item">
                      <span className="label">Email:</span>
                      <span id="resume-email-tag">{resume.email}</span>
                    </div>
                  )}
                  {resume.phone && (
                    <div className="sidebar-contact-item" id="sidebar-phone-item">
                      <span className="label">Phone:</span>
                      <span id="resume-phone-tag">{resume.phone}</span>
                    </div>
                  )}
                  {resume.location && (
                    <div className="sidebar-contact-item" id="sidebar-location-item">
                      <span className="label">Location:</span>
                      <span id="resume-location-tag">{resume.location}</span>
                    </div>
                  )}
                </div>
              )}

              {(resume.linkedin || resume.github || resume.portfolio) && (
                <div className="sidebar-section contact-links-sidebar">
                  <h4 className="section-title">Links</h4>
                  <div className="section-divider"></div>
                  {resume.linkedin && (
                    <div className="sidebar-link-item" id="sidebar-linkedin-item">
                      <span id="resume-linkedin-tag">{resume.linkedin}</span>
                    </div>
                  )}
                  {resume.github && (
                    <div className="sidebar-link-item" id="sidebar-github-item">
                      <span id="resume-github-tag">{resume.github}</span>
                    </div>
                  )}
                  {resume.portfolio && (
                    <div className="sidebar-link-item" id="sidebar-portfolio-item">
                      <span id="resume-portfolio-tag">{resume.portfolio}</span>
                    </div>
                  )}
                </div>
              )}

              {resume.education && resume.education.length > 0 && (
                <div className="sidebar-section" id="resume-section-education">
                  <h4 className="section-title">Education</h4>
                  <div className="section-divider"></div>
                  <div className="education-sidebar-list" id="resume-education-sidebar-display">
                    {resume.education.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: "8px" }}>
                        <p style={{ fontWeight: "600", fontSize: "11px", margin: "0 0 2px 0" }}>{item.degree}</p>
                        <p style={{ fontSize: "10px", margin: "0 0 2px 0", color: "var(--text-muted)" }}>{item.school}</p>
                        <p style={{ fontSize: "9px", margin: "0", color: "var(--text-muted)" }}>{item.years} | {item.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.skills && (
                <div className="sidebar-section" id="resume-section-skills">
                  <h4 className="section-title">Skills</h4>
                  <div className="section-divider"></div>
                  <div className="skills-grid" id="resume-skills-display">
                    {resume.skills.split(",").map(s => s.trim()).filter(s => s).map((skill, idx) => (
                      <span key={idx} className="skill-capsule">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {resume.certifications && resume.certifications.length > 0 && (
                <div className="sidebar-section" id="resume-section-certifications">
                  <h4 className="section-title">Certifications</h4>
                  <div className="section-divider"></div>
                  <div className="experience-container" id="resume-cert-display">
                    {resume.certifications.map((item, idx) => (
                      <div key={idx} className="res-item-row" style={{ padding: "0", border: "none" }}>
                        <div className="res-item-header" style={{ flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
                          <span style={{ fontWeight: "600" }}>{item.name}</span>
                          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{item.organization}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="resume-main-col">
              {resume.summary && (
                <div className="resume-section" id="resume-section-summary">
                  <h4 className="section-title">Summary</h4>
                  <div className="section-divider"></div>
                  <p id="resume-summary-text" className="section-content">{resume.summary}</p>
                </div>
              )}

              {resume.experience && resume.experience.length > 0 && (
                <div className="resume-section" id="resume-section-experience">
                  <h4 className="section-title">Experience</h4>
                  <div className="section-divider"></div>
                  <div className="experience-container" id="resume-experience-display">
                    {resume.experience.map((item, idx) => (
                      <div key={idx} className="res-item-row">
                        <div className="res-item-header">
                          <span>{item.role || "Designation"}</span>
                          <span>{item.dates || "Duration"}</span>
                        </div>
                        <div className="res-item-subtitle">
                          <span>{item.company || "Company"}</span>
                        </div>
                        {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.responsibility && resume.responsibility.length > 0 && (
                <div className="resume-section" id="resume-section-responsibility">
                  <h4 className="section-title">Positions of Responsibility</h4>
                  <div className="section-divider"></div>
                  <div className="experience-container" id="resume-responsibility-display">
                    {resume.responsibility.map((item, idx) => (
                      <div key={idx} className="res-item-row">
                        <div className="res-item-header">
                          <span>{item.role || "Leadership Role"}</span>
                          <span>{item.dates || "Duration"}</span>
                        </div>
                        <div className="res-item-subtitle">
                          <span>{item.organization || "Organization"}</span>
                        </div>
                        {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.projects && resume.projects.length > 0 && (
                <div className="resume-section" id="resume-section-projects">
                  <h4 className="section-title">Projects</h4>
                  <div className="section-divider"></div>
                  <div className="projects-container" id="resume-projects-display">
                    {resume.projects.map((item, idx) => (
                      <div key={idx} className="res-item-row">
                        <div className="res-item-header">
                          <span>{item.name || "Project Title"}</span>
                          <span>{item.tech || "Tech Stack"}</span>
                        </div>
                        {item.desc && <p className="res-item-desc" style={{ whiteSpace: "pre-line" }}>{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="dashboard-loading">
          <div style={{ border: "4px solid rgba(255,255,255,0.05)", borderTop: "4px solid #ef4444", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", marginBottom: "16px" }}></div>
          <h3>Loading builder workspace...</h3>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="dashboard-container" style={{ padding: "40px", alignItems: "center" }}>
        <h2>Error Loading Resume Workspace</h2>
        <p style={{ color: "#ef4444", margin: "20px 0" }}>{error || "Could not retrieve requested resume."}</p>
        <Link to="/dashboard" className="hero-btn primary" style={{ textDecoration: "none" }}>Back to Dashboard</Link>
      </div>
    );
  }

  const activeTemplatePreset = templatePresets.find(t => t.id === resume.templateId) || templatePresets[0];

  return (
    <div className="app-container">
      {/* Dynamic inject custom media rules for mobile toggle views */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-view-toggle {
            display: flex !important;
            background: rgba(15, 19, 26, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            width: 100%;
            margin-bottom: 1rem;
          }
          .mobile-view-toggle .toggle-btn {
            flex: 1;
            padding: 14px;
            text-align: center;
            background: transparent;
            border: none;
            color: #8f95b2;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
          }
          .mobile-view-toggle .toggle-btn.active {
            color: #ef4444;
            border-bottom: 2px solid #ef4444;
          }
          
          .app-layout.mobile-show-edit .control-panel {
            display: flex !important;
            width: 100% !important;
            height: auto !important;
          }
          .app-layout.mobile-show-edit .preview-panel {
            display: none !important;
          }
          .app-layout.mobile-show-preview .control-panel {
            display: none !important;
          }
          .app-layout.mobile-show-preview .preview-panel {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow-y: visible !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-view-toggle {
            display: none !important;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Aurora glow */}
      <div className="aurora-glow aurora-1 no-print"></div>
      <div className="aurora-glow aurora-2 no-print"></div>
      <div className="aurora-glow aurora-3 no-print"></div>

      {/* Header */}
      <header className="app-header no-print">
        <div className="header-brand">
          <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1 style={{ color: "#ffffff", margin: 0, fontSize: "18px" }}>
                Kraft <span className="badge">Builder</span>
              </h1>
            </div>
          </Link>
        </div>

        <div className="developer-info">
          <Link to="/dashboard" style={{ color: "#ef4444", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Mobile Toggle Bar */}
      <div className="mobile-view-toggle no-print">
        <button 
          className={`toggle-btn ${mobileView === "edit" ? "active" : ""}`}
          onClick={() => setMobileView("edit")}
        >
          📝 Edit Details
        </button>
        <button 
          className={`toggle-btn ${mobileView === "preview" ? "active" : ""}`}
          onClick={() => setMobileView("preview")}
        >
          👁️ Live Preview
        </button>
      </div>

      {/* App Workspace Layout */}
      <div className={`app-layout ${mobileView === "edit" ? "mobile-show-edit" : "mobile-show-preview"}`}>
        
        {/* Left Control Panel */}
        <aside className="control-panel no-print">
          <div className="panel-tabs">
            <button
              className={`panel-tab-btn ${activeTab === "builder" ? "active" : ""}`}
              onClick={() => setActiveTab("builder")}
            >
              📝 Edit Details
            </button>
            <button
              className={`panel-tab-btn ${activeTab === "ats" ? "active" : ""}`}
              onClick={() => setActiveTab("ats")}
            >
              🎯 ATS Matcher
            </button>
          </div>

          {/* Builder Form Tab */}
          {activeTab === "builder" && (
            <div className="panel-scroll-container">
              
              {/* Accordion 1: Contact */}
              <div className={`accordion-item ${expandedAccordions.contact ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("contact")}>
                  <h4>Contact Details</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.contact && (
                  <div className="accordion-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" value={resume.firstname} onChange={(e) => handleInputChange("firstname", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" value={resume.lastname} onChange={(e) => handleInputChange("lastname", e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Target Job Title</label>
                        <input type="text" value={resume.jobtitle} onChange={(e) => handleInputChange("jobtitle", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={resume.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" value={resume.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Location / City</label>
                        <input type="text" value={resume.location} onChange={(e) => handleInputChange("location", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>LinkedIn URL</label>
                        <input type="text" value={resume.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>GitHub Username</label>
                        <input type="text" value={resume.github} onChange={(e) => handleInputChange("github", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Portfolio Link</label>
                        <input type="text" value={resume.portfolio} onChange={(e) => handleInputChange("portfolio", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select className="dropdown-control" value={resume.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Profile Photo</label>
                        <div className="photo-upload-container">
                          <input type="file" id="input-photo-upload" accept="image/*" onChange={(e) => handlePhotoUpload(e)} style={{ display: "none" }} />
                          <div className="photo-buttons-row">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById("input-photo-upload").click()}>
                              Upload Photo
                            </button>
                            {resume.photo && (
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemovePhoto()}>
                                Remove
                              </button>
                            )}
                          </div>
                          {resume.photo && (
                            <div className="photo-preview-mini">
                              <img src={resume.photo} alt="Upload Preview" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Summary */}
              <div className={`accordion-item ${expandedAccordions.summary ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("summary")}>
                  <h4>Professional Summary</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.summary && (
                  <div className="accordion-body">
                    <div className="form-group">
                      <label>Summary Pitch</label>
                      <textarea rows="4" value={resume.summary} onChange={(e) => handleInputChange("summary", e.target.value)}></textarea>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Experience */}
              <div className={`accordion-item ${expandedAccordions.experience ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("experience")}>
                  <h4>Jobs & Internships</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.experience && (
                  <div className="accordion-body">
                    <div className="dynamic-list-container">
                      {resume.experience.map((exp, idx) => (
                        <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <h5 style={{ margin: 0 }}>Job #{idx + 1}</h5>
                            <button type="button" onClick={() => handleRemoveItem("experience", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Role / Title</label>
                              <input type="text" value={exp.role} onChange={(e) => handleItemChange("experience", idx, "role", e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Company</label>
                              <input type="text" value={exp.company} onChange={(e) => handleItemChange("experience", idx, "company", e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label>Dates / Duration</label>
                              <input type="text" value={exp.dates} onChange={(e) => handleItemChange("experience", idx, "dates", e.target.value)} placeholder="e.g. June 2025 - Present" />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label>Description (separate sentences on new lines for bullets)</label>
                              <textarea rows="3" value={exp.desc} onChange={(e) => handleItemChange("experience", idx, "desc", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddItem("experience")}>
                      + Add Job / Internship
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 4: POR */}
              <div className={`accordion-item ${expandedAccordions.responsibility ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("responsibility")}>
                  <h4>Positions of Responsibility</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.responsibility && (
                  <div className="accordion-body">
                    <div className="dynamic-list-container">
                      {resume.responsibility.map((por, idx) => (
                        <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <h5 style={{ margin: 0 }}>POR #{idx + 1}</h5>
                            <button type="button" onClick={() => handleRemoveItem("responsibility", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Role</label>
                              <input type="text" value={por.role} onChange={(e) => handleItemChange("responsibility", idx, "role", e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Organization / Club</label>
                              <input type="text" value={por.organization} onChange={(e) => handleItemChange("responsibility", idx, "organization", e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label>Dates</label>
                              <input type="text" value={por.dates} onChange={(e) => handleItemChange("responsibility", idx, "dates", e.target.value)} />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label>Description</label>
                              <textarea rows="3" value={por.desc} onChange={(e) => handleItemChange("responsibility", idx, "desc", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddItem("responsibility")}>
                      + Add Responsibility
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 5: Projects */}
              <div className={`accordion-item ${expandedAccordions.projects ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("projects")}>
                  <h4>Projects</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.projects && (
                  <div className="accordion-body">
                    <div className="dynamic-list-container">
                      {resume.projects.map((proj, idx) => (
                        <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <h5 style={{ margin: 0 }}>Project #{idx + 1}</h5>
                            <button type="button" onClick={() => handleRemoveItem("projects", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Project Title</label>
                              <input type="text" value={proj.name} onChange={(e) => handleItemChange("projects", idx, "name", e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Tech Stack</label>
                              <input type="text" value={proj.tech} onChange={(e) => handleItemChange("projects", idx, "tech", e.target.value)} placeholder="e.g. React, Node, WebGL" />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label>Project Description</label>
                              <textarea rows="3" value={proj.desc} onChange={(e) => handleItemChange("projects", idx, "desc", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddItem("projects")}>
                      + Add Project
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 6: Education */}
              <div className={`accordion-item ${expandedAccordions.education ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("education")}>
                  <h4>Education History</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.education && (
                  <div className="accordion-body">
                    <div className="dynamic-list-container">
                      {resume.education.map((edu, idx) => (
                        <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <h5 style={{ margin: 0 }}>Degree #{idx + 1}</h5>
                            <button type="button" onClick={() => handleRemoveItem("education", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Degree / Class</label>
                              <input type="text" value={edu.degree} onChange={(e) => handleItemChange("education", idx, "degree", e.target.value)} placeholder="e.g. B.Tech Computer Science" />
                            </div>
                            <div className="form-group">
                              <label>School / College</label>
                              <input type="text" value={edu.school} onChange={(e) => handleItemChange("education", idx, "school", e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Passing Year / Duration</label>
                              <input type="text" value={edu.years} onChange={(e) => handleItemChange("education", idx, "years", e.target.value)} placeholder="e.g. 2021-2025" />
                            </div>
                            <div className="form-group">
                              <label>CGPA / Score</label>
                              <input type="text" value={edu.score} onChange={(e) => handleItemChange("education", idx, "score", e.target.value)} placeholder="e.g. 9.1 CGPA" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddItem("education")}>
                      + Add Education Record
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 7: Certifications */}
              <div className={`accordion-item ${expandedAccordions.certifications ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("certifications")}>
                  <h4>Certifications</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.certifications && (
                  <div className="accordion-body">
                    <div className="dynamic-list-container">
                      {resume.certifications.map((cert, idx) => (
                        <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <h5 style={{ margin: 0 }}>Certificate #{idx + 1}</h5>
                            <button type="button" onClick={() => handleRemoveItem("certifications", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Certificate Name</label>
                              <input type="text" value={cert.name} onChange={(e) => handleItemChange("certifications", idx, "name", e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Issuing Organization</label>
                              <input type="text" value={cert.organization} onChange={(e) => handleItemChange("certifications", idx, "organization", e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddItem("certifications")}>
                      + Add Certification
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 8: Skills */}
              <div className={`accordion-item ${expandedAccordions.skills ? "expanded" : ""}`}>
                <div className="accordion-header" onClick={() => toggleAccordion("skills")}>
                  <h4>Skills & Core Competencies</h4>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {expandedAccordions.skills && (
                  <div className="accordion-body">
                    <div className="form-group">
                      <label>Skills (Comma-separated)</label>
                      <textarea rows="3" value={resume.skills} onChange={(e) => handleInputChange("skills", e.target.value)} placeholder="React, TypeScript, CSS Variables, Git, REST APIs"></textarea>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ATS Matcher Tab */}
          {activeTab === "ats" && (
            <div className="panel-scroll-container">
              
              {/* JD Input */}
              <div className="card panel-card" style={{ padding: "16px", margin: "16px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ fontSize: "15px", color: "#ffffff", margin: "0 0 8px 0" }}>Target Job Description</h3>
                <textarea
                  className="textarea-jd"
                  rows="5"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the target job description here..."
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "10px", color: "#ffffff" }}
                ></textarea>

                {/* Target Keywords Input */}
                <div style={{ marginTop: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#c5c9db", marginBottom: "6px" }}>Target Keywords (comma-separated, optional):</label>
                  <input
                    type="text"
                    value={customKeywords}
                    onChange={(e) => setCustomKeywords(e.target.value)}
                    placeholder="e.g. React, Docker, Python, Agile"
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "8px 10px", color: "#ffffff", fontSize: "12px" }}
                  />
                </div>
                
                <div className="quick-presets" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Presets:</span>
                  <button className="preset-chip" onClick={() => handlePresetSelect("frontend")} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)", color: "#c5c9db", cursor: "pointer" }}>Frontend</button>
                  <button className="preset-chip" onClick={() => handlePresetSelect("backend")} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)", color: "#c5c9db", cursor: "pointer" }}>Backend</button>
                  <button className="preset-chip" onClick={() => handlePresetSelect("product")} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)", color: "#c5c9db", cursor: "pointer" }}>Product PM</button>
                </div>
                
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleRunAtsScan}
                  style={{ marginTop: "16px", padding: "10px" }}
                >
                  Scan Resume Compatibility
                </button>
              </div>

              {/* Scan Results */}
              {atsResult ? (
                <div style={{ padding: "0 16px 16px 16px" }}>
                  
                  {/* Tab Navigation */}
                  <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "16px", gap: "2px", overflowX: "auto" }}>
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "keywords", label: "Keywords" },
                      { id: "formatting", label: "Format & Length" },
                      { id: "contact", label: "Contact Info" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAtsActiveTab(tab.id)}
                        style={{
                          background: "none",
                          border: "none",
                          borderBottom: atsActiveTab === tab.id ? "2px solid #ef4444" : "2px solid transparent",
                          color: atsActiveTab === tab.id ? "#ef4444" : "#8f95b2",
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: atsActiveTab === tab.id ? "600" : "400",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s"
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab contents */}
                  {atsActiveTab === "overview" && (
                    <div>
                      {/* Gauge Score */}
                      <div className="card panel-card score-panel-card" style={{ padding: "16px", background: "rgba(239, 68, 68, 0.03)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.1)", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 16px 0", fontWeight: "600" }}>ATS Compatibility Rating</h3>
                        <div className="ats-score-display-row" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                          
                          <div className="score-circle-container" style={{ position: "relative", width: "100px", height: "100px" }}>
                            <svg width="100" height="100" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                              <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="10"></circle>
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="transparent"
                                stroke="#ef4444"
                                strokeWidth="10"
                                strokeDasharray="314.15"
                                strokeDashoffset={314.15 - (314.15 * atsResult.scoreOverall) / 100}
                                style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                              ></circle>
                            </svg>
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff" }}>{atsResult.scoreOverall}%</span>
                            </div>
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: "6px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8f95b2", marginBottom: "2px" }}>
                                <span>Keywords Match:</span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{atsResult.scoreKeywords}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#ef4444", borderRadius: "2px", width: `${atsResult.scoreKeywords}%` }}></div></div>
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8f95b2", marginBottom: "2px" }}>
                                <span>Structure Quality:</span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{atsResult.scoreStructure}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#ef4444", borderRadius: "2px", width: `${atsResult.scoreStructure}%` }}></div></div>
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8f95b2", marginBottom: "2px" }}>
                                <span>Format & Length:</span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{atsResult.scoreFormatting}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#ef4444", borderRadius: "2px", width: `${atsResult.scoreFormatting}%` }}></div></div>
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8f95b2", marginBottom: "2px" }}>
                                <span>Contact Channels:</span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{atsResult.scoreContact}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#ef4444", borderRadius: "2px", width: `${atsResult.scoreContact}%` }}></div></div>
                            </div>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8f95b2", marginBottom: "2px" }}>
                                <span>Style & Action Verbs:</span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{atsResult.scoreStyle}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#ef4444", borderRadius: "2px", width: `${atsResult.scoreStyle}%` }}></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Insights */}
                      <div className="card panel-card" style={{ padding: "12px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h4 style={{ fontSize: "12px", color: "#ffffff", margin: "0 0 8px 0", fontWeight: "600" }}>Quick Advice</h4>
                        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#c5c9db", display: "flex", flexDirection: "column", gap: "6px" }}>
                          {atsResult.scoreKeywords < 60 && <li>Tailor your resume by adding missing target keywords shown in the <strong>Keywords</strong> tab.</li>}
                          {atsResult.scoreStructure < 80 && <li>Ensure you populate all core sections like Projects, Certifications, and Summary.</li>}
                          {atsResult.scoreFormatting < 80 && <li>Audit your formatting. Use bullet points in descriptions and keep the word count ideal.</li>}
                          {atsResult.scoreContact < 100 && <li>Fill in missing contact details (portfolio URLs or online profiles).</li>}
                          {atsResult.scoreStyle < 80 && <li>Replace passive buzzwords (e.g. "responsible for") with active verbs.</li>}
                          {atsResult.scoreOverall >= 85 ? (
                            <li style={{ color: "#4ade80", listStyleType: "none", marginLeft: "-16px" }}>✓ Excellent resume profile. You have high ATS compatibility!</li>
                          ) : (
                            <li style={{ color: "#f87171", listStyleType: "none", marginLeft: "-16px" }}>⚠ Aim for an overall score above 80% to pass strict ATS filters.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {atsActiveTab === "keywords" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {/* Matched Keywords */}
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 10px 0", fontWeight: "600" }}>Matched Keywords ({atsResult.matchedKeywords.length})</h3>
                        {atsResult.matchedKeywords.length > 0 ? (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {atsResult.matchedKeywords.map((kw, i) => (
                              <span key={i} style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                                ✓ {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>No matched keywords found yet.</p>
                        )}
                      </div>

                      {/* Missing Keywords */}
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 10px 0", fontWeight: "600" }}>Missing Keywords ({atsResult.missingKeywords.length})</h3>
                        {atsResult.missingKeywords.length > 0 ? (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {atsResult.missingKeywords.map((kw, i) => (
                              <span key={i} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                                + {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "12px", color: "#4ade80", margin: 0 }}>✓ Perfect! No target keywords are missing.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {atsActiveTab === "formatting" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      
                      {/* Word Count */}
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 6px 0", fontWeight: "600" }}>Length Audit</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#c5c9db" }}>Word Count:</span>
                          <span style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: atsResult.wordCountStatus === "Ideal" ? "#4ade80" : (atsResult.wordCountStatus.includes("Long") || atsResult.wordCountStatus.includes("Short") ? "#fbbf24" : "#f87171")
                          }}>
                            {atsResult.wordCount} words ({atsResult.wordCountStatus})
                          </span>
                        </div>
                        {atsResult.wordCountWarning && (
                          <p style={{ fontSize: "11px", color: "#fbbf24", margin: 0, lineHeight: "1.4" }}>
                            ⚠ {atsResult.wordCountWarning}
                          </p>
                        )}
                      </div>

                      {/* Bullet Point Audit */}
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 8px 0", fontWeight: "600" }}>Bullet Points Audit</h3>
                        {atsResult.bulletDetails.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {atsResult.bulletDetails.map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "4px" }}>
                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                                  <span style={{ color: "var(--text-muted)", marginRight: "4px" }}>[{item.type}]</span>
                                  <span style={{ color: "#ffffff" }}>{item.title}</span>
                                </div>
                                <span style={{ color: item.hasBullets ? "#4ade80" : "#f87171", fontWeight: "500" }}>
                                  {item.hasBullets ? "✓ Found" : "✗ Plain Text"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>No job history or project descriptions detected to audit.</p>
                        )}
                      </div>

                      {/* Action Verbs */}
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 8px 0", fontWeight: "600" }}>Weak Verb Replacements</h3>
                        {atsResult.detectedBuzzwords.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {atsResult.detectedBuzzwords.map((rule, i) => (
                              <div key={i} style={{ fontSize: "11px", background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)", padding: "8px", borderRadius: "4px" }}>
                                <span style={{ color: "#fbbf24", fontWeight: "600" }}>"{rule.word}"</span>
                                <span style={{ color: "var(--text-muted)" }}> → Replace with: </span>
                                <span style={{ color: "#ffffff", fontWeight: "600" }}>{rule.replacements}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: "11px", color: "#4ade80", margin: 0 }}>✓ Excellent. No weak buzzwords found in job duties.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {atsActiveTab === "contact" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div className="card panel-card" style={{ padding: "14px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "13px", color: "#ffffff", margin: "0 0 10px 0", fontWeight: "600" }}>Contact Channels Checks</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Email Address:</span>
                            <span style={{ color: atsResult.contactChecks.emailValid ? "#4ade80" : "#f87171", fontWeight: "600" }}>
                              {atsResult.contactChecks.emailValid ? "✓ Found" : "✗ Missing"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Phone (Intl format):</span>
                            <span style={{ color: atsResult.contactChecks.phoneValid ? "#4ade80" : "#f87171", fontWeight: "600" }}>
                              {atsResult.contactChecks.phoneValid ? "✓ Found" : "✗ Missing"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>LinkedIn URL:</span>
                            <span style={{ color: atsResult.contactChecks.linkedinValid ? "#4ade80" : "#f87171", fontWeight: "600" }}>
                              {atsResult.contactChecks.linkedinValid ? "✓ Found" : "✗ Missing"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>GitHub URL:</span>
                            <span style={{ color: atsResult.contactChecks.githubValid ? "#4ade80" : "#f87171", fontWeight: "600" }}>
                              {atsResult.contactChecks.githubValid ? "✓ Found" : "✗ Missing"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Portfolio Webpage:</span>
                            <span style={{ color: atsResult.contactChecks.portfolioValid ? "#4ade80" : "#fbbf24", fontWeight: "600" }}>
                              {atsResult.contactChecks.portfolioValid ? "✓ Found" : "⚠ Missing"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--text-muted)", padding: "0 4px", lineHeight: "1.4" }}>
                        💡 <strong>Pro-Tip:</strong> Modern ATS parsers look for valid contact urls to automatically enrich your profile. Having both GitHub and a personal portfolio website raises response rates for technical jobs.
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  💡 Paste a Job Description and trigger scan to compute matches.
                </div>
              )}
            </div>
          )}

        </aside>

        {/* Right Live Preview Panel */}
        <main className="preview-panel">
          <div className="preview-actions-bar no-print">
            <div className="action-item">
              <label htmlFor="template-select">Theme Style</label>
              <select
                id="template-select"
                className="dropdown-control-sm"
                value={resume.templateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
              >
                {templatePresets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} {preset.isPremium ? "💎" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => { setShowLayoutSelector(true); scaleResumePreview(); }}>
              Layout Gallery
            </button>

            <button className="btn btn-primary btn-sm" onClick={() => setShowDownloadModal(true)}>
              Download Resume
            </button>
          </div>

          <div className="a4-sheet-container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div
              className={`a4-sheet layout-${activeTemplatePreset.layout} theme-${activeTemplatePreset.theme} font-${activeTemplatePreset.font} header-${activeTemplatePreset.header} ${activeTemplatePreset.id}`}
              id="resume-a4-sheet"
              style={{ overflow: "hidden" }}
            >
              {renderResumeHTML()}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer no-print">
        <div className="footer-left">
          <p>&copy; {new Date().getFullYear()} Kraft. All rights reserved.</p>
        </div>
        <div className="footer-center">
          <p>Resume ATS Score Checker & Profile Creator.</p>
        </div>
      </footer>

      {/* ONBOARDING WIZARD MODAL */}
      {showWizard && (
        <div className="wizard-overlay no-print">
          <div className="wizard-card">
            
            <div className="wizard-header">
              <h3>Create Profile Wizard</h3>
              <p>Answer a few quick questions to populate your professional CV template.</p>
              
              <div className="stepper-progress-bar">
                <div className={`step-node ${wizardStep >= 1 ? "active" : ""}`}><span>1</span><label>Contact</label></div>
                <div className="step-line"></div>
                <div className={`step-node ${wizardStep >= 2 ? "active" : ""}`}><span>2</span><label>Academic</label></div>
                <div className="step-line"></div>
                <div className={`step-node ${wizardStep >= 3 ? "active" : ""}`}><span>3</span><label>Experience</label></div>
                <div className="step-line"></div>
                <div className={`step-node ${wizardStep >= 4 ? "active" : ""}`}><span>4</span><label>Projects</label></div>
                <div className="step-line"></div>
                <div className={`step-node ${wizardStep >= 5 ? "active" : ""}`}><span>5</span><label>Skills</label></div>
              </div>
            </div>

            <div className="wizard-body" style={{ maxHeight: "400px", overflowY: "auto", padding: "20px" }}>
              
              {/* Wizard Step 1: Contact */}
              {wizardStep === 1 && (
                <div className="wizard-step-panel active">
                  <h4>1. Personal & Contact Details</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name <span className="required">*</span></label>
                      <input type="text" value={wizardData.firstname} onChange={(e) => setWizardData({...wizardData, firstname: e.target.value})} placeholder="John" />
                    </div>
                    <div className="form-group">
                      <label>Last Name <span className="required">*</span></label>
                      <input type="text" value={wizardData.lastname} onChange={(e) => setWizardData({...wizardData, lastname: e.target.value})} placeholder="Doe" />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                      <label>Target Job Title</label>
                      <input type="text" value={wizardData.jobtitle} onChange={(e) => setWizardData({...wizardData, jobtitle: e.target.value})} placeholder="e.g. Frontend Engineer" />
                    </div>
                    <div className="form-group">
                      <label>Primary Email <span className="required">*</span></label>
                      <input type="email" value={wizardData.email} onChange={(e) => setWizardData({...wizardData, email: e.target.value})} placeholder="email@address.com" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number <span className="required">*</span></label>
                      <input type="text" value={wizardData.phone} onChange={(e) => setWizardData({...wizardData, phone: e.target.value})} placeholder="+91 9999999999" />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                      <label>Location</label>
                      <input type="text" value={wizardData.location} onChange={(e) => setWizardData({...wizardData, location: e.target.value})} placeholder="e.g. Mumbai, India" />
                    </div>
                    <div className="form-group">
                      <label>Profile Photo</label>
                      <div className="photo-upload-container">
                        <input type="file" id="wizard-photo-upload" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} style={{ display: "none" }} />
                        <div className="photo-buttons-row">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById("wizard-photo-upload").click()}>
                            Upload Photo
                          </button>
                          {wizardData.photo && (
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemovePhoto(true)}>
                              Remove
                            </button>
                          )}
                        </div>
                        {wizardData.photo && (
                          <div className="photo-preview-mini">
                            <img src={wizardData.photo} alt="Upload Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Step 2: Academic */}
              {wizardStep === 2 && (
                <div className="wizard-step-panel active">
                  <h4>2. Academic History</h4>
                  <p className="step-desc">Enter your graduation, high school, or diploma records.</p>
                  
                  <div className="dynamic-list-container">
                    {(wizardData.education || []).map((edu, idx) => (
                      <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h5 style={{ margin: 0 }}>Degree #{idx + 1}</h5>
                          <button type="button" onClick={() => handleWizardRemoveItem("education", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Degree / Class</label>
                            <input type="text" value={edu.degree} onChange={(e) => handleWizardItemChange("education", idx, "degree", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>School / College</label>
                            <input type="text" value={edu.school} onChange={(e) => handleWizardItemChange("education", idx, "school", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Passing Year / Duration</label>
                            <input type="text" value={edu.years} onChange={(e) => handleWizardItemChange("education", idx, "years", e.target.value)} placeholder="e.g. 2021-2025" />
                          </div>
                          <div className="form-group">
                            <label>CGPA / Score</label>
                            <input type="text" value={edu.score} onChange={(e) => handleWizardItemChange("education", idx, "score", e.target.value)} placeholder="e.g. 9.1 CGPA" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleWizardAddItem("education")}>
                    + Add Education Record
                  </button>
                </div>
              )}

              {/* Wizard Step 3: Experience */}
              {wizardStep === 3 && (
                <div className="wizard-step-panel active">
                  <h4>3. Internships, Jobs & Leadership</h4>
                  
                  <div className="wizard-section-divider" style={{ margin: "16px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Internships & Jobs</div>
                  <div className="dynamic-list-container">
                    {(wizardData.experience || []).map((exp, idx) => (
                      <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h5 style={{ margin: 0 }}>Job #{idx + 1}</h5>
                          <button type="button" onClick={() => handleWizardRemoveItem("experience", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Role</label>
                            <input type="text" value={exp.role} onChange={(e) => handleWizardItemChange("experience", idx, "role", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Company</label>
                            <input type="text" value={exp.company} onChange={(e) => handleWizardItemChange("experience", idx, "company", e.target.value)} />
                          </div>
                          <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Dates</label>
                            <input type="text" value={exp.dates} onChange={(e) => handleWizardItemChange("experience", idx, "dates", e.target.value)} />
                          </div>
                          <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Description</label>
                            <textarea rows="2" value={exp.desc} onChange={(e) => handleWizardItemChange("experience", idx, "desc", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm mb-4" onClick={() => handleWizardAddItem("experience")}>
                    + Add Internship / Job
                  </button>

                  <div className="wizard-section-divider" style={{ margin: "24px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Positions of Responsibility</div>
                  <div className="dynamic-list-container">
                    {(wizardData.responsibility || []).map((por, idx) => (
                      <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h5 style={{ margin: 0 }}>POR #{idx + 1}</h5>
                          <button type="button" onClick={() => handleWizardRemoveItem("responsibility", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Role</label>
                            <input type="text" value={por.role} onChange={(e) => handleWizardItemChange("responsibility", idx, "role", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Organization</label>
                            <input type="text" value={por.organization} onChange={(e) => handleWizardItemChange("responsibility", idx, "organization", e.target.value)} />
                          </div>
                          <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Dates</label>
                            <input type="text" value={por.dates} onChange={(e) => handleWizardItemChange("responsibility", idx, "dates", e.target.value)} />
                          </div>
                          <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Description</label>
                            <textarea rows="2" value={por.desc} onChange={(e) => handleWizardItemChange("responsibility", idx, "desc", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleWizardAddItem("responsibility")}>
                    + Add Leadership Role
                  </button>
                </div>
              )}

              {/* Wizard Step 4: Projects */}
              {wizardStep === 4 && (
                <div className="wizard-step-panel active">
                  <h4>4. Projects & Certifications</h4>
                  
                  <div className="wizard-section-divider" style={{ margin: "16px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Projects</div>
                  <div className="dynamic-list-container">
                    {(wizardData.projects || []).map((proj, idx) => (
                      <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h5 style={{ margin: 0 }}>Project #{idx + 1}</h5>
                          <button type="button" onClick={() => handleWizardRemoveItem("projects", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Project Title</label>
                            <input type="text" value={proj.name} onChange={(e) => handleWizardItemChange("projects", idx, "name", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Tech Stack</label>
                            <input type="text" value={proj.tech} onChange={(e) => handleWizardItemChange("projects", idx, "tech", e.target.value)} placeholder="e.g. React, Node.js" />
                          </div>
                          <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Description</label>
                            <textarea rows="2" value={proj.desc} onChange={(e) => handleWizardItemChange("projects", idx, "desc", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm mb-4" onClick={() => handleWizardAddItem("projects")}>
                    + Add Project
                  </button>

                  <div className="wizard-section-divider" style={{ margin: "24px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Certifications</div>
                  <div className="dynamic-list-container">
                    {(wizardData.certifications || []).map((cert, idx) => (
                      <div key={idx} className="card-item" style={{ marginBottom: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h5 style={{ margin: 0 }}>Certificate #{idx + 1}</h5>
                          <button type="button" onClick={() => handleWizardRemoveItem("certifications", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Certificate Name</label>
                            <input type="text" value={cert.name} onChange={(e) => handleWizardItemChange("certifications", idx, "name", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" value={cert.organization} onChange={(e) => handleWizardItemChange("certifications", idx, "organization", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleWizardAddItem("certifications")}>
                    + Add Certification
                  </button>
                </div>
              )}

              {/* Wizard Step 5: Skills */}
              {wizardStep === 5 && (
                <div className="wizard-step-panel active">
                  <h4>5. Skills & Social Links</h4>
                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label>Key Skills (comma separated)</label>
                    <textarea rows="3" value={wizardData.skills} onChange={(e) => setWizardData({...wizardData, skills: e.target.value})} placeholder="e.g. React, Redux, TypeScript, Git, SQL" style={{ width: "100%" }}></textarea>
                  </div>

                  <div className="wizard-section-divider" style={{ margin: "20px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Professional Pitch</div>
                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label>Short professional summary / introduction</label>
                    <textarea rows="3" value={wizardData.summary} onChange={(e) => setWizardData({...wizardData, summary: e.target.value})} placeholder="Briefly describe your profile and career goals..." style={{ width: "100%" }}></textarea>
                  </div>

                  <div className="wizard-section-divider" style={{ margin: "20px 0 8px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#ef4444" }}>Profile Links</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>LinkedIn Link</label>
                      <input type="text" value={wizardData.linkedin} onChange={(e) => setWizardData({...wizardData, linkedin: e.target.value})} placeholder="linkedin.com/in/username" />
                    </div>
                    <div className="form-group">
                      <label>GitHub Username URL</label>
                      <input type="text" value={wizardData.github} onChange={(e) => setWizardData({...wizardData, github: e.target.value})} placeholder="github.com/username" />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                      <label>Portfolio / Personal Website</label>
                      <input type="text" value={wizardData.portfolio} onChange={(e) => setWizardData({...wizardData, portfolio: e.target.value})} placeholder="portfolio.com" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="wizard-footer" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-secondary" onClick={handleWizardBack} disabled={wizardStep === 1}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleWizardNext}>
                {wizardStep === 5 ? "Generate Resume" : "Next"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LAYOUT SELECTOR GALLERY SCREEN */}
      {showLayoutSelector && (
        <div className="layout-selector-screen no-print">
          <div className="selector-container" style={{ padding: "40px 20px" }}>
            <div className="selector-header" style={{ marginBottom: "30px", textAlign: "center" }}>
              <h2>Select a Resume Style</h2>
              <p>Choose from professional design systems. All templates are completely free.</p>
              
              {/* Category filters */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                {["All", "Executive", "Classic", "Creative", "Tech", "Minimal", "Academic", "Compact"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setLayoutCategory(cat)}
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: layoutCategory === cat ? "#ef4444" : "rgba(255,255,255,0.05)",
                      background: layoutCategory === cat ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.02)",
                      color: layoutCategory === cat ? "#ffffff" : "#c5c9db",
                      cursor: "pointer"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="templates-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
              {templatePresets
                .filter(p => layoutCategory === "All" || p.category === layoutCategory)
                .map(preset => {
                  const isLocked = preset.isPremium && !user?.isPremium;
                  return (
                    <div
                      key={preset.id}
                      className="template-card"
                      onClick={() => handleSelectTemplate(preset.id)}
                      style={{
                        background: "rgba(15, 19, 26, 0.5)",
                        border: resume.templateId === preset.id ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      {isLocked && (
                        <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(15, 19, 26, 0.9)", border: "1px solid #fbbf24", color: "#fbbf24", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>
                          PRO 🔒
                        </div>
                      )}
                      {(() => {
                        const dummyResume = {
                          templateId: preset.id,
                          photo: "/dummy_avatar.png",
                          fullname: "Alex Johnson",
                          jobtitle: "Senior Product Designer",
                          email: "alex.johnson@example.com",
                          phone: "+1 (555) 019-2834",
                          location: "San Francisco, CA",
                          linkedin: "linkedin.com/in/alexj",
                          github: "github.com/alexj",
                          portfolio: "alexj.design",
                          summary: "Results-driven Senior Product Designer with 6+ years of experience leading cross-functional teams to build user-centric SaaS interfaces and scalable design systems.",
                          experience: [
                            {
                              role: "Lead Product Designer",
                              company: "Innovate Tech",
                              dates: "2022 - Present",
                              desc: "Led development of core design systems, improving user engagement by 40%."
                            },
                            {
                              role: "UX Designer",
                              company: "Pixel Agency",
                              dates: "2020 - 2022",
                              desc: "Created responsive user flows, mockups, and high-fidelity wireframes."
                            }
                          ],
                          responsibility: [
                            {
                              role: "Design Mentor",
                              organization: "ADPList",
                              dates: "2023 - Present",
                              desc: "Mentored 50+ junior designers globally in portfolio reviews and design career growth."
                            }
                          ],
                          projects: [
                            {
                              name: "Design System Kit",
                              tech: "React, Figma, CSS Grid",
                              desc: "Built and open-sourced a React UI library with over 5,000 active downloads."
                            }
                          ],
                          education: [
                            {
                              degree: "B.Sc. in Human-Computer Interaction",
                              school: "Design University",
                              years: "2016 - 2020",
                              score: "3.9 CGPA"
                            }
                          ],
                          certifications: [
                            {
                              name: "Google UX Design Professional Certificate",
                              organization: "Coursera"
                            }
                          ],
                          skills: "Figma, React, UI/UX Design, CSS Grid, Prototyping, Design Systems, Wireframing"
                        };

                        return (
                          <div className="template-preview-thumbnail" style={{ 
                            height: "200px", 
                            background: "#090b0f", 
                            borderRadius: "6px", 
                            marginBottom: "12px", 
                            border: "1px solid rgba(255,255,255,0.02)",
                            overflow: "hidden",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start"
                          }}>
                            <div 
                              className={`a4-sheet layout-${preset.layout} theme-${preset.theme} font-${preset.font} header-${preset.header} ${preset.id}`}
                              style={{ 
                                transform: "scale(0.23)", 
                                transformOrigin: "top center", 
                                width: "794px", 
                                height: "1123px", 
                                pointerEvents: "none", 
                                position: "absolute", 
                                top: 0, 
                                background: "#ffffff",
                                color: "#334155",
                                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                                padding: "40px 30px" // give it tight padding for mini renders
                              }}
                            >
                              {renderResumeHTML(dummyResume)}
                            </div>
                          </div>
                        );
                      })()}
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#ffffff" }}>{preset.name}</h4>
                      <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>{preset.desc}</p>
                    </div>
                  );
                })}
            </div>

            <div className="selector-footer" style={{ marginTop: "40px", textAlign: "center" }}>
              <button className="btn btn-secondary" onClick={() => setShowLayoutSelector(false)}>
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD FORMAT SELECTION MODAL */}
      {showDownloadModal && (
        <div className="wizard-overlay no-print">
          <div className="wizard-card download-modal-card" style={{ maxWidth: "450px" }}>
            <div className="wizard-header">
              <h3>Download Resume</h3>
              <p>Select your desired download format. PDF matches your styling exactly.</p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px" }}>
              <div 
                onClick={triggerPdfPrint}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div style={{ background: "rgba(239, 68, 68, 0.15)", width: "40px", height: "40px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: "18px" }}>PDF</div>
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: "0 0 2px 0", color: "#ffffff", fontSize: "14px" }}>A4 PDF Document (.pdf)</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>Renders standard A4 sizing. Best for emails and ATS parsing.</p>
                </div>
              </div>

              <div 
                onClick={downloadDocx}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div style={{ background: "rgba(59, 130, 246, 0.15)", width: "40px", height: "40px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "18px" }}>DOC</div>
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: "0 0 2px 0", color: "#ffffff", fontSize: "14px" }}>Word Document (.doc)</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>Preserves document text columns. Fully editable in MS Word.</p>
                </div>
              </div>
            </div>

            <div className="wizard-footer" style={{ padding: "12px 20px" }}>
              <button className="btn btn-secondary btn-block" onClick={() => setShowDownloadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Toast Wrapper */}
      <div className="toast-wrapper no-print">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`} style={{ background: "rgba(15, 19, 26, 0.95)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `4px solid ${toast.type === "success" ? "#ef4444" : toast.type === "warning" ? "#fbbf24" : "#3b82f6"}`, padding: "12px 18px", borderRadius: "6px", color: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", fontSize: "13px", animation: "slideIn 0.2s ease" }}>
            {toast.message}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Editor;
