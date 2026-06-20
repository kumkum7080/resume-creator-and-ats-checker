/* ==========================================================================
   SPECTRA ONBOARDER — CORE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     GLOBAL STATE (FULLY DYNAMIC LISTS)
     ========================================================================== */
  const state = {
    currentStep: 1,
    selectedTemplate: 'tpl-1', // Default to Emerald Executive

    resume: {
      firstname: 'Kumkum',
      lastname: 'Kushwaha',
      fullname: 'Kumkum Kushwaha',
      jobtitle: 'Frontend Engineer',
      email: 'kumkumkushwaha7080@gmail.com',
      phone: '+91 7080000000',
      location: 'New Delhi, India',
      gender: 'Female',
      
      summary: 'Innovative and detail-oriented Frontend Developer with a strong focus on building highly aesthetic, responsive, and performance-optimized web layouts. Experienced in modern JavaScript environments, state management structures, and cross-team collaboration.',

      // DYNAMIC LISTS
      education: [
        { id: 'edu-1', degree: 'B.Tech', school: 'Technical University Delhi', years: '2020 - 2024', score: '8.5 CGPA' },
        { id: 'edu-2', degree: 'Senior Secondary (XII)', school: 'St. Mary Public School (CBSE)', years: '2020', score: '92%' },
        { id: 'edu-3', degree: 'Secondary (X)', school: 'St. Mary Public School (CBSE)', years: '2018', score: '94%' }
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Junior Frontend Developer',
          company: 'PixelForge Tech',
          dates: '2024 - Present',
          desc: 'Responsible for building responsive client interfaces using React, HTML5, and CSS3.\nCollaborated on state management systems and optimized image modules to speed up page loads.'
        }
      ],
      responsibility: [
        {
          id: 'por-1',
          role: 'Coordinator',
          organization: 'College Coding Club',
          dates: '2022 - 2024',
          desc: 'Organized 3 web development hackathons with over 150+ participants. Promoted coding culture and mentored junior members on fullstack development.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Spectra Design Suite',
          tech: 'React, HSL Canvas, CSS Variables',
          desc: 'Engineered an interactive designer palette kit allowing real-time CSS gradients editing, canvas-based image color extraction, and WCAG contrast check indicators.'
        }
      ],
      certifications: [
        { id: 'cert-1', name: 'Advanced Frontend Specialization', organization: 'Udemy Academy', dates: '2024' }
      ],

      skills: 'React, Redux, TypeScript, JavaScript, HTML5, CSS3, Responsive Design, Git, Agile, Scrum, APIs',
      
      linkedin: 'linkedin.com/in/kumkum-kushwaha',
      github: 'github.com/kumkumkushwaha',
      portfolio: 'kumkumkushwaha.dev',
      photo: ''
    },

    // Job Description State
    jdText: '',
    jdKeywords: { hard: [], soft: [] },
    matchedKeywords: [],
    missingKeywords: [],
    
    // Scores
    scoreOverall: 0,
    scoreKeywords: 0,
    scoreStructure: 0,
    scoreContact: 0,
    scoreStyle: 0
  };

  // 20 PRECONFIGURED TEMPLATESpres
  const templatePresets = [
    { id: 'tpl-1', name: 'Emerald Executive', category: 'Executive', layout: 'split-left', theme: 'emerald', font: 'modern', header: 'banner', desc: 'Emerald sidebar layout for corporate leadership' },
    { id: 'tpl-2', name: 'Charcoal Classic', category: 'Classic', layout: 'classic', theme: 'slate', font: 'serif', header: 'border', desc: 'Serif classic single column layout' },
    { id: 'tpl-3', name: 'Sapphire Split', category: 'Classic', layout: 'split-left', theme: 'navy', font: 'modern', header: 'clean', desc: 'Sleek navy sidebar layout with clean titles' },
    { id: 'tpl-4', name: 'Ruby Timeline', category: 'Creative', layout: 'timeline', theme: 'amber', font: 'modern', header: 'clean', desc: 'Timeline layout with crimson accents' },
    { id: 'tpl-5', name: 'Sunset Tech', category: 'Tech', layout: 'split-right', theme: 'amber', font: 'mono', header: 'clean', desc: 'Monospace tech template with right sidebar' },
    { id: 'tpl-6', name: 'Royal Creative', category: 'Creative', layout: 'classic', theme: 'purple', font: 'modern', header: 'banner', desc: 'Creative purple layout with bold banner header' },
    { id: 'tpl-7', name: 'Monochrome Minimal', category: 'Minimal', layout: 'timeline', theme: 'slate', font: 'modern', header: 'clean', desc: 'Clean, minimal single-column timeline' },
    { id: 'tpl-8', name: 'Mint Academic', category: 'Academic', layout: 'classic', theme: 'emerald', font: 'serif', header: 'border', desc: 'Academic layout with serif fonts and emerald borders' },
    { id: 'tpl-9', name: 'Indigo Corporate', category: 'Executive', layout: 'split-left', theme: 'navy', font: 'serif', header: 'banner', desc: 'Navy blue sidebar layout with classic serif headers' },
    { id: 'tpl-10', name: 'Tangerine Bold', category: 'Creative', layout: 'split-right', theme: 'amber', font: 'modern', header: 'banner', desc: 'Bold orange layout with banner header' },
    { id: 'tpl-11', name: 'Orchid Elegant', category: 'Creative', layout: 'classic', theme: 'purple', font: 'serif', header: 'border', desc: 'Orchid purple layout with elegant serif accents' },
    { id: 'tpl-12', name: 'Slate Compact', category: 'Minimal', layout: 'split-right', theme: 'slate', font: 'mono', header: 'clean', desc: 'Compact monospace layout for developers' },
    { id: 'tpl-13', name: 'Forest Engineer', category: 'Tech', layout: 'timeline', theme: 'emerald', font: 'mono', header: 'clean', desc: 'Mint timeline layout for developers and designers' },
    { id: 'tpl-14', name: 'Cobalt Scholar', category: 'Academic', layout: 'classic', theme: 'navy', font: 'serif', header: 'clean', desc: 'Sleek dark blue single-column academic style' },
    { id: 'tpl-15', name: 'Amber Executive', category: 'Executive', layout: 'split-left', theme: 'amber', font: 'modern', header: 'border', desc: 'Warm amber executive layout with vertical splits' },
    { id: 'tpl-16', name: 'Plum Creative', category: 'Creative', layout: 'split-right', theme: 'purple', font: 'modern', header: 'banner', desc: 'Deep violet creative layout with sidebar' },
    { id: 'tpl-17', name: 'Teal Professional', category: 'Classic', layout: 'split-left', theme: 'emerald', font: 'modern', header: 'border', desc: 'Professional teal left-sidebar template' },
    { id: 'tpl-18', name: 'Steel Tech', category: 'Tech', layout: 'classic', theme: 'slate', font: 'mono', header: 'banner', desc: 'Monospace tech template with steel-grey top banner' },
    { id: 'tpl-19', name: 'Navy Director', category: 'Executive', layout: 'classic', theme: 'navy', font: 'modern', header: 'border', desc: 'Bold corporate director layout with dark blue underlines' },
    { id: 'tpl-20', name: 'Violet Modernist', category: 'Creative', layout: 'timeline', theme: 'purple', font: 'modern', header: 'banner', desc: 'Purple timeline modernist layout with banner header' },
    
    // NEW TEMPLATES (tpl-21 to tpl-60)
    { id: 'tpl-21', name: 'Coral Compact', category: 'Compact', layout: 'classic', theme: 'coral', font: 'modern', header: 'clean', desc: 'Compact layout with warm coral highlights' },
    { id: 'tpl-22', name: 'Olive Sage Minimalist', category: 'Minimal', layout: 'classic', theme: 'olive', font: 'serif', header: 'clean', desc: 'Earthy sage olive theme with minimalist lowercase headers' },
    { id: 'tpl-23', name: 'Rose Gold Creative', category: 'Creative', layout: 'classic', theme: 'rose', font: 'modern', header: 'border', desc: 'Creative rose theme with solid banner block headings' },
    { id: 'tpl-24', name: 'Chocolate Academic', category: 'Academic', layout: 'classic', theme: 'chocolate', font: 'serif', header: 'border', desc: 'Bronze brown theme with classic centred academic CV styling' },
    { id: 'tpl-25', name: 'Teal Split Modern', category: 'Classic', layout: 'split-left', theme: 'teal', font: 'modern', header: 'clean', desc: 'Teal theme with split column and vertical separator border' },
    { id: 'tpl-26', name: 'Crimson Executive', category: 'Executive', layout: 'split-right', theme: 'crimson', font: 'modern', header: 'border', desc: 'Ruby red theme with double header columns' },
    { id: 'tpl-27', name: 'Charcoal Tech Minimal', category: 'Tech', layout: 'classic', theme: 'charcoal', font: 'mono', header: 'clean', desc: 'Ultra clean dark grey theme, technical monospace layout' },
    { id: 'tpl-28', name: 'Indigo Hybrid', category: 'Creative', layout: 'split-left', theme: 'indigo', font: 'modern', header: 'banner', desc: 'Deep indigo theme with light card-styled sections' },
    { id: 'tpl-29', name: 'Gold Vintage Director', category: 'Executive', layout: 'classic', theme: 'gold', font: 'serif', header: 'border', desc: 'Mustard gold theme with elegant double borders' },
    { id: 'tpl-30', name: 'Mint Modernist', category: 'Creative', layout: 'timeline', theme: 'mint', font: 'modern', header: 'clean', desc: 'Soft mint green theme with square dashed timeline nodes' },
    { id: 'tpl-31', name: 'Lavender Elegant', category: 'Creative', layout: 'classic', theme: 'lavender', font: 'serif', header: 'clean', desc: 'Lavender theme with a decorative summary block' },
    { id: 'tpl-32', name: 'Sky Blue Academic', category: 'Academic', layout: 'classic', theme: 'sky', font: 'serif', header: 'border', desc: 'Sky blue theme with minimal academic layouts' },
    { id: 'tpl-33', name: 'Coral Creative Split', category: 'Creative', layout: 'split-left', theme: 'coral', font: 'modern', header: 'banner', desc: 'Coral theme with full-height left-sidebar' },
    { id: 'tpl-34', name: 'Olive Tech Grid', category: 'Tech', layout: 'split-right', theme: 'olive', font: 'mono', header: 'clean', desc: 'Sage theme with block skill capsules' },
    { id: 'tpl-35', name: 'Rose Executive', category: 'Executive', layout: 'classic', theme: 'rose', font: 'modern', header: 'banner', desc: 'Rose pink theme with banner header and center profile photo' },
    { id: 'tpl-36', name: 'Bronze Academic', category: 'Academic', layout: 'classic', theme: 'chocolate', font: 'serif', header: 'clean', desc: 'Warm bronze theme with elegant serif formatting' },
    { id: 'tpl-37', name: 'Teal Creative Timeline', category: 'Creative', layout: 'timeline', theme: 'teal', font: 'modern', header: 'clean', desc: 'Teal theme with diamond timeline nodes' },
    { id: 'tpl-38', name: 'Crimson Tech Split', category: 'Tech', layout: 'split-right', theme: 'crimson', font: 'mono', header: 'clean', desc: 'Deep red theme with right sidebar layout' },
    { id: 'tpl-39', name: 'Slate Compact Grid', category: 'Compact', layout: 'split-left', theme: 'slate', font: 'mono', header: 'clean', desc: 'Steel grey compact grid layout' },
    { id: 'tpl-40', name: 'Indigo Elegant Director', category: 'Executive', layout: 'classic', theme: 'indigo', font: 'serif', header: 'border', desc: 'Indigo theme with classic double underline header' },
    { id: 'tpl-41', name: 'Gold Bold Creative', category: 'Creative', layout: 'classic', theme: 'gold', font: 'modern', header: 'clean', desc: 'Gold theme with large bold display font' },
    { id: 'tpl-42', name: 'Mint Compact Minimal', category: 'Minimal', layout: 'classic', theme: 'mint', font: 'mono', header: 'clean', desc: 'Mint theme with tight vertical spacing' },
    { id: 'tpl-43', name: 'Lavender Split Scholar', category: 'Academic', layout: 'split-left', theme: 'lavender', font: 'serif', header: 'clean', desc: 'Lavender split scholar layout' },
    { id: 'tpl-44', name: 'Sky Academic Director', category: 'Academic', layout: 'classic', theme: 'sky', font: 'serif', header: 'border', desc: 'Sky blue elegant scholar layout' },
    { id: 'tpl-45', name: 'Coral Tech Minimalist', category: 'Minimal', layout: 'classic', theme: 'coral', font: 'mono', header: 'clean', desc: 'Coral theme with sleek left border' },
    { id: 'tpl-46', name: 'Olive Bold Executive', category: 'Executive', layout: 'classic', theme: 'olive', font: 'modern', header: 'banner', desc: 'Sage green bold corporate executive' },
    { id: 'tpl-47', name: 'Rose Elegant Split', category: 'Creative', layout: 'split-left', theme: 'rose', font: 'serif', header: 'clean', desc: 'Rose theme with split columns and rounded card backgrounds' },
    { id: 'tpl-48', name: 'Bronze Creative Scholar', category: 'Creative', layout: 'timeline', theme: 'chocolate', font: 'serif', header: 'clean', desc: 'Bronze timeline scholar layout' },
    { id: 'tpl-49', name: 'Teal Executive Grid', category: 'Executive', layout: 'split-left', theme: 'teal', font: 'modern', header: 'border', desc: 'Teal theme with split column layout' },
    { id: 'tpl-50', name: 'Crimson Elegant Compact', category: 'Compact', layout: 'classic', theme: 'crimson', font: 'serif', header: 'border', desc: 'Crimson compact margins elegant layout' },
    { id: 'tpl-51', name: 'Slate Technical Hybrid', category: 'Tech', layout: 'classic', theme: 'slate', font: 'mono', header: 'clean', desc: 'Slate technical hybrid layout' },
    { id: 'tpl-52', name: 'Indigo Compact Scholar', category: 'Academic', layout: 'classic', theme: 'indigo', font: 'serif', header: 'clean', desc: 'Indigo compact scholar single column' },
    { id: 'tpl-53', name: 'Gold Compact Minimal', category: 'Minimal', layout: 'classic', theme: 'gold', font: 'modern', header: 'clean', desc: 'Gold compact minimal layout' },
    { id: 'tpl-54', name: 'Mint Creative Executive', category: 'Executive', layout: 'split-left', theme: 'mint', font: 'modern', header: 'banner', desc: 'Mint theme with creative executive header banner' },
    { id: 'tpl-55', name: 'Lavender Tech Timeline', category: 'Tech', layout: 'timeline', theme: 'lavender', font: 'mono', header: 'clean', desc: 'Lavender tech timeline with solid track' },
    { id: 'tpl-56', name: 'Sky Compact Grid', category: 'Compact', layout: 'split-right', theme: 'sky', font: 'modern', header: 'clean', desc: 'Sky blue compact grid layout' },
    { id: 'tpl-57', name: 'Coral Academic Scholar', category: 'Academic', layout: 'classic', theme: 'coral', font: 'serif', header: 'border', desc: 'Coral academic scholar layout' },
    { id: 'tpl-58', name: 'Olive Creative Timeline', category: 'Creative', layout: 'timeline', theme: 'olive', font: 'serif', header: 'clean', desc: 'Sage timeline layout with elegant headers' },
    { id: 'tpl-59', name: 'Rose Technical Minimal', category: 'Minimal', layout: 'classic', theme: 'rose', font: 'mono', header: 'clean', desc: 'Rose technical layout with clean sidebar lines' },
    { id: 'tpl-60', name: 'Bronze Executive Compact', category: 'Executive', layout: 'split-right', theme: 'chocolate', font: 'modern', header: 'border', desc: 'Bronze executive compact split layout' }
  ];

  // Job Listing Presets
  const jdPresets = {
    frontend: `Frontend Engineer (React)
    
We are seeking a Frontend Engineer to join our team. In this role, you will build beautiful responsive user interfaces using HTML5, CSS3, and modern JavaScript.
Requirements:
- Strong experience with React, Redux, and state management.
- Proficiency in TypeScript and Git version control.
- Experience with responsive design, CSS variables, and styling systems.
- Optimization of web assets for speed, performance, and accessibility.
- Good communication and collaboration skills to work in an Agile scrum environment.`,

    backend: `Backend Developer (Python/Node)
    
We are looking for a Backend Software Developer to scale our database APIs and background architecture.
Requirements:
- Strong experience building web applications in Python (Django/Flask) or Node.js (Express).
- Deep knowledge of SQL databases, database migrations, and queries optimization.
- Designing secure RESTful APIs.
- Experience with Docker, Redis caching, and cloud platforms like AWS or Google Cloud.
- Problem-solving skills and experience with container orchestration and server deployments.`,

    product: `Product Manager

We are hiring a Product Manager to guide the roadmap and lifecycle of our client design suites.
Requirements:
- Leading product roadmap planning and prioritization.
- Experience running Agile sprint planning and writing user stories.
- Conducting user research, mapping workflows, and building wireframes using Figma.
- Reviewing analytics, setting telemetry goals, and gathering stakeholder feedback.
- Strong leadership, public presentation, and cross-team collaboration skills.`
  };

  // Hard skills categorization list
  const hardSkillsList = new Set([
    'react', 'redux', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3', 'git', 'github', 
    'python', 'django', 'flask', 'node', 'node.js', 'express', 'sql', 'mysql', 'postgres', 'postgresql', 
    'nosql', 'mongodb', 'docker', 'redis', 'aws', 'gcp', 'docker', 'kubernetes', 'aws', 'azure', 'graphql',
    'rest', 'api', 'apis', 'c++', 'c#', 'java', 'php', 'laravel', 'figma', 'wireframes', 'wireframing',
    'analytics', 'telemetry', 'ci/cd', 'linux', 'sass', 'tailwind', 'angular', 'vue'
  ]);

  // Buzzwords list
  const buzzwordRules = [
    { word: 'responsible for', replacements: 'Spearheaded, Orchestrated, Executed' },
    { word: 'duties included', replacements: 'Directed, Executed, Managed' },
    { word: 'assisted with', replacements: 'Collaborated on, Facilitated' },
    { word: 'worked on', replacements: 'Engineered, Crafted, Deployed' },
    { word: 'helped to', replacements: 'Strengthened, Accelerated, Advised' },
    { word: 'team player', replacements: 'Collaborator, Contributor' },
    { word: 'detail-oriented', replacements: 'Analytical, Meticulous' }
  ];

  // Stop words
  const stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 
    'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 
    'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 
    'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 
    'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 
    'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 
    'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 
    'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 
    'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 
    'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 
    'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 
    'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 
    'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 
    'your', 'yours', 'yourself', 'yourselves',
    'we', 'our', 'us', 'you', 'role', 'listing', 'seeking', 'join', 'work', 'skills', 'experience', 
    'strong', 'good', 'ability', 'candidate', 'requirements', 'requirements:', 'role:', 'experience', 'years'
  ]);

  /* ==========================================================================
     DOM ELEMENTS CACHE
     ========================================================================== */
  const authScreen = document.getElementById('auth-screen');
  const wizardOverlay = document.getElementById('onboarding-wizard');
  const layoutSelectorScreen = document.getElementById('layout-selector-screen');
  const mainWorkspaceLayout = document.getElementById('main-workspace-layout');
  
  const btnWizardBack = document.getElementById('btn-wizard-back');
  const btnWizardNext = document.getElementById('btn-wizard-next');
  
  const tabBtnBuilder = document.getElementById('tab-btn-builder');
  const tabBtnAts = document.getElementById('tab-btn-ats');
  const panelBuilder = document.getElementById('panel-builder');
  const panelAts = document.getElementById('panel-ats');
  
  const toastWrapper = document.getElementById('toast-wrapper');

  /* ==========================================================================
     VIEW ROUTER SYSTEM (FULL-SCREEN TRANSITIONS)
     ========================================================================== */
  function navigateToView(viewName) {
    const screens = {
      auth: authScreen,
      wizard: wizardOverlay,
      selector: layoutSelectorScreen,
      workspace: mainWorkspaceLayout
    };
    
    Object.keys(screens).forEach(key => {
      if (screens[key]) {
        if (key === viewName) {
          screens[key].classList.remove('hidden');
        } else {
          screens[key].classList.add('hidden');
        }
      }
    });
  }

  /* ==========================================================================
     SIGNUP / LOGIN INTERACTION LOGIC
     ========================================================================== */
  // Video playlist for authentication screen background
  const authBgVideos = [
    'videos/video1.mp4',
    'videos/video2.mp4',
    'videos/video3.mp4',
    'videos/video4.mp4',
    'videos/video5.mp4',
    'videos/video6.mp4'
  ];
  let currentVideoIdx = 0;
  const authVideoBg = document.getElementById('auth-video-bg');

  function initAuthVideoBackground() {
    if (!authVideoBg) return;

    const playNextVideo = (idx) => {
      currentVideoIdx = idx % authBgVideos.length;
      
      // Fade out video briefly before changing source for a smooth transition
      authVideoBg.style.opacity = '0';
      
      setTimeout(() => {
        authVideoBg.src = authBgVideos[currentVideoIdx];
        authVideoBg.load();
        
        // When loaded, fade back in
        authVideoBg.onloadeddata = () => {
          authVideoBg.style.opacity = '0.85';
        };

        authVideoBg.play().catch(err => {
          // Catch autoplay policy restrictions
          console.log("Autoplay background video info:", err.message);
        });
      }, 500);
    };

    // Transition on end
    authVideoBg.addEventListener('ended', () => {
      playNextVideo(currentVideoIdx + 1);
    });

    // Handle load failures gracefully (e.g. before user uploads the files)
    authVideoBg.addEventListener('error', () => {
      console.warn(`Auth Background Video "${authBgVideos[currentVideoIdx]}" not found. Retrying next video in 3 seconds...`);
      setTimeout(() => {
        playNextVideo(currentVideoIdx + 1);
      }, 3000);
    });

    // Start playback
    playNextVideo(0);
  }

  // Initialize background video
  initAuthVideoBackground();

  const authTabLogin = document.getElementById('auth-tab-login');
  const authTabSignup = document.getElementById('auth-tab-signup');
  const signupFullnameGroup = document.getElementById('signup-fullname-group');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const authForm = document.getElementById('auth-form');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordInput = document.getElementById('auth-password');
  const authFullnameInput = document.getElementById('auth-fullname');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const btnSkipAuth = document.getElementById('btn-skip-auth');
  
  let isSignupMode = false;

  authTabLogin.addEventListener('click', () => {
    isSignupMode = false;
    authTabLogin.classList.add('active');
    authTabSignup.classList.remove('active');
    signupFullnameGroup.classList.add('hidden');
    btnAuthSubmit.innerText = 'Log In';
    document.getElementById('auth-subtitle').innerText = 'Log in to access your resume builder.';
  });

  authTabSignup.addEventListener('click', () => {
    isSignupMode = true;
    authTabSignup.classList.add('active');
    authTabLogin.classList.remove('active');
    signupFullnameGroup.classList.remove('hidden');
    btnAuthSubmit.innerText = 'Sign Up';
    document.getElementById('auth-subtitle').innerText = 'Create a free account to persist your designs.';
  });

  btnTogglePassword.addEventListener('click', () => {
    const isPassword = authPasswordInput.type === 'password';
    authPasswordInput.type = isPassword ? 'text' : 'password';
    btnTogglePassword.querySelector('svg').style.color = isPassword ? 'var(--color-primary)' : 'var(--text-muted)';
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (isSignupMode) {
      const fullname = authFullnameInput.value.trim();
      if (!fullname || !email || !password) {
        showToast('Please fill out all fields.', 'danger');
        return;
      }
      
      const user = { fullname, email, password };
      localStorage.setItem(`user_${email}`, JSON.stringify(user));
      
      // Auto fill state details
      state.resume.fullname = fullname;
      const spaceIdx = fullname.indexOf(' ');
      state.resume.firstname = spaceIdx !== -1 ? fullname.substring(0, spaceIdx) : fullname;
      state.resume.lastname = spaceIdx !== -1 ? fullname.substring(spaceIdx + 1) : '';
      state.resume.email = email;
      
      // Sync to wizard inputs
      document.getElementById('wiz-firstname').value = state.resume.firstname;
      document.getElementById('wiz-lastname').value = state.resume.lastname;
      document.getElementById('wiz-email').value = state.resume.email;

      showToast('Account created successfully!', 'success');
      navigateToView('wizard');
    } else {
      if (!email || !password) {
        showToast('Please enter email and password.', 'danger');
        return;
      }

      // Check default mock user first
      if (email === 'kumkumkushwaha7080@gmail.com' && password === 'password123') {
        state.resume.fullname = 'Kumkum Kushwaha';
        state.resume.firstname = 'Kumkum';
        state.resume.lastname = 'Kushwaha';
        state.resume.email = email;
        
        document.getElementById('wiz-firstname').value = 'Kumkum';
        document.getElementById('wiz-lastname').value = 'Kushwaha';
        document.getElementById('wiz-email').value = email;

        showToast('Welcome back, Kumkum!', 'success');
        navigateToView('wizard');
        return;
      }

      // Check localStorage
      const savedUserStr = localStorage.getItem(`user_${email}`);
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser.password === password) {
          state.resume.fullname = savedUser.fullname;
          const spaceIdx = savedUser.fullname.indexOf(' ');
          state.resume.firstname = spaceIdx !== -1 ? savedUser.fullname.substring(0, spaceIdx) : savedUser.fullname;
          state.resume.lastname = spaceIdx !== -1 ? savedUser.fullname.substring(spaceIdx + 1) : '';
          state.resume.email = email;

          document.getElementById('wiz-firstname').value = state.resume.firstname;
          document.getElementById('wiz-lastname').value = state.resume.lastname;
          document.getElementById('wiz-email').value = email;

          showToast(`Welcome back, ${state.resume.firstname}!`, 'success');
          navigateToView('wizard');
          return;
        }
      }

      showToast('Invalid credentials. Hint: Sign up first!', 'danger');
    }
  });

  btnSkipAuth.addEventListener('click', () => {
    showToast('Logged in as Guest.', 'info');
    navigateToView('wizard');
  });

  /* ==========================================================================
     LAYOUT SELECTOR & PRESENTS GRID GENERATOR
     ========================================================================== */
  const templatesGrid = document.getElementById('templates-grid');

  function renderTemplatesGrid() {
    if (!templatesGrid) return;
    templatesGrid.innerHTML = '';
    
    templatePresets.forEach(preset => {
      const card = document.createElement('div');
      card.className = `template-card theme-${preset.theme} header-${preset.header} ${state.selectedTemplate === preset.id ? 'active' : ''}`;
      card.setAttribute('data-id', preset.id);
      
      const headerHTML = `
        <div class="mini-header header-${preset.header}">
          <h5 class="mini-name">Kumkum Kushwaha</h5>
          <span class="mini-title">Frontend Engineer</span>
          <div class="mini-contact-info">New Delhi, IN • kumkumkushwaha7080@gmail.com</div>
        </div>
      `;

      const summaryHTML = `
        <div class="mini-section">
          <h6 class="mini-section-title">Summary</h6>
          <div class="mini-text-block">
            <div class="mini-text-line"></div>
            <div class="mini-text-line w-80"></div>
          </div>
        </div>
      `;

      const experienceHTML = `
        <div class="mini-section">
          <h6 class="mini-section-title">Experience</h6>
          <div class="mini-item">
            <div class="mini-item-header">
              <div class="mini-text-line w-60" style="background:#475569; height:4px;"></div>
              <div class="mini-text-line w-30" style="background:#94a3b8;"></div>
            </div>
            <div class="mini-text-block">
              <div class="mini-text-line"></div>
              <div class="mini-text-line w-80"></div>
            </div>
          </div>
        </div>
      `;

      const projectsHTML = `
        <div class="mini-section">
          <h6 class="mini-section-title">Projects</h6>
          <div class="mini-item">
            <div class="mini-text-line w-40" style="background:#475569; height:4px;"></div>
            <div class="mini-text-line w-80"></div>
          </div>
        </div>
      `;

      const educationHTML = `
        <div class="mini-section">
          <h6 class="mini-section-title">Education</h6>
          <div class="mini-item">
            <div class="mini-text-line w-60"></div>
            <div class="mini-text-line w-40"></div>
          </div>
        </div>
      `;

      const skillsHTML = `
        <div class="mini-section">
          <h6 class="mini-section-title">Skills</h6>
          <div class="mini-tag-container">
            <span class="mini-tag">React</span>
            <span class="mini-tag">Node</span>
            <span class="mini-tag">CSS</span>
            <span class="mini-tag">Git</span>
          </div>
        </div>
      `;

      let thumbBody = '';
      if (preset.layout === 'classic') {
        thumbBody = `
          <div class="mini-resume-sheet font-${preset.font} theme-${preset.theme}">
            ${headerHTML}
            <div class="mini-layout-classic">
              ${summaryHTML}
              ${experienceHTML}
              ${skillsHTML}
            </div>
          </div>
        `;
      } else if (preset.layout === 'timeline') {
        thumbBody = `
          <div class="mini-resume-sheet font-${preset.font} theme-${preset.theme}">
            ${headerHTML}
            <div class="mini-layout-timeline">
              <div class="mini-timeline-container">
                <div class="mini-timeline-node" style="top: 5px;"></div>
                ${summaryHTML}
                <div class="mini-timeline-node" style="top: 45px;"></div>
                ${experienceHTML}
                <div class="mini-timeline-node" style="top: 110px;"></div>
                ${skillsHTML}
              </div>
            </div>
          </div>
        `;
      } else {
        const isLeft = preset.layout === 'split-left';
        
        const sidebarHTML = `
          <div class="mini-sidebar" style="background: var(--theme-light-bg);">
            ${educationHTML}
            ${skillsHTML}
          </div>
        `;
        
        const mainHTML = `
          <div class="mini-main">
            ${summaryHTML}
            ${experienceHTML}
            ${projectsHTML}
          </div>
        `;

        thumbBody = `
          <div class="mini-resume-sheet font-${preset.font} theme-${preset.theme}">
            ${headerHTML}
            <div class="mini-layout-split-${isLeft ? 'left' : 'right'}">
              ${isLeft ? sidebarHTML + mainHTML : mainHTML + sidebarHTML}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <span class="template-badge">${preset.category}</span>
        <div class="template-thumb">
          <div class="mini-resume-wrapper">
            ${thumbBody}
          </div>
        </div>
        <div class="template-info">
          <h4>${preset.name}</h4>
          <p>${preset.desc}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectTemplate(preset.id);
      });

      templatesGrid.appendChild(card);
    });
  }

  function selectTemplate(templateId) {
    state.selectedTemplate = templateId;
    
    const templateSelect = document.getElementById('template-select');
    if (templateSelect) {
      templateSelect.value = templateId;
    }
    
    updateResumePreview();
    runAtsAnalysis();
    
    navigateToView('workspace');
    showToast(`Applied template: ${templatePresets.find(t => t.id === templateId).name}`, 'success');
  }

  const btnSelectorBack = document.getElementById('btn-selector-back');
  if (btnSelectorBack) {
    btnSelectorBack.addEventListener('click', () => {
      state.currentStep = 5;
      updateWizardPanelDisplay();
      navigateToView('wizard');
    });
  }

  const btnChangeLayoutSelector = document.getElementById('btn-change-layout-selector');
  if (btnChangeLayoutSelector) {
    btnChangeLayoutSelector.addEventListener('click', () => {
      renderTemplatesGrid();
      navigateToView('selector');
    });
  }

  const templateSelect = document.getElementById('template-select');
  
  function populateTemplateSelect() {
    if (!templateSelect) return;
    templateSelect.innerHTML = '';
    templatePresets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.innerText = `[${preset.category}] ${preset.name}`;
      templateSelect.appendChild(option);
    });
  }

  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      state.selectedTemplate = e.target.value;
      updateResumePreview();
      runAtsAnalysis();
    });
  }

  /* ==========================================================================
     TOAST ALERTS SYSTEM
     ========================================================================== */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    if (type === 'success') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'danger') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    }
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    
    toastWrapper.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ==========================================================================
     ACCORDION PANEL COLLAPSE LOGIC
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isExpanded = item.classList.contains('expanded');
      accordionItems.forEach(acc => acc.classList.remove('expanded'));
      if (!isExpanded) {
        item.classList.add('expanded');
      }
    });
  });

  /* ==========================================================================
     TABS VIEW ROUTING
     ========================================================================== */
  tabBtnBuilder.addEventListener('click', () => {
    tabBtnBuilder.classList.add('active');
    tabBtnAts.classList.remove('active');
    panelBuilder.classList.add('active');
    panelAts.classList.remove('active');
  });

  tabBtnAts.addEventListener('click', () => {
    tabBtnAts.classList.add('active');
    tabBtnBuilder.classList.remove('active');
    panelAts.classList.add('active');
    panelBuilder.classList.remove('active');
    runAtsAnalysis();
  });

  /* ==========================================================================
     STEPPER WIZARD ROUTING & VALIDATIONS
     ========================================================================== */
  const stepNodes = document.querySelectorAll('.step-node');
  const stepPanels = document.querySelectorAll('.wizard-step-panel');

  btnWizardNext.addEventListener('click', () => {
    if (!validateCurrentStep()) return;

    if (state.currentStep < 5) {
      const currentNode = document.querySelector(`.step-node[data-step="${state.currentStep}"]`);
      currentNode.classList.remove('active');
      currentNode.classList.add('completed');

      state.currentStep++;

      const nextNode = document.querySelector(`.step-node[data-step="${state.currentStep}"]`);
      nextNode.classList.add('active');

      updateWizardPanelDisplay();
    } else {
      // Wizard complete
      compileOnboardingWizardData();
    }
  });

  btnWizardBack.addEventListener('click', () => {
    if (state.currentStep > 1) {
      const currentNode = document.querySelector(`.step-node[data-step="${state.currentStep}"]`);
      currentNode.classList.remove('active');

      state.currentStep--;

      const prevNode = document.querySelector(`.step-node[data-step="${state.currentStep}"]`);
      prevNode.classList.remove('completed');
      prevNode.classList.add('active');

      updateWizardPanelDisplay();
    }
  });

  function validateCurrentStep() {
    if (state.currentStep === 1) {
      const fn = document.getElementById('wiz-firstname').value.trim();
      const ln = document.getElementById('wiz-lastname').value.trim();
      const email = document.getElementById('wiz-email').value.trim();
      const phone = document.getElementById('wiz-phone').value.trim();

      if (!fn || !ln || !email || !phone) {
        showToast('Please fill out all required fields marked with *', 'danger');
        return false;
      }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'danger');
        return false;
      }
    }
    return true;
  }

  function updateWizardPanelDisplay() {
    btnWizardBack.disabled = state.currentStep === 1;
    btnWizardNext.innerText = state.currentStep === 5 ? 'Compile Profile & Resume' : 'Next';

    stepPanels.forEach(p => p.classList.remove('active'));
    document.getElementById(`wizard-step-${state.currentStep}`).classList.add('active');
  }

  // Compile Wizard arrays to state
  function compileOnboardingWizardData() {
    state.resume.firstname = document.getElementById('wiz-firstname').value.trim();
    state.resume.lastname = document.getElementById('wiz-lastname').value.trim();
    state.resume.fullname = `${state.resume.firstname} ${state.resume.lastname}`;
    state.resume.jobtitle = document.getElementById('wiz-jobtitle').value.trim();
    state.resume.email = document.getElementById('wiz-email').value.trim();
    state.resume.phone = document.getElementById('wiz-phone').value.trim();
    state.resume.location = document.getElementById('wiz-location').value.trim();
    state.resume.gender = document.getElementById('wiz-gender').value;

    state.resume.skills = document.getElementById('wiz-skills').value.trim();
    state.resume.linkedin = document.getElementById('wiz-linkedin').value.trim();
    state.resume.github = document.getElementById('wiz-github').value.trim();
    state.resume.portfolio = document.getElementById('wiz-portfolio').value.trim();

    state.resume.summary = `Meticulous and dedicated ${state.resume.jobtitle || 'Professional'} with hands-on training in web design technologies. Experienced in building application assets, implementing responsive user layouts, and collaborating on sprint architectures. Seeking opportunities to apply technical skills in a challenging environment.`;

    // Sync wizard collected arrays directly to main editors forms
    syncStateToFormInputs();

    // Route wizard completion to template layout gallery selector
    renderTemplatesGrid();
    navigateToView('selector');

    updateResumePreview();
    runAtsAnalysis();

    showToast('Internshala Profile compiled successfully!', 'success');
  }

  // Populate Editor Inputs
  function syncStateToFormInputs() {
    document.getElementById('input-fullname').value = state.resume.fullname;
    document.getElementById('input-jobtitle').value = state.resume.jobtitle;
    document.getElementById('input-email').value = state.resume.email;
    document.getElementById('input-phone').value = state.resume.phone;
    document.getElementById('input-location').value = state.resume.location;
    document.getElementById('input-linkedin').value = state.resume.linkedin;
    document.getElementById('input-github').value = state.resume.github;
    document.getElementById('input-portfolio').value = state.resume.portfolio;
    document.getElementById('input-summary').value = state.resume.summary;
    document.getElementById('input-skills').value = state.resume.skills;

    // Experience Cards
    editorExperienceList.innerHTML = '';
    state.resume.experience.forEach(item => renderExperienceEditorItem(item));

    // POR Cards
    editorResponsibilityList.innerHTML = '';
    state.resume.responsibility.forEach(item => renderResponsibilityEditorItem(item));

    // Projects Cards
    editorProjectsList.innerHTML = '';
    state.resume.projects.forEach(item => renderProjectEditorItem(item));

    // Education Cards
    editorEducationList.innerHTML = '';
    state.resume.education.forEach(item => renderEducationEditorItem(item));

    // Certifications Cards
    editorCertificationsList.innerHTML = '';
    state.resume.certifications.forEach(item => renderCertificationEditorItem(item));
    
    // Profile Photo UI Sync
    syncPhotoUI();
  }

  /* ==========================================================================
     DYNAMIC WIZARD & EDITOR CARD BUILDERS
     ========================================================================== */
  
  // -- SECTION 1: EDUCATION --
  const wizEducationList = document.getElementById('wiz-education-list');
  const wizBtnAddEducation = document.getElementById('wiz-btn-add-education');
  const editorEducationList = document.getElementById('editor-education-list');
  const editorBtnAddEducation = document.getElementById('editor-btn-add-education');

  function createEducationCardHTML(item) {
    return `
      <div class="card-item-header">
        <h5>Education Record</h5>
        <button class="btn-remove-item" title="Delete Entry">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Qualification / Degree Name</label>
          <input type="text" class="input-degree" value="${item.degree}" placeholder="e.g. B.Tech (Computer Science) or Class XII">
        </div>
        <div class="form-group">
          <label>School / College Name</label>
          <input type="text" class="input-school" value="${item.school}" placeholder="e.g. Technical University Delhi">
        </div>
        <div class="form-group">
          <label>Year of Completion / Dates</label>
          <input type="text" class="input-years" value="${item.years}" placeholder="e.g. 2020 - 2024">
        </div>
        <div class="form-group">
          <label>Performance Score (CGPA / %)</label>
          <input type="text" class="input-score" value="${item.score}" placeholder="e.g. 8.5 CGPA or 94%">
        </div>
      </div>
    `;
  }

  // Wizard Edu builder
  function renderEducationWizardItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createEducationCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.education = state.resume.education.filter(e => e.id !== item.id);
      card.remove();
    });

    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.degree = card.querySelector('.input-degree').value;
        item.school = card.querySelector('.input-school').value;
        item.years = card.querySelector('.input-years').value;
        item.score = card.querySelector('.input-score').value;
      });
    });
    wizEducationList.appendChild(card);
  }

  // Editor Edu builder
  function renderEducationEditorItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createEducationCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.education = state.resume.education.filter(e => e.id !== item.id);
      card.remove();
      updateResumePreview();
      runAtsAnalysis();
    });

    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.degree = card.querySelector('.input-degree').value;
        item.school = card.querySelector('.input-school').value;
        item.years = card.querySelector('.input-years').value;
        item.score = card.querySelector('.input-score').value;
        updateResumePreview();
        runAtsAnalysis();
      });
    });
    editorEducationList.appendChild(card);
  }

  wizBtnAddEducation.addEventListener('click', () => {
    const id = `edu-${Date.now()}`;
    const newItem = { id, degree: '', school: '', years: '', score: '' };
    state.resume.education.push(newItem);
    renderEducationWizardItem(newItem);
  });

  editorBtnAddEducation.addEventListener('click', () => {
    const id = `edu-${Date.now()}`;
    const newItem = { id, degree: '', school: '', years: '', score: '' };
    state.resume.education.push(newItem);
    renderEducationEditorItem(newItem);
    updateResumePreview();
  });

  // -- SECTION 2: EXPERIENCE (JOBS & INTERNSHIPS) --
  const wizExperienceList = document.getElementById('wiz-experience-list');
  const wizBtnAddExperience = document.getElementById('wiz-btn-add-experience');
  const editorExperienceList = document.getElementById('editor-experience-list');
  const editorBtnAddExperience = document.getElementById('editor-btn-add-experience');

  function createExperienceCardHTML(item) {
    return `
      <div class="card-item-header">
        <h5>Work Experience / Internship</h5>
        <button class="btn-remove-item" title="Delete Entry">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Job Title / Designation</label>
          <input type="text" class="input-role" value="${item.role}" placeholder="e.g. React Developer Intern">
        </div>
        <div class="form-group">
          <label>Organization / Company Name</label>
          <input type="text" class="input-company" value="${item.company}" placeholder="e.g. Pixel Labs">
        </div>
        <div class="form-group">
          <label>Date Range / Duration</label>
          <input type="text" class="input-dates" value="${item.dates}" placeholder="e.g. Jun 2024 - Aug 2024">
        </div>
        <div class="form-group">
          <label>Job Description / Responsibilities</label>
          <textarea class="input-desc" rows="3" placeholder="Describe key tasks...">${item.desc}</textarea>
        </div>
      </div>
    `;
  }

  function renderExperienceWizardItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createExperienceCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.experience = state.resume.experience.filter(e => e.id !== item.id);
      card.remove();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.role = card.querySelector('.input-role').value;
        item.company = card.querySelector('.input-company').value;
        item.dates = card.querySelector('.input-dates').value;
        item.desc = card.querySelector('.input-desc').value;
      });
    });
    wizExperienceList.appendChild(card);
  }

  function renderExperienceEditorItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createExperienceCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.experience = state.resume.experience.filter(e => e.id !== item.id);
      card.remove();
      updateResumePreview();
      runAtsAnalysis();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.role = card.querySelector('.input-role').value;
        item.company = card.querySelector('.input-company').value;
        item.dates = card.querySelector('.input-dates').value;
        item.desc = card.querySelector('.input-desc').value;
        updateResumePreview();
        runAtsAnalysis();
      });
    });
    editorExperienceList.appendChild(card);
  }

  wizBtnAddExperience.addEventListener('click', () => {
    const id = `exp-${Date.now()}`;
    const newItem = { id, role: '', company: '', dates: '', desc: '' };
    state.resume.experience.push(newItem);
    renderExperienceWizardItem(newItem);
  });

  editorBtnAddExperience.addEventListener('click', () => {
    const id = `exp-${Date.now()}`;
    const newItem = { id, role: '', company: '', dates: '', desc: '' };
    state.resume.experience.push(newItem);
    renderExperienceEditorItem(newItem);
    updateResumePreview();
  });

  // -- SECTION 3: POSITIONS OF RESPONSIBILITY (POR) --
  const wizResponsibilityList = document.getElementById('wiz-responsibility-list');
  const wizBtnAddResponsibility = document.getElementById('wiz-btn-add-responsibility');
  const editorResponsibilityList = document.getElementById('editor-responsibility-list');
  const editorBtnAddResponsibility = document.getElementById('editor-btn-add-responsibility');

  function createResponsibilityCardHTML(item) {
    return `
      <div class="card-item-header">
        <h5>Position of Responsibility</h5>
        <button class="btn-remove-item" title="Delete Entry">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Leadership Role / Title</label>
          <input type="text" class="input-role" value="${item.role}" placeholder="e.g. Coordinator or Event Lead">
        </div>
        <div class="form-group">
          <label>Organization / Club Name</label>
          <input type="text" class="input-org" value="${item.organization}" placeholder="e.g. Coding Club TUD">
        </div>
        <div class="form-group">
          <label>Dates / Duration</label>
          <input type="text" class="input-dates" value="${item.dates}" placeholder="e.g. 2022 - 2023">
        </div>
        <div class="form-group">
          <label>Description of Contributions</label>
          <textarea class="input-desc" rows="3" placeholder="Describe what you managed...">${item.desc}</textarea>
        </div>
      </div>
    `;
  }

  function renderResponsibilityWizardItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createResponsibilityCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.responsibility = state.resume.responsibility.filter(r => r.id !== item.id);
      card.remove();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.role = card.querySelector('.input-role').value;
        item.organization = card.querySelector('.input-org').value;
        item.dates = card.querySelector('.input-dates').value;
        item.desc = card.querySelector('.input-desc').value;
      });
    });
    wizResponsibilityList.appendChild(card);
  }

  function renderResponsibilityEditorItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createResponsibilityCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.responsibility = state.resume.responsibility.filter(r => r.id !== item.id);
      card.remove();
      updateResumePreview();
      runAtsAnalysis();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.role = card.querySelector('.input-role').value;
        item.organization = card.querySelector('.input-org').value;
        item.dates = card.querySelector('.input-dates').value;
        item.desc = card.querySelector('.input-desc').value;
        updateResumePreview();
        runAtsAnalysis();
      });
    });
    editorResponsibilityList.appendChild(card);
  }

  wizBtnAddResponsibility.addEventListener('click', () => {
    const id = `por-${Date.now()}`;
    const newItem = { id, role: '', organization: '', dates: '', desc: '' };
    state.resume.responsibility.push(newItem);
    renderResponsibilityWizardItem(newItem);
  });

  editorBtnAddResponsibility.addEventListener('click', () => {
    const id = `por-${Date.now()}`;
    const newItem = { id, role: '', organization: '', dates: '', desc: '' };
    state.resume.responsibility.push(newItem);
    renderResponsibilityEditorItem(newItem);
    updateResumePreview();
  });

  // -- SECTION 4: PROJECTS --
  const wizProjectsList = document.getElementById('wiz-projects-list');
  const wizBtnAddProject = document.getElementById('wiz-btn-add-project');
  const editorProjectsList = document.getElementById('editor-projects-list');
  const editorBtnAddProject = document.getElementById('editor-btn-add-project');

  function createProjectCardHTML(item) {
    return `
      <div class="card-item-header">
        <h5>Project Detail</h5>
        <button class="btn-remove-item" title="Delete Entry">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="input-name" value="${item.name}" placeholder="e.g. Spectra Design Portal">
        </div>
        <div class="form-group">
          <label>Technologies Used</label>
          <input type="text" class="input-tech" value="${item.tech}" placeholder="e.g. React, CSS3">
        </div>
        <div class="form-group">
          <label>Project Description</label>
          <textarea class="input-desc" rows="3" placeholder="Describe the outcome...">${item.desc}</textarea>
        </div>
      </div>
    `;
  }

  function renderProjectWizardItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createProjectCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.projects = state.resume.projects.filter(p => p.id !== item.id);
      card.remove();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.name = card.querySelector('.input-name').value;
        item.tech = card.querySelector('.input-tech').value;
        item.desc = card.querySelector('.input-desc').value;
      });
    });
    wizProjectsList.appendChild(card);
  }

  function renderProjectEditorItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createProjectCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.projects = state.resume.projects.filter(p => p.id !== item.id);
      card.remove();
      updateResumePreview();
      runAtsAnalysis();
    });

    const inputs = card.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.name = card.querySelector('.input-name').value;
        item.tech = card.querySelector('.input-tech').value;
        item.desc = card.querySelector('.input-desc').value;
        updateResumePreview();
        runAtsAnalysis();
      });
    });
    editorProjectsList.appendChild(card);
  }

  wizBtnAddProject.addEventListener('click', () => {
    const id = `proj-${Date.now()}`;
    const newItem = { id, name: '', tech: '', desc: '' };
    state.resume.projects.push(newItem);
    renderProjectWizardItem(newItem);
  });

  editorBtnAddProject.addEventListener('click', () => {
    const id = `proj-${Date.now()}`;
    const newItem = { id, name: '', tech: '', desc: '' };
    state.resume.projects.push(newItem);
    renderProjectEditorItem(newItem);
    updateResumePreview();
  });

  // -- SECTION 5: CERTIFICATIONS --
  const wizCertificationsList = document.getElementById('wiz-certifications-list');
  const wizBtnAddCertification = document.getElementById('wiz-btn-add-certification');
  const editorCertificationsList = document.getElementById('editor-certifications-list');
  const editorBtnAddCertification = document.getElementById('editor-btn-add-certification');

  function createCertificationCardHTML(item) {
    return `
      <div class="card-item-header">
        <h5>Certification</h5>
        <button class="btn-remove-item" title="Delete Entry">&times;</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Certification Title</label>
          <input type="text" class="input-name" value="${item.name}" placeholder="e.g. React Certified Developer">
        </div>
        <div class="form-group">
          <label>Issuing Organization</label>
          <input type="text" class="input-org" value="${item.organization}" placeholder="e.g. Coursera / Google">
        </div>
        <div class="form-group">
          <label>Date / Year</label>
          <input type="text" class="input-dates" value="${item.dates}" placeholder="e.g. 2024">
        </div>
      </div>
    `;
  }

  function renderCertificationWizardItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createCertificationCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.certifications = state.resume.certifications.filter(c => c.id !== item.id);
      card.remove();
    });

    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.name = card.querySelector('.input-name').value;
        item.organization = card.querySelector('.input-org').value;
        item.dates = card.querySelector('.input-dates').value;
      });
    });
    wizCertificationsList.appendChild(card);
  }

  function renderCertificationEditorItem(item) {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = createCertificationCardHTML(item);

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      state.resume.certifications = state.resume.certifications.filter(c => c.id !== item.id);
      card.remove();
      updateResumePreview();
      runAtsAnalysis();
    });

    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        item.name = card.querySelector('.input-name').value;
        item.organization = card.querySelector('.input-org').value;
        item.dates = card.querySelector('.input-dates').value;
        updateResumePreview();
        runAtsAnalysis();
      });
    });
    editorCertificationsList.appendChild(card);
  }

  wizBtnAddCertification.addEventListener('click', () => {
    const id = `cert-${Date.now()}`;
    const newItem = { id, name: '', organization: '', dates: '' };
    state.resume.certifications.push(newItem);
    renderCertificationWizardItem(newItem);
  });

  editorBtnAddCertification.addEventListener('click', () => {
    const id = `cert-${Date.now()}`;
    const newItem = { id, name: '', organization: '', dates: '' };
    state.resume.certifications.push(newItem);
    renderCertificationEditorItem(newItem);
    updateResumePreview();
  });

  /* ==========================================================================
     IN-EDITOR TEXT FIELDS SYNC INPUTS
     ========================================================================== */
  const inInputs = [
    { id: 'input-fullname', key: 'fullname' },
    { id: 'input-jobtitle', key: 'jobtitle' },
    { id: 'input-email', key: 'email' },
    { id: 'input-phone', key: 'phone' },
    { id: 'input-location', key: 'location' },
    { id: 'input-linkedin', key: 'linkedin' },
    { id: 'input-github', key: 'github' },
    { id: 'input-portfolio', key: 'portfolio' }
  ];

  inInputs.forEach(item => {
    const input = document.getElementById(item.id);
    input.addEventListener('input', () => {
      state.resume[item.key] = input.value;
      updateResumePreview();
      runAtsAnalysis();
    });
  });

  const inSummary = document.getElementById('input-summary');
  inSummary.addEventListener('input', () => {
    state.resume.summary = inSummary.value;
    updateResumePreview();
    runAtsAnalysis();
  });

  const inSkills = document.getElementById('input-skills');
  inSkills.addEventListener('input', () => {
    state.resume.skills = inSkills.value;
    updateResumePreview();
    runAtsAnalysis();
  });

  /* ==========================================================================
     PROFILE PHOTO UPLOAD MANAGEMENT
     ========================================================================== */
  const wizPhotoInput = document.getElementById('wiz-photo');
  const wizPhotoTrigger = document.getElementById('wiz-btn-upload-photo-trigger');
  const wizPhotoRemove = document.getElementById('wiz-btn-remove-photo');
  const wizPhotoPreviewContainer = document.getElementById('wiz-photo-preview-container');
  const wizPhotoPreviewImg = document.getElementById('wiz-photo-preview-img');

  const inPhotoInput = document.getElementById('input-photo');
  const inPhotoTrigger = document.getElementById('btn-upload-photo-trigger');
  const inPhotoRemove = document.getElementById('btn-remove-photo');
  const inPhotoPreviewContainer = document.getElementById('input-photo-preview-container');
  const inPhotoPreviewImg = document.getElementById('input-photo-preview-img');

  function syncPhotoUI() {
    const photoData = state.resume.photo;
    if (photoData) {
      // Update Wizard Photo UI
      if (wizPhotoPreviewImg) wizPhotoPreviewImg.src = photoData;
      if (wizPhotoPreviewContainer) wizPhotoPreviewContainer.classList.remove('hidden');
      if (wizPhotoRemove) wizPhotoRemove.classList.remove('hidden');
      if (wizPhotoTrigger) {
        const span = wizPhotoTrigger.querySelector('span');
        if (span) span.innerText = 'Change Photo';
      }

      // Update Editor Photo UI
      if (inPhotoPreviewImg) inPhotoPreviewImg.src = photoData;
      if (inPhotoPreviewContainer) inPhotoPreviewContainer.classList.remove('hidden');
      if (inPhotoRemove) inPhotoRemove.classList.remove('hidden');
      if (inPhotoTrigger) {
        const span = inPhotoTrigger.querySelector('span');
        if (span) span.innerText = 'Change Photo';
      }
    } else {
      // Clear Wizard Photo UI
      if (wizPhotoPreviewImg) wizPhotoPreviewImg.src = '';
      if (wizPhotoPreviewContainer) wizPhotoPreviewContainer.classList.add('hidden');
      if (wizPhotoRemove) wizPhotoRemove.classList.add('hidden');
      if (wizPhotoTrigger) {
        const span = wizPhotoTrigger.querySelector('span');
        if (span) span.innerText = 'Upload Photo';
      }

      // Clear Editor Photo UI
      if (inPhotoPreviewImg) inPhotoPreviewImg.src = '';
      if (inPhotoPreviewContainer) inPhotoPreviewContainer.classList.add('hidden');
      if (inPhotoRemove) inPhotoRemove.classList.add('hidden');
      if (inPhotoTrigger) {
        const span = inPhotoTrigger.querySelector('span');
        if (span) span.innerText = 'Upload Photo';
      }
      
      // Reset inputs
      if (wizPhotoInput) wizPhotoInput.value = '';
      if (inPhotoInput) inPhotoInput.value = '';
    }
  }

  function handlePhotoUpload(file) {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('Photo size should be less than 1.5MB for smooth loading.', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      state.resume.photo = e.target.result;
      syncPhotoUI();
      updateResumePreview();
    };
    reader.readAsDataURL(file);
  }

  // Bind Wizard Photo listeners
  if (wizPhotoTrigger && wizPhotoInput) {
    wizPhotoTrigger.addEventListener('click', () => wizPhotoInput.click());
    wizPhotoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handlePhotoUpload(e.target.files[0]);
      }
    });
  }
  if (wizPhotoRemove) {
    wizPhotoRemove.addEventListener('click', () => {
      state.resume.photo = '';
      syncPhotoUI();
      updateResumePreview();
    });
  }

  // Bind Editor Photo listeners
  if (inPhotoTrigger && inPhotoInput) {
    inPhotoTrigger.addEventListener('click', () => inPhotoInput.click());
    inPhotoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handlePhotoUpload(e.target.files[0]);
      }
    });
  }
  if (inPhotoRemove) {
    inPhotoRemove.addEventListener('click', () => {
      state.resume.photo = '';
      syncPhotoUI();
      updateResumePreview();
    });
  }

  function updateSkillsPreview() {
    resSkillsDisplay.innerHTML = '';
    const skillsList = state.resume.skills.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
      
    if (skillsList.length === 0) {
      document.getElementById('resume-section-skills').style.display = 'none';
      return;
    }
    
    document.getElementById('resume-section-skills').style.display = 'flex';
    skillsList.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'resume-skill-tag';
      span.innerText = skill;
      resSkillsDisplay.appendChild(span);
    });
  }

  /* ==========================================================================
     A4 SHEET RENDER GENERATOR
     ========================================================================== */
  /* ==========================================================================
     A4 SHEET SHELL TEMPLATES & RENDER GENERATOR
     ========================================================================== */
  const a4Sheet = document.getElementById('resume-a4-sheet');

  function buildSingleColumnShell() {
    return `
      <!-- Header details -->
      <div class="resume-header">
        <div class="header-text-container">
          <h2 id="resume-name" class="resume-title">John Doe</h2>
          <h3 id="resume-title-label" class="resume-subtitle">Frontend Developer</h3>
          
          <div class="resume-contact-row">
            <span id="resume-email-tag">email@address.com</span>
            <span class="separator">&bull;</span>
            <span id="resume-phone-tag">+91 9999999999</span>
            <span class="separator">&bull;</span>
            <span id="resume-location-tag">Delhi, India</span>
          </div>
          
          <div class="resume-links-row">
            <span id="resume-linkedin-tag">linkedin.com/in/username</span>
            <span class="separator">&bull;</span>
            <span id="resume-github-tag">github.com/username</span>
            <span class="separator">&bull;</span>
            <span id="resume-portfolio-tag">portfolio.com</span>
          </div>
        </div>
        <div class="resume-photo-container hidden-photo" id="resume-photo-container">
          <img id="resume-photo-img" src="" alt="Profile Photo">
        </div>
      </div>

      <div class="resume-body">
        <!-- Summary section -->
        <div class="resume-section" id="resume-section-summary">
          <h4 class="section-title">Professional Summary</h4>
          <div class="section-divider"></div>
          <p id="resume-summary-text" class="section-content"></p>
        </div>

        <!-- Experience Section -->
        <div class="resume-section" id="resume-section-experience">
          <h4 class="section-title">Jobs & Internships</h4>
          <div class="section-divider"></div>
          <div class="experience-container" id="resume-experience-display"></div>
        </div>

        <!-- Leadership Roles Section -->
        <div class="resume-section" id="resume-section-responsibility">
          <h4 class="section-title">Positions of Responsibility</h4>
          <div class="section-divider"></div>
          <div class="experience-container" id="resume-responsibility-display"></div>
        </div>

        <!-- Projects Section -->
        <div class="resume-section" id="resume-section-projects">
          <h4 class="section-title">Projects</h4>
          <div class="section-divider"></div>
          <div class="projects-container" id="resume-projects-display"></div>
        </div>

        <!-- Education Section -->
        <div class="resume-section" id="resume-section-education">
          <h4 class="section-title">Education History</h4>
          <div class="section-divider"></div>
          <table class="education-table">
            <thead>
              <tr>
                <th>Education / Stream</th>
                <th>School / College</th>
                <th>Year</th>
                <th>CGPA / Performance</th>
              </tr>
            </thead>
            <tbody id="resume-education-table-body">
              <!-- Rows injected dynamically -->
            </tbody>
          </table>
        </div>

        <!-- Certifications Section -->
        <div class="resume-section" id="resume-section-certifications">
          <h4 class="section-title">Certifications</h4>
          <div class="section-divider"></div>
          <div class="experience-container" id="resume-cert-display"></div>
        </div>

        <!-- Skills Section -->
        <div class="resume-section" id="resume-section-skills">
          <h4 class="section-title">Skills</h4>
          <div class="section-divider"></div>
          <div class="skills-grid" id="resume-skills-display"></div>
        </div>
      </div>
    `;
  }

  function buildTwoColumnShell() {
    return `
      <!-- Header details -->
      <div class="resume-header">
        <h2 id="resume-name" class="resume-title">John Doe</h2>
        <h3 id="resume-title-label" class="resume-subtitle">Frontend Developer</h3>
      </div>

      <!-- Split Grid Body -->
      <div class="resume-split-body">
        <!-- Sidebar column: Contact, Links, Education, Skills, Certifications -->
        <div class="resume-sidebar-col">
          
          <div class="resume-photo-container sidebar-photo hidden-photo" id="resume-photo-container">
            <img id="resume-photo-img" src="" alt="Profile Photo">
          </div>
          
          <div class="sidebar-section contact-info-sidebar">
            <h4 class="section-title">Contact</h4>
            <div class="section-divider"></div>
            <div class="sidebar-contact-item" id="sidebar-email-item">
              <span class="label">Email:</span>
              <span id="resume-email-tag">email@address.com</span>
            </div>
            <div class="sidebar-contact-item" id="sidebar-phone-item">
              <span class="label">Phone:</span>
              <span id="resume-phone-tag">+91 9999999999</span>
            </div>
            <div class="sidebar-contact-item" id="sidebar-location-item">
              <span class="label">Location:</span>
              <span id="resume-location-tag">Delhi, India</span>
            </div>
          </div>

          <div class="sidebar-section contact-links-sidebar">
            <h4 class="section-title">Links</h4>
            <div class="section-divider"></div>
            <div class="sidebar-link-item" id="sidebar-linkedin-item">
              <span id="resume-linkedin-tag">linkedin.com/in/username</span>
            </div>
            <div class="sidebar-link-item" id="sidebar-github-item">
              <span id="resume-github-tag">github.com/username</span>
            </div>
            <div class="sidebar-link-item" id="sidebar-portfolio-item">
              <span id="resume-portfolio-tag">portfolio.com</span>
            </div>
          </div>

          <!-- Education History (Sidebar listing) -->
          <div class="sidebar-section" id="resume-section-education">
            <h4 class="section-title">Education</h4>
            <div class="section-divider"></div>
            <div class="education-sidebar-list" id="resume-education-sidebar-display"></div>
          </div>

          <!-- Skills Section -->
          <div class="sidebar-section" id="resume-section-skills">
            <h4 class="section-title">Skills</h4>
            <div class="section-divider"></div>
            <div class="skills-grid" id="resume-skills-display"></div>
          </div>

          <!-- Certifications Section -->
          <div class="sidebar-section" id="resume-section-certifications">
            <h4 class="section-title">Certifications</h4>
            <div class="section-divider"></div>
            <div class="experience-container" id="resume-cert-display"></div>
          </div>

        </div>

        <!-- Main column: Summary, Experience, POR, Projects -->
        <div class="resume-main-col">
          
          <!-- Summary section -->
          <div class="resume-section" id="resume-section-summary">
            <h4 class="section-title">Summary</h4>
            <div class="section-divider"></div>
            <p id="resume-summary-text" class="section-content"></p>
          </div>

          <!-- Experience Section -->
          <div class="resume-section" id="resume-section-experience">
            <h4 class="section-title">Experience</h4>
            <div class="section-divider"></div>
            <div class="experience-container" id="resume-experience-display"></div>
          </div>

          <!-- Leadership Roles Section -->
          <div class="resume-section" id="resume-section-responsibility">
            <h4 class="section-title">Positions of Responsibility</h4>
            <div class="section-divider"></div>
            <div class="experience-container" id="resume-responsibility-display"></div>
          </div>

          <!-- Projects Section -->
          <div class="resume-section" id="resume-section-projects">
            <h4 class="section-title">Projects</h4>
            <div class="section-divider"></div>
            <div class="projects-container" id="resume-projects-display"></div>
          </div>

        </div>
      </div>
    `;
  }

  function updateResumePreview() {
    const layoutPreset = templatePresets.find(t => t.id === state.selectedTemplate) || templatePresets[0];
    
    // 1. Assign configuration classes to preview sheet
    a4Sheet.className = `a4-sheet layout-${layoutPreset.layout} theme-${layoutPreset.theme} font-${layoutPreset.font} header-${layoutPreset.header} ${layoutPreset.id}`;
    
    // 2. Inject structural shell
    if (layoutPreset.layout === 'classic' || layoutPreset.layout === 'timeline') {
      a4Sheet.innerHTML = buildSingleColumnShell();
    } else {
      a4Sheet.innerHTML = buildTwoColumnShell();
    }

    // Update Photo preview inside A4 sheet
    const activePhotoImg = document.getElementById('resume-photo-img');
    const activePhotoContainer = document.getElementById('resume-photo-container');
    if (state.resume.photo) {
      if (activePhotoImg) activePhotoImg.src = state.resume.photo;
      if (activePhotoContainer) activePhotoContainer.classList.remove('hidden-photo');
    } else {
      if (activePhotoContainer) activePhotoContainer.classList.add('hidden-photo');
    }

    // 3. Locate active elements inside the fresh DOM shell
    const activeName = document.getElementById('resume-name');
    const activeTitle = document.getElementById('resume-title-label');
    const activeEmail = document.getElementById('resume-email-tag');
    const activePhone = document.getElementById('resume-phone-tag');
    const activeLocation = document.getElementById('resume-location-tag');
    const activeLinkedin = document.getElementById('resume-linkedin-tag');
    const activeGithub = document.getElementById('resume-github-tag');
    const activePortfolio = document.getElementById('resume-portfolio-tag');
    
    const activeSummary = document.getElementById('resume-summary-text');
    const activeExpDisplay = document.getElementById('resume-experience-display');
    const activeProjDisplay = document.getElementById('resume-projects-display');
    const activePorDisplay = document.getElementById('resume-responsibility-display');
    const activeCertDisplay = document.getElementById('resume-cert-display');
    const activeSkillsDisplay = document.getElementById('resume-skills-display');
    
    // Populate header metadata details
    if (activeName) activeName.innerText = state.resume.fullname || 'Kumkum Kushwaha';
    if (activeTitle) activeTitle.innerText = state.resume.jobtitle || 'Professional';
    if (activeEmail) activeEmail.innerText = state.resume.email || '';
    if (activePhone) activePhone.innerText = state.resume.phone || '';
    if (activeLocation) activeLocation.innerText = state.resume.location || '';
    if (activeLinkedin) activeLinkedin.innerText = state.resume.linkedin || '';
    if (activeGithub) activeGithub.innerText = state.resume.github || '';
    if (activePortfolio) activePortfolio.innerText = state.resume.portfolio || '';

    // Conditionally show/hide items depending on text content
    [
      { el: activeEmail, val: state.resume.email },
      { el: activePhone, val: state.resume.phone },
      { el: activeLocation, val: state.resume.location },
      { el: activeLinkedin, val: state.resume.linkedin },
      { el: activeGithub, val: state.resume.github },
      { el: activePortfolio, val: state.resume.portfolio }
    ].forEach(item => {
      if (item.el) {
        const isPresent = item.val && item.val.trim() !== '';
        item.el.style.display = isPresent ? 'inline' : 'none';
        
        // Hide separator bullet inside contact row if single-column layout
        const nextSep = item.el.nextElementSibling;
        if (nextSep && nextSep.classList.contains('separator')) {
          nextSep.style.display = isPresent ? 'inline' : 'none';
        }

        // Hide sidebar wraps if they exist (two-column layout)
        const parentContact = item.el.closest('.sidebar-contact-item');
        if (parentContact) parentContact.style.display = isPresent ? 'block' : 'none';
        
        const parentLink = item.el.closest('.sidebar-link-item');
        if (parentLink) parentLink.style.display = isPresent ? 'block' : 'none';
      }
    });

    // Populate summary pitch
    if (activeSummary) {
      activeSummary.innerText = state.resume.summary;
      const sect = document.getElementById('resume-section-summary');
      if (sect) sect.style.display = (!state.resume.summary || state.resume.summary.trim() === '') ? 'none' : 'flex';
    }

    // Render Work Experience list
    if (activeExpDisplay) {
      activeExpDisplay.innerHTML = '';
      const validExp = state.resume.experience.filter(e => e.role || e.company || e.desc);
      if (validExp.length === 0) {
        document.getElementById('resume-section-experience').style.display = 'none';
      } else {
        document.getElementById('resume-section-experience').style.display = 'flex';
        validExp.forEach(item => {
          const div = document.createElement('div');
          div.className = 'res-item-row';
          div.innerHTML = `
            <div class="res-item-header">
              <span>${item.role || 'Designation'}</span>
              <span>${item.dates || 'Duration'}</span>
            </div>
            <div class="res-item-subtitle">
              <span>${item.company || 'Company'}</span>
            </div>
            ${item.desc ? `<p class="res-item-desc">${item.desc}</p>` : ''}
          `;
          activeExpDisplay.appendChild(div);
        });
      }
    }

    // Render Positions of Responsibility (POR) list
    if (activePorDisplay) {
      activePorDisplay.innerHTML = '';
      const validPor = state.resume.responsibility.filter(r => r.role || r.organization || r.desc);
      if (validPor.length === 0) {
        document.getElementById('resume-section-responsibility').style.display = 'none';
      } else {
        document.getElementById('resume-section-responsibility').style.display = 'flex';
        validPor.forEach(item => {
          const div = document.createElement('div');
          div.className = 'res-item-row';
          div.innerHTML = `
            <div class="res-item-header">
              <span>${item.role || 'Leadership Role'}</span>
              <span>${item.dates || 'Duration'}</span>
            </div>
            <div class="res-item-subtitle">
              <span>${item.organization || 'Organization / Club'}</span>
            </div>
            ${item.desc ? `<p class="res-item-desc">${item.desc}</p>` : ''}
          `;
          activePorDisplay.appendChild(div);
        });
      }
    }

    // Render Projects list
    if (activeProjDisplay) {
      activeProjDisplay.innerHTML = '';
      const validProj = state.resume.projects.filter(p => p.name || p.tech || p.desc);
      if (validProj.length === 0) {
        document.getElementById('resume-section-projects').style.display = 'none';
      } else {
        document.getElementById('resume-section-projects').style.display = 'flex';
        validProj.forEach(item => {
          const div = document.createElement('div');
          div.className = 'res-item-row';
          div.innerHTML = `
            <div class="res-item-header">
              <span>${item.name || 'Project Title'}</span>
              <span>${item.tech || 'Tech Stack'}</span>
            </div>
            ${item.desc ? `<p class="res-item-desc">${item.desc}</p>` : ''}
          `;
          activeProjDisplay.appendChild(div);
        });
      }
    }

    // Render Certifications list
    if (activeCertDisplay) {
      activeCertDisplay.innerHTML = '';
      const validCert = state.resume.certifications.filter(c => c.name || c.organization);
      if (validCert.length === 0) {
        document.getElementById('resume-section-certifications').style.display = 'none';
      } else {
        document.getElementById('resume-section-certifications').style.display = 'flex';
        validCert.forEach(item => {
          const div = document.createElement('div');
          div.className = 'res-item-row';
          div.innerHTML = `
            <div class="res-item-header">
              <span>${item.name || 'Certification'}</span>
              <span>${item.dates || 'Year'}</span>
            </div>
            <div class="res-item-subtitle">
              <span>${item.organization || 'Issuing Academy'}</span>
            </div>
          `;
          activeCertDisplay.appendChild(div);
        });
      }
    }

    // Render Academic History (Table or Sidebar list depending on layout!)
    const activeEduTableBody = document.getElementById('resume-education-table-body');
    const activeEduSidebarDisplay = document.getElementById('resume-education-sidebar-display');
    const validEdu = state.resume.education.filter(e => e.degree || e.school);

    if (validEdu.length === 0) {
      document.getElementById('resume-section-education').style.display = 'none';
    } else {
      document.getElementById('resume-section-education').style.display = 'flex';
      
      // If table view (Classic & Timeline layout)
      if (activeEduTableBody) {
        activeEduTableBody.innerHTML = '';
        validEdu.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${item.degree || 'Qualification'}</strong></td>
            <td>${item.school || '-'}</td>
            <td>${item.years || '-'}</td>
            <td>${item.score || '-'}</td>
          `;
          activeEduTableBody.appendChild(tr);
        });
      }
      
      // If sidebar view (Two-Column layouts)
      if (activeEduSidebarDisplay) {
        activeEduSidebarDisplay.innerHTML = '';
        validEdu.forEach(item => {
          const div = document.createElement('div');
          div.className = 'edu-sidebar-item';
          div.innerHTML = `
            <span class="degree">${item.degree}</span>
            <span class="school">${item.school}</span>
            <span class="years-score">${item.years} | ${item.score}</span>
          `;
          activeEduSidebarDisplay.appendChild(div);
        });
      }
    }

    // Render Skills tags
    if (activeSkillsDisplay) {
      activeSkillsDisplay.innerHTML = '';
      const skillsList = state.resume.skills.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      if (skillsList.length === 0) {
        document.getElementById('resume-section-skills').style.display = 'none';
      } else {
        document.getElementById('resume-section-skills').style.display = 'flex';
        skillsList.forEach(skill => {
          const span = document.createElement('span');
          span.className = 'resume-skill-tag';
          span.innerText = skill;
          activeSkillsDisplay.appendChild(span);
        });
      }
    }
  }

  /* ==========================================================================
     ATS MATCH SCAN SYSTEM
     ========================================================================== */
  const jdTextInput = document.getElementById('jd-text-input');
  const btnPresets = document.querySelectorAll('.preset-chip');
  
  const atsGaugeProgress = document.getElementById('ats-gauge-progress');
  const atsScoreNum = document.getElementById('ats-score-num');
  
  const barValKeywords = document.getElementById('bar-val-keywords');
  const barValStructure = document.getElementById('bar-val-structure');
  const barValContact = document.getElementById('bar-val-contact');
  const barValStyle = document.getElementById('bar-val-style');

  const atsMissingHard = document.getElementById('ats-missing-hard');
  const atsBuzzwordsList = document.getElementById('ats-buzzwords-list');
  const atsContactsList = document.getElementById('ats-contacts-list');

  function tokenizeText(text) {
    const rawTokens = text.toLowerCase().match(/[a-zA-Z0-9+#]+/g) || [];
    return rawTokens.filter(t => t.length > 1);
  }

  function filterTokens(tokens) {
    return tokens.filter(t => !stopWords.has(t));
  }

  function extractJdKeywords(jdText) {
    const tokens = filterTokens(tokenizeText(jdText));
    const freqs = {};
    tokens.forEach(t => freqs[t] = (freqs[t] || 0) + 1);

    const sortedTerms = Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]);
    const hard = [];
    const soft = [];
    const maxKeywords = 15;

    sortedTerms.forEach(term => {
      if (hard.length + soft.length >= maxKeywords) return;
      if (hardSkillsList.has(term)) {
        if (!hard.includes(term)) hard.push(term);
      } else if (term.length > 3) {
        if (!soft.includes(term)) soft.push(term);
      }
    });

    return { hard, soft };
  }

  btnPresets.forEach(chip => {
    chip.addEventListener('click', () => {
      btnPresets.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const preset = chip.getAttribute('data-preset');
      if (jdPresets[preset]) {
        jdTextInput.value = jdPresets[preset];
        showToast(`Loaded ${chip.innerText} preset description.`, 'success');
        runAtsAnalysis();
      }
    });
  });

  jdTextInput.addEventListener('input', runAtsAnalysis);

  function runAtsAnalysis() {
    state.jdText = jdTextInput.value;
    
    // Compile resume text block
    let compiledResumeText = `
      ${state.resume.fullname} ${state.resume.jobtitle} ${state.resume.summary} ${state.resume.skills}
    `;
    state.resume.education.forEach(e => compiledResumeText += ` ${e.degree} ${e.school} ${e.score}`);
    state.resume.experience.forEach(e => compiledResumeText += ` ${e.role} ${e.company} ${e.desc}`);
    state.resume.responsibility.forEach(r => compiledResumeText += ` ${r.role} ${r.organization} ${r.desc}`);
    state.resume.projects.forEach(p => compiledResumeText += ` ${p.name} ${p.tech} ${p.desc}`);
    state.resume.certifications.forEach(c => compiledResumeText += ` ${c.name} ${c.organization}`);

    const resumeTokens = new Set(tokenizeText(compiledResumeText));

    // 1. Keywords Match
    state.jdKeywords = extractJdKeywords(state.jdText);
    const allJdKeywords = [...state.jdKeywords.hard, ...state.jdKeywords.soft];

    state.matchedKeywords = [];
    state.missingKeywords = [];

    allJdKeywords.forEach(kw => {
      if (resumeTokens.has(kw)) {
        state.matchedKeywords.push(kw);
      } else {
        state.missingKeywords.push(kw);
      }
    });

    state.scoreKeywords = allJdKeywords.length > 0 ? 
      Math.round((state.matchedKeywords.length / allJdKeywords.length) * 100) : 0;

    // 2. Structure check
    const checks = {
      summary: state.resume.summary.trim().length > 15,
      skills: state.resume.skills.trim().length > 5,
      education: state.resume.education.length > 0,
      experience: state.resume.experience.length > 0,
      responsibility: state.resume.responsibility.length > 0,
      projects: state.resume.projects.length > 0,
      certs: state.resume.certifications.length > 0
    };
    const values = Object.values(checks);
    const passed = values.filter(v => v).length;
    state.scoreStructure = Math.round((passed / values.length) * 100);

    // 3. Links check
    const emailValid = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(state.resume.email);
    const phoneValid = /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/.test(state.resume.phone);
    const linkedinValid = /linkedin\.com\/in\/[A-Za-z0-9_-]+/i.test(state.resume.linkedin);
    const githubValid = /github\.com\/[A-Za-z0-9_-]+/i.test(state.resume.github);
    const portfolioValid = state.resume.portfolio.trim().length > 4;

    const contactChecks = [emailValid, phoneValid, linkedinValid, githubValid, portfolioValid];
    const passedContact = contactChecks.filter(v => v).length;
    state.scoreContact = Math.round((passedContact / contactChecks.length) * 100);

    // 4. Style check weak verbs
    let buzzwordsCount = 0;
    const detectedBuzzwords = [];
    buzzwordRules.forEach(rule => {
      const regex = new RegExp(`\\b${rule.word}\\b`, 'gi');
      if (regex.test(compiledResumeText)) {
        buzzwordsCount++;
        detectedBuzzwords.push(rule);
      }
    });
    state.scoreStyle = Math.max(20, 100 - (buzzwordsCount * 12));

    // 5. Overall Weighted ATS Score
    state.scoreOverall = Math.round(
      (state.scoreKeywords * 0.40) +
      (state.scoreStructure * 0.25) +
      (state.scoreContact * 0.20) +
      (state.scoreStyle * 0.15)
    );

    // Update gauge Circle progress UI
    atsScoreNum.innerText = `${state.scoreOverall}%`;
    const offset = 314.15 - (state.scoreOverall / 100) * 314.15;
    atsGaugeProgress.style.strokeDashoffset = offset;

    if (state.scoreOverall >= 75) {
      atsGaugeProgress.style.stroke = 'var(--color-success)';
      atsScoreNum.style.color = 'var(--color-success)';
    } else if (state.scoreOverall >= 50) {
      atsGaugeProgress.style.stroke = 'var(--color-primary)';
      atsScoreNum.style.color = 'var(--color-primary)';
    } else {
      atsGaugeProgress.style.stroke = 'var(--color-danger)';
      atsScoreNum.style.color = 'var(--color-danger)';
    }

    // Update progress bars
    barValKeywords.style.width = `${state.scoreKeywords}%`;
    barValStructure.style.width = `${state.scoreStructure}%`;
    barValContact.style.width = `${state.scoreContact}%`;
    barValStyle.style.width = `${state.scoreStyle}%`;

    // Render lists alerts
    updateAtsChecklists(detectedBuzzwords, emailValid, phoneValid, linkedinValid, githubValid, portfolioValid);
  }

  function updateAtsChecklists(detectedBuzzwords, emailValid, phoneValid, linkedinValid, githubValid, portfolioValid) {
    // Missing keyword tags
    atsMissingHard.innerHTML = '';
    
    // Compile resume words
    let compiledResumeText = `${state.resume.summary} ${state.resume.skills} `;
    state.resume.experience.forEach(e => compiledResumeText += `${e.role} ${e.desc} `);
    state.resume.projects.forEach(p => compiledResumeText += `${p.name} ${p.desc} `);
    state.resume.responsibility.forEach(r => compiledResumeText += `${r.role} ${r.desc} `);
    
    const resumeTokens = new Set(tokenizeText(compiledResumeText));
    const missingList = [...state.jdKeywords.hard, ...state.jdKeywords.soft];

    if (missingList.length === 0) {
      atsMissingHard.innerHTML = '<span class="muted-text">Paste a Job Description to scan keywords.</span>';
    } else {
      missingList.forEach(kw => {
        const matched = resumeTokens.has(kw);
        const tag = document.createElement('span');
        tag.className = `tag-skill-missing ${matched ? 'matched' : ''}`;
        tag.innerText = kw;
        atsMissingHard.appendChild(tag);
      });
    }

    // Weak verbiage
    atsBuzzwordsList.innerHTML = '';
    if (detectedBuzzwords.length === 0) {
      atsBuzzwordsList.innerHTML = '<span class="muted-text">✓ Zero passive buzzwords found.</span>';
    } else {
      detectedBuzzwords.forEach(item => {
        const div = document.createElement('div');
        div.className = 'replacement-row';
        div.innerHTML = `
          <span class="verb-bad">"${item.word}"</span>
          <span class="verb-good">Try: ${item.replacements}</span>
        `;
        atsBuzzwordsList.appendChild(div);
      });
    }

    // Contact scan checks
    atsContactsList.innerHTML = '';
    const contactFields = [
      { name: 'Email Contact Address', value: emailValid },
      { name: 'Phone Contact Number', value: phoneValid },
      { name: 'LinkedIn URL Profile', value: linkedinValid },
      { name: 'GitHub Profile Link', value: githubValid },
      { name: 'Portfolio / Website link', value: portfolioValid }
    ];

    contactFields.forEach(field => {
      const div = document.createElement('div');
      div.className = `check-line ${field.value ? 'pass' : ''}`;
      div.innerHTML = `
        <span class="check-bullet"></span>
        <span>${field.name}</span>
      `;
      atsContactsList.appendChild(div);
    });
  }

  /* ==========================================================================
     UNIFIED DOWNLOAD OPTIONS & DOCX/PDF GENERATION
     ========================================================================== */
  const btnDownloadTrigger = document.getElementById('btn-download-trigger');
  const downloadFormatModal = document.getElementById('download-format-modal');
  const btnCloseDownloadModal = document.getElementById('btn-close-download-modal');
  const btnOptPdf = document.getElementById('btn-opt-pdf');
  const btnOptDocx = document.getElementById('btn-opt-docx');

  if (btnDownloadTrigger && downloadFormatModal) {
    btnDownloadTrigger.addEventListener('click', () => {
      downloadFormatModal.classList.remove('hidden');
    });
  }

  if (btnCloseDownloadModal && downloadFormatModal) {
    btnCloseDownloadModal.addEventListener('click', () => {
      downloadFormatModal.classList.add('hidden');
    });
  }

  // Close modal when clicking outside the card
  if (downloadFormatModal) {
    downloadFormatModal.addEventListener('click', (e) => {
      if (e.target === downloadFormatModal) {
        downloadFormatModal.classList.add('hidden');
      }
    });
  }

  if (btnOptPdf) {
    btnOptPdf.addEventListener('click', () => {
      downloadFormatModal.classList.add('hidden');
      window.print();
    });
  }

  if (btnOptDocx) {
    btnOptDocx.addEventListener('click', () => {
      downloadFormatModal.classList.add('hidden');
      downloadDocx();
    });
  }

  // Theme color definitions for DOCX styles
  const themeHexMap = {
    slate: '#475569',
    emerald: '#059669',
    navy: '#1e3a8a',
    amber: '#d97706',
    purple: '#7c3aed',
    coral: '#f43f5e',
    olive: '#84cc16',
    rose: '#db2777',
    chocolate: '#8d5b4c',
    teal: '#0d9488',
    crimson: '#e11d48',
    charcoal: '#374151',
    indigo: '#4f46e5',
    gold: '#d97706',
    mint: '#10b981',
    lavender: '#8b5cf6',
    sky: '#0284c7'
  };

  const themeLightHexMap = {
    slate: '#f1f5f9',
    emerald: '#ecfdf5',
    navy: '#eff6ff',
    amber: '#fffbeb',
    purple: '#f5f3ff',
    coral: '#fff1f2',
    olive: '#f7fee7',
    rose: '#fdf2f8',
    chocolate: '#efebe9',
    teal: '#f0fdfa',
    crimson: '#fff1f2',
    charcoal: '#f8fafc',
    indigo: '#e0e7ff',
    gold: '#fffbeb',
    mint: '#ecfdf5',
    lavender: '#f5f3ff',
    sky: '#f0f9ff'
  };

  function downloadDocx() {
    const layoutPreset = templatePresets.find(t => t.id === state.selectedTemplate) || templatePresets[0];
    const themeColor = themeHexMap[layoutPreset.theme] || '#475569';
    const lightBgColor = themeLightHexMap[layoutPreset.theme] || '#f8fafc';
    
    const fullname = state.resume.fullname || `${state.resume.firstname || 'John'} ${state.resume.lastname || 'Doe'}`;
    const jobtitle = state.resume.jobtitle || 'Professional';
    
    // Compile sidebar HTML blocks
    let sidebarHtml = '';
    
    // Photo block
    if (state.resume.photo) {
      sidebarHtml += `
        <div style="text-align: center; margin-bottom: 10pt;">
          <img src="${state.resume.photo}" width="70" height="70" style="border-radius: 35px; border: 2px solid ${themeColor};" />
        </div>
      `;
    }
    
    // Contact Info sidebar block
    sidebarHtml += `
      <div style="margin-bottom: 8pt;">
        <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Contact</h4>
    `;
    if (state.resume.email) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>Email:</strong><br/>${state.resume.email}</p>`;
    if (state.resume.phone) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt;"><strong>Phone:</strong><br/>${state.resume.phone}</p>`;
    if (state.resume.location) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt;"><strong>Location:</strong><br/>${state.resume.location}</p>`;
    sidebarHtml += `</div>`;
    
    // Links block
    const hasLinks = state.resume.linkedin || state.resume.github || state.resume.portfolio;
    if (hasLinks) {
      sidebarHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Links</h4>
      `;
      if (state.resume.linkedin) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>LinkedIn:</strong><br/>${state.resume.linkedin}</p>`;
      if (state.resume.github) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>GitHub:</strong><br/>${state.resume.github}</p>`;
      if (state.resume.portfolio) sidebarHtml += `<p style="font-size: 8pt; margin-bottom: 1.5pt; word-break: break-all;"><strong>Portfolio:</strong><br/>${state.resume.portfolio}</p>`;
      sidebarHtml += `</div>`;
    }
    
    // Education block (for sidebar if split layout)
    const validEdu = state.resume.education.filter(e => e.degree || e.school);
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
    const skillsList = state.resume.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillsList.length > 0) {
      sidebarHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Skills</h4>
          <p style="font-size: 8pt; line-height: 1.3; margin: 0;">${skillsList.join(' • ')}</p>
        </div>
      `;
    }
    
    // Certifications block
    const validCert = state.resume.certifications.filter(c => c.name || c.organization);
    let sidebarCertHtml = '';
    if (validCert.length > 0) {
      sidebarCertHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 9.5pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Certifications</h4>
      `;
      validCert.forEach(item => {
        sidebarCertHtml += `
          <div style="margin-bottom: 3pt;">
            <p style="font-size: 8pt; font-weight: bold; margin-bottom: 0.5pt;">${item.name} (${item.dates})</p>
            <p style="font-size: 7.5pt; margin: 0; color: #444444;">${item.organization}</p>
          </div>
        `;
      });
      sidebarCertHtml += `</div>`;
    }
    
    // Main column blocks
    let mainHtml = '';
    
    // Professional Summary block
    if (state.resume.summary && state.resume.summary.trim() !== '') {
      mainHtml += `
        <div style="margin-bottom: 8pt;">
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Summary</h4>
          <p style="font-size: 8.5pt; line-height: 1.2; margin: 0; color: #333333;">${state.resume.summary}</p>
        </div>
      `;
    }
    
    // Experience block
    const validExp = state.resume.experience.filter(e => e.role || e.company || e.desc);
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
    const validPor = state.resume.responsibility.filter(r => r.role || r.organization || r.desc);
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
    const validProj = state.resume.projects.filter(p => p.name || p.tech || p.desc);
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
          <h4 style="color: ${themeColor}; font-size: 10pt; border-bottom: 1.5pt solid ${themeColor}; padding-bottom: 1.5pt; margin-top: 0; margin-bottom: 3pt; text-transform: uppercase; font-weight: bold;">Education History</h4>
          <table width="100%" cellpadding="3" cellspacing="0" style="border-collapse: collapse; margin-top: 3px; font-size: 8pt;">
            <thead>
              <tr style="background-color: ${lightBgColor}; text-align: left;">
                <th style="border-bottom: 1.5pt solid ${themeColor}; padding: 3px; font-weight: bold;">Qualification</th>
                <th style="border-bottom: 1.5pt solid ${themeColor}; padding: 3px; font-weight: bold;">School / College</th>
                <th style="border-bottom: 1.5pt solid ${themeColor}; padding: 3px; font-weight: bold;">Year</th>
                <th style="border-bottom: 1.5pt solid ${themeColor}; padding: 3px; font-weight: bold;">Score</th>
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
                <td style="text-align: right; font-size: 8pt; color: #555555;">${item.dates}</td>
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
      if (state.resume.email) contactItems.push(state.resume.email);
      if (state.resume.phone) contactItems.push(state.resume.phone);
      if (state.resume.location) contactItems.push(state.resume.location);
      
      let linkItems = [];
      if (state.resume.linkedin) linkItems.push(state.resume.linkedin);
      if (state.resume.github) linkItems.push(state.resume.github);
      if (state.resume.portfolio) linkItems.push(state.resume.portfolio);
      
      const photoHtml = state.resume.photo 
        ? `<td width="70" valign="middle" align="right" style="padding-left: 8px;">
             <img src="${state.resume.photo}" width="60" height="60" style="border-radius: 30px; border: 1.5pt solid ${themeColor};" />
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
    
    // Assemble the complete Word document HTML
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
    
    // Create blob and download
    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const filename = `${fullname.trim().replace(/\s+/g, '_')}_Resume.docx`;
    
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
    
    showToast('DOCX exported successfully!', 'success');
  }

  /* ==========================================================================
     INITIAL WIZARD RUN SETUP
     ========================================================================== */
  // Populate Wizard dynamically on load
  state.resume.education.forEach(item => renderEducationWizardItem(item));
  state.resume.experience.forEach(item => renderExperienceWizardItem(item));
  state.resume.responsibility.forEach(item => renderResponsibilityWizardItem(item));
  state.resume.projects.forEach(item => renderProjectWizardItem(item));
  state.resume.certifications.forEach(item => renderCertificationWizardItem(item));

  // Step 2 wizard default Add trigger
  updateWizardPanelDisplay();

  // Populate dynamic select dropdown and visual gallery grid
  populateTemplateSelect();
  renderTemplatesGrid();

});
