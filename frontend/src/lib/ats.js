// Job Listing Presets
export const jdPresets = {
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

// Expanded Hard skills categorization list (200+ industry-standard technical & business skills)
export const hardSkillsList = new Set([
  // Core Web & Languages
  'react', 'redux', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3', 'git', 'github', 
  'python', 'django', 'flask', 'node', 'node.js', 'express', 'sql', 'mysql', 'postgres', 'postgresql', 
  'nosql', 'mongodb', 'docker', 'redis', 'aws', 'gcp', 'kubernetes', 'azure', 'graphql',
  'rest', 'api', 'apis', 'c++', 'c#', 'java', 'php', 'laravel', 'figma', 'wireframes', 'wireframing',
  'analytics', 'telemetry', 'ci/cd', 'linux', 'sass', 'tailwind', 'angular', 'vue',
  'golang', 'rust', 'ruby', 'rails', 'swift', 'kotlin', 'dart', 'flutter', 'svelte', 'solidjs', 
  'jquery', 'bootstrap', 'less', 'stylus', 'postcss', 'fastapi', 'spring', 'phoenix', 'dotnet', 
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'numpy', 'pandas', 'scipy', 'matplotlib', 
  'seaborn', 'opencv', 'nlp', 'nltk', 'spacy', 'bert', 'gpt', 'lambda', 'serverless', 'dynamodb', 
  'cassandra', 'neo4j', 'mariadb', 'sqlite', 'firebase', 'supabase', 'apollo', 'prisma', 'sequelize', 
  'mongoose', 'typeorm', 'webgl', 'three.js', 'd3.js', 'webpack', 'vite', 'rollup', 'babel', 
  'jenkins', 'circleci', 'actions', 'travis', 'ansible', 'terraform', 'vagrant', 'nginx', 'apache', 
  'unix', 'bash', 'powershell', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'asana', 
  'slack', 'sketch', 'photoshop', 'illustrator', 'seo', 'sem', 'copywriting', 'salesforce', 
  'hubspot', 'crm', 'tableau', 'powerbi', 'excel', 'word', 'microservices', 'grpc', 'websockets', 
  'webrtc', 'pwa', 'jest', 'mocha', 'chai', 'cypress', 'selenium', 'playwright', 'tdd', 'bdd', 
  'hadoop', 'spark', 'hive', 'cryptography', 'solidity', 'blockchain', 'web3', 'ethereum',
  // Product, Design & Operations
  'roadmap', 'lifecycle', 'scrum', 'telemetry', 'wireframes', 'sprint', 'user stories', 'backlog',
  'product management', 'project management', 'ui/ux', 'prototyping', 'marketing', 'copywriting',
  'growth hacking', 'budgeting', 'qa', 'testing', 'devops', 'monitoring', 'sysadmin'
]);

// Expanded Weak Buzzwords & Passive Verbs Rules (35+ common items)
export const buzzwordRules = [
  { word: 'responsible for', replacements: 'Spearheaded, Orchestrated, Executed' },
  { word: 'duties included', replacements: 'Directed, Executed, Managed' },
  { word: 'assisted with', replacements: 'Collaborated on, Facilitated' },
  { word: 'worked on', replacements: 'Engineered, Crafted, Deployed' },
  { word: 'helped to', replacements: 'Strengthened, Accelerated, Advised' },
  { word: 'team player', replacements: 'Collaborator, Contributor' },
  { word: 'detail-oriented', replacements: 'Analytical, Meticulous' },
  { word: 'hard worker', replacements: 'Diligent, Dedicated' },
  { word: 'results-oriented', replacements: 'Analytical, Strategic' },
  { word: 'self-motivated', replacements: 'Driven, Proactive' },
  { word: 'passion for', replacements: 'Aspirant, Dedicated' },
  { word: 'utilize', replacements: 'Leveraged, Employed' },
  { word: 'participated in', replacements: 'Contributed to, Joined' },
  { word: 'handled', replacements: 'Managed, Directed, Administered' },
  { word: 'innovative', replacements: 'Creative, Visionary' },
  { word: 'dynamic', replacements: 'Agile, Adaptable' },
  { word: 'expert', replacements: 'Specialist, Adept' },
  { word: 'successful', replacements: 'Productive, Effective' },
  { word: 'go-to person', replacements: 'Key resource, Subject matter expert' },
  { word: 'proven track record', replacements: 'Demonstrated success' },
  { word: 'think outside the box', replacements: 'Creative, Innovative' },
  { word: 'synergy', replacements: 'Collaboration, Alignment' },
  { word: 'go-getter', replacements: 'Initiator, Driver' },
  { word: 'interface with', replacements: 'Liaise with, Coordinate with' },
  { word: 'liaison', replacements: 'Representative, Intermediary' },
  { word: 'quickly', replacements: 'Swiftly, Efficiently' },
  { word: 'successfully', replacements: 'Effectively, Accomplished' },
  { word: 'various', replacements: 'Multiple, Diversified' },
  { word: 'etc', replacements: 'Specific items (avoid etc.)' },
  { word: 'smart', replacements: 'Intelligent, Analytical' },
  { word: 'creative', replacements: 'Innovative, Imaginative' },
  { word: 'motivated', replacements: 'Driven, Dedicated' },
  { word: 'good at', replacements: 'Skilled in, Proficient in' },
  { word: 'led the team in', replacements: 'Directed, Orchestrated, Guided' },
  { word: 'managed the', replacements: 'Administered, Directed, Spearheaded' }
];

// Stop words
export const stopWords = new Set([
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

export function tokenizeText(text) {
  const rawTokens = text.toLowerCase().match(/[a-zA-Z0-9+#]+/g) || [];
  return rawTokens.filter(t => t.length > 1);
}

export function filterTokens(tokens) {
  return tokens.filter(t => !stopWords.has(t));
}

export function extractJdKeywords(jdText = "", customKeywordsStr = "") {
  const tokens = filterTokens(tokenizeText(jdText));
  const freqs = {};
  tokens.forEach(t => freqs[t] = (freqs[t] || 0) + 1);

  // Parse custom keywords
  const customKeywords = customKeywordsStr
    .split(',')
    .map(kw => kw.trim().toLowerCase())
    .filter(kw => kw.length > 0);

  const sortedTerms = Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]);
  const hard = [];
  const soft = [];
  const maxKeywords = 15;

  // Add custom keywords first with priority
  customKeywords.forEach(term => {
    if (hard.length + soft.length >= maxKeywords) return;
    if (hardSkillsList.has(term)) {
      if (!hard.includes(term)) hard.push(term);
    } else {
      if (!soft.includes(term)) soft.push(term);
    }
  });

  // Then add JD words
  sortedTerms.forEach(term => {
    if (hard.length + soft.length >= maxKeywords) return;
    // Skip if already added via custom keywords
    if (hard.includes(term) || soft.includes(term)) return;

    if (hardSkillsList.has(term)) {
      if (!hard.includes(term)) hard.push(term);
    } else if (term.length > 3) {
      if (!soft.includes(term)) soft.push(term);
    }
  });

  return { hard, soft };
}

export function runAtsAnalysis(resume, jdText = "", customKeywordsStr = "") {
  // Compile resume text block
  let compiledResumeText = `
    ${resume.fullname || ""} ${resume.jobtitle || ""} ${resume.summary || ""} ${resume.skills || ""}
  `;
  (resume.education || []).forEach(e => compiledResumeText += ` ${e.degree || ""} ${e.school || ""} ${e.score || ""}`);
  (resume.experience || []).forEach(e => compiledResumeText += ` ${e.role || ""} ${e.company || ""} ${e.desc || ""}`);
  (resume.responsibility || []).forEach(r => compiledResumeText += ` ${r.role || ""} ${r.organization || ""} ${r.desc || ""}`);
  (resume.projects || []).forEach(p => compiledResumeText += ` ${p.name || ""} ${p.tech || ""} ${p.desc || ""}`);
  (resume.certifications || []).forEach(c => compiledResumeText += ` ${c.name || ""} ${c.organization || ""}`);

  const resumeTokens = new Set(tokenizeText(compiledResumeText));

  // 1. Keywords Match
  const jdKeywords = extractJdKeywords(jdText, customKeywordsStr);
  const allJdKeywords = [...jdKeywords.hard, ...jdKeywords.soft];

  const matchedKeywords = [];
  const missingKeywords = [];

  allJdKeywords.forEach(kw => {
    if (resumeTokens.has(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const scoreKeywords = allJdKeywords.length > 0 ? 
    Math.round((matchedKeywords.length / allJdKeywords.length) * 100) : 0;

  // 2. Structure check
  const checks = {
    summary: (resume.summary || "").trim().length > 15,
    skills: (resume.skills || "").trim().length > 5,
    education: (resume.education || []).length > 0,
    experience: (resume.experience || []).length > 0,
    responsibility: (resume.responsibility || []).length > 0,
    projects: (resume.projects || []).length > 0,
    certs: (resume.certifications || []).length > 0
  };
  const values = Object.values(checks);
  const passed = values.filter(v => v).length;
  const scoreStructure = Math.round((passed / values.length) * 100);

  // 3. Formatting & Length Auditing
  // Word Count check
  const wordCount = compiledResumeText.trim().split(/\s+/).filter(w => w.length > 0).length;
  let wordCountScore = 100;
  let wordCountStatus = "Ideal";
  let wordCountWarning = "";

  if (wordCount < 300) {
    wordCountScore = 40;
    wordCountStatus = "Too Short";
    wordCountWarning = `Your resume has only ${wordCount} words. ATS systems look for comprehensive detail. Aim for 450-850 words.`;
  } else if (wordCount < 450) {
    wordCountScore = 75;
    wordCountStatus = "Short";
    wordCountWarning = `Your resume has ${wordCount} words. Consider adding more details to your work experience or projects.`;
  } else if (wordCount > 1000) {
    wordCountScore = 40;
    wordCountStatus = "Too Long";
    wordCountWarning = `Your resume has ${wordCount} words. Try keeping it under 850 words to avoid recruiter fatigue.`;
  } else if (wordCount > 850) {
    wordCountScore = 75;
    wordCountStatus = "Long";
    wordCountWarning = `Your resume has ${wordCount} words. It's close to the limit; review and prune non-essential items.`;
  }

  // Bullet points check for experience, responsibility, projects descriptions
  const bulletPattern = /[•\-\*\+\u2022\u2023\u25E6\u2043\u2219]/;
  const descriptionEntries = [];
  
  (resume.experience || []).forEach(e => {
    if ((e.desc || "").trim()) {
      descriptionEntries.push({ type: "Work Experience", title: e.role, text: e.desc });
    }
  });
  (resume.responsibility || []).forEach(r => {
    if ((r.desc || "").trim()) {
      descriptionEntries.push({ type: "Leadership/Responsibility", title: r.role, text: r.desc });
    }
  });
  (resume.projects || []).forEach(p => {
    if ((p.desc || "").trim()) {
      descriptionEntries.push({ type: "Project", title: p.name, text: p.desc });
    }
  });

  let bulletPointsPassed = 0;
  const bulletDetails = [];
  descriptionEntries.forEach(entry => {
    // Check if there are list items or lines starting with bullet indicators
    const lines = entry.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const hasBullets = lines.some(line => bulletPattern.test(line));
    
    if (hasBullets) {
      bulletPointsPassed++;
    }
    bulletDetails.push({
      type: entry.type,
      title: entry.title,
      hasBullets
    });
  });

  const bulletPointsScore = descriptionEntries.length > 0 ?
    Math.round((bulletPointsPassed / descriptionEntries.length) * 100) : 100;

  const scoreFormatting = Math.round((wordCountScore * 0.4) + (bulletPointsScore * 0.6));

  // 4. Advanced Contact Validation
  const emailValid = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(resume.email || "");
  
  // International phone validator: checks that phone number has 8-15 digits after stripping formatting,
  // and is not a plain duplicate sequence (like 9999999)
  const phoneClean = (resume.phone || "").replace(/\D/g, "");
  const phoneValid = phoneClean.length >= 8 && phoneClean.length <= 15 && !/^(.)\1+$/.test(phoneClean);

  const linkedinValid = /linkedin\.com\/in\/[A-Za-z0-9_-]+/i.test(resume.linkedin || "");
  const githubValid = /github\.com\/[A-Za-z0-9_-]+/i.test(resume.github || "");
  
  // Portfolio domain structure and protocol check
  const portfolioRaw = (resume.portfolio || "").trim();
  const portfolioValid = portfolioRaw.length > 4 && 
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/i.test(portfolioRaw);

  const contactChecks = [emailValid, phoneValid, linkedinValid, githubValid, portfolioValid];
  const passedContact = contactChecks.filter(v => v).length;
  const scoreContact = Math.round((passedContact / contactChecks.length) * 100);

  // 5. Style check weak verbs
  let buzzwordsCount = 0;
  const detectedBuzzwords = [];
  buzzwordRules.forEach(rule => {
    const regex = new RegExp(`\\b${rule.word}\\b`, 'gi');
    if (regex.test(compiledResumeText)) {
      buzzwordsCount++;
      detectedBuzzwords.push(rule);
    }
  });
  const scoreStyle = Math.max(20, 100 - (buzzwordsCount * 8)); // 8pts deduction per word, floor of 20

  // 6. Overall Weighted ATS Score (adjusted weights)
  // Keywords (30%), Structure (20%), Formatting & Length (20%), Contact (15%), Action/Style (15%)
  const scoreOverall = Math.round(
    (scoreKeywords * 0.30) +
    (scoreStructure * 0.20) +
    (scoreFormatting * 0.20) +
    (scoreContact * 0.15) +
    (scoreStyle * 0.15)
  );

  return {
    scoreOverall,
    scoreKeywords,
    scoreStructure,
    scoreFormatting,
    scoreContact,
    scoreStyle,
    matchedKeywords,
    missingKeywords,
    detectedBuzzwords,
    checks,
    wordCount,
    wordCountStatus,
    wordCountWarning,
    bulletPointsScore,
    bulletDetails,
    contactChecks: {
      emailValid,
      phoneValid,
      linkedinValid,
      githubValid,
      portfolioValid
    }
  };
}
