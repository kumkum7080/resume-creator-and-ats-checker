# Resume ATS Score Checker & Optimizer

A premium, high-aesthetic web utility built for job seekers. It calculates an ATS compatibility score, parses uploaded PDF resumes in the browser, extracts key terminology from job descriptions, highlights missing keywords, scans for formatting errors, and lets users optimize their resumes in real-time.

Built as a submission for the **Digital Heroes** trial task.

## Features

1. **Client-Side PDF Extraction**: Upload your resume PDF and parse it directly in the browser using PDF.js. No backend server required!
2. **ATS Match Scoring**: Analyzes the overlap between your resume and the target Job Description, giving you an overall rating and detailed breakdowns.
3. **Keyword Identifier**: Automatically highlights core competencies, hard skills, and soft skills missing from your resume.
4. **Live Resume Optimizer**: A side-by-side view where you can edit your resume and watch your ATS score rise dynamically as you insert keywords.
5. **Formatting Scan**: Detects structure irregularities, checks contact links (LinkedIn, GitHub), and flags non-actionable buzzwords (e.g. "responsible for").

## Technical Details

- **Core**: Vanilla HTML5, CSS3, and ES6+ JavaScript.
- **External Dependency**: `pdfjs-dist` (loaded via CDN) for browser-based PDF parsing.
- **Styling**: Vanilla CSS utilizing CSS Custom Properties for colors, fluid grids, premium dark glassmorphism effects, and responsive components.
- **Icons**: Custom inline SVGs.

## Local Development

To run this project locally:

1. Clone or download the repository.
2. Spin up a local development server using:
   ```bash
   python -m http.server 8000
   ```
   or open `index.html` directly in your browser.

## Deployment

To deploy this application to **Vercel** for free:
1. Push this codebase to a public GitHub repository.
2. Import the repository into your Vercel Dashboard.
3. Vercel will automatically deploy it. No configuration needed!

---

**Developer**: Kumkum Kushwaha  
**Email**: [kumkumkushwaha7080@gmail.com](mailto:kumkumkushwaha7080@gmail.com)  
**Submission for**: [Digital Heroes](https://digitalheroesco.com)
