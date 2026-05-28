# AI Resume Builder & ATS Analyzer 🚀

A modern, responsive, and full-stack web application designed to help candidates engineer industry-ready resumes and audit their alignment against target job descriptions using the **Google Gemini Pro Flash API**.

---

## ✨ Features

- **AI Resume Blueprint Generator**: Describe your target role and brief background, and Gemini will automatically structure a master, metrics-driven resume.
- **ATS Compatibility Scanner**: Real-time evaluation of your resume content against any pasted Job Description, bringing realistic match scoring and target suggestions.
- **STAR Achievement Optimizer**: Instantly rewrite basic bullet points into performance-focused STAR (Situation, Task, Action, Result) achievements with quantitative impacts.
- **Dynamic Theme Switcher**: Instantly render your resume across 4 tailored, high-resolution aesthetic layouts optimized for standard A4 exports.
- **One-Click Local Exports**: Print or export your polished resume to clean vector PDFs using native printer configurations.
- **Robust Local Storage Integration**: Auto-saves your multiple resume drafts and changes locally so no information is lost on page refreshes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide icons, ES6+ TypeScript.
- **Backend / Routing**: Node.js, Express, `tsx` runner.
- **AI Integration**: `@google/genai` (Official modern Google GenAI SDK).
- **Compilation / Bundling**: `esbuild` (bundling the TypeScript application into single CJS runtime `dist/server.cjs`).

---

## 💻 Local Setup & Execution Guide

Follow these simple steps to run this application on your local computer after downloading/cloning:

### 1. Extract and Install Dependencies
Ensure you have **Node.js (v18+)** installed. Open your terminal in the extracted folder and run:
```bash
npm install
```

### 2. Configure Environment Secrets
Create a file named `.env` in the root directory (you can copy the provided `.env.example`) and append your Google Gemini API Key:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```
*(Get your free API Key from [Google AI Studio](https://aistudio.google.com/))*

### 3. Start Development Server
To launch the application locally with hot-reloading support:
```bash
npm run dev
```
Once run, navigate to **`http://localhost:3000`** in your browser.

### 4. Build and Run in Production Mode
To compile the TypeScript server and static client bundle for cloud deployments (such as Render, Heroku, or AWS):
```bash
# Build the React assets and Express CJS server bundle
npm run build

# Start the compiled production bundle
npm run start
```

---

## 📁 Repository Structure

```
├── dist/                # Pre-compiled static client files & production server bundle
├── src/
│   ├── components/
│   │   ├── AisGenerator.tsx  # Generative resume builder component
│   │   ├── AtsAnalyzer.tsx   # ATS matching and compliance scanner
│   │   ├── ResumeForm.tsx    # Interactive section form editor (Experience, Skills, Certs)
│   │   └── ResumePreview.tsx # Print/A4 layout theme switcher
│   ├── App.tsx          # Master coordinate layout 
│   ├── index.css        # Global CSS imports with Tailwind styling
│   ├── main.tsx         # Virtual DOM entry node
│   └── types.ts         # High-precision TypeScript models
├── server.ts            # Express server (Gemini SDK controller)
├── package.json         # Unified system dependencies & commands
└── tsconfig.json        # Advanced TS settings
```

