/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ResumeData, TemplateId } from "./types";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import AtsAnalyzer from "./components/AtsAnalyzer";
import AisGenerator from "./components/AisGenerator";
import {
  FileText,
  Sparkles,
  Gauge,
  Plus,
  Trash,
  Sliders,
  Award,
  BookOpen,
  Briefcase,
  Copy,
  Info
} from "lucide-react";

const SAMPLE_RESUME_ID = "sample-resume-id";

const initialSampleResume: ResumeData = {
  id: SAMPLE_RESUME_ID,
  title: "Senior Full-Stack Engineer Profile",
  updatedAt: new Date().toLocaleDateString(),
  personalInfo: {
    fullName: "Aisha Hariny",
    email: "aisha.hariny@mepcoeng.ac.in",
    phone: "+91 94421 80234",
    location: "Tamil Nadu, India",
    website: "https://harinycodes.dev",
    linkedin: "https://linkedin.com/in/aisha-hariny",
    github: "https://github.com/aishuhariny",
    summary: "Senior Full-Stack Developer with 4+ years of hands-on experience designing and optimizing cloud-native web architectures, server-side frameworks (Node.js/Express), and high-density user interfaces (React/TypeScript). Proven record of reducing server latency by 45% and implementing enterprise-grade ATS solutions that boost search capabilities by 60% with semantic models."
  },
  experiences: [
    {
      id: "exp-1",
      company: "Cognitive Web Solutions Corp",
      position: "Senior Full-Stack Software Engineer",
      startDate: "Oct 2022",
      endDate: "Present",
      location: "Bengaluru, India (Hybrid)",
      description: "• Spearheaded translation of legacy visual portals to modular microfrontends (React 18 + Vite), reducing startup asset weights by 1.2MB.\n• Designed secure backend REST APIs using Node.js and Express processing 1.4 million transactions daily with sub-50ms latencies.\n• Optimized MongoDB schemas and indexing policies, leading to a 30% reduction in document query durations and saving 140 hours in weekly processing computations."
    },
    {
      id: "exp-2",
      company: "Vertex Tech Labs",
      position: "Associate Web Developer & API Integrations",
      startDate: "Jun 2020",
      endDate: "Sep 2022",
      location: "Chennai, India",
      description: "• Authored robust backend connectors for payment systems and social graphs using Node.js, Express, and JWT cryptography standards.\n• Improved search result metrics by 40% using custom keyword matching algorithms and fuzzy indexes.\n• Collaborated weekly with agile UX designers to map mobile-friendly Tailwind layouts across 10 consumer applications."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Mepco Schlenk Engineering College",
      degree: "Bachelor of Engineering",
      fieldOfStudy: "Computer Science and Engineering",
      startDate: "Aug 2016",
      endDate: "May 2020",
      location: "Sivakasi, Tamil Nadu",
      grade: "8.7 CGPA"
    }
  ],
  skills: [
    "React", "Node.js", "Express", "TypeScript", "JavaScript (ES6+)", "MongoDB", "Tailwind CSS", "RESTful APIs", "Git & GitHub", "Vite", "ESLint", "System Architecture"
  ],
  projects: [
    {
      id: "proj-1",
      name: "ATS Compliance System Analyzer",
      role: "Lead Creator",
      technologies: "Node.js, Express, React, Gemini API",
      description: "Created an in-depth Applicant Tracking System audit toolkit with live matching scores, vector keyword comparisons, and generative experience re-phrasing using Gemini LLM models.",
      url: "https://github.com/aishuhariny/ats-analytica"
    },
    {
      id: "proj-2",
      name: "Distributed Memory-Cache Store",
      role: "Backend Architect",
      technologies: "Node.js, WebSockets, TypeScript",
      description: "Designed a lightweight in-memory cache system with standard LRU cache policies and real-time syncing capabilities, utilizing robust event channels.",
      url: "https://github.com/aishuhariny/in-mem-cache"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "Dec 2024"
    },
    {
      id: "cert-2",
      name: "MongoDB Certified Developer",
      issuer: "MongoDB Inc",
      date: "Mar 2025"
    }
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Professional" },
    { id: "lang-2", name: "Tamil", proficiency: "Native" }
  ]
};

const defaultEmptyResume = (title: string): ResumeData => ({
  id: crypto.randomUUID(),
  title,
  updatedAt: new Date().toLocaleDateString(),
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: ""
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: []
});

export default function App() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"edit" | "ats" | "ai-hub">("edit");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai_resumes_collection");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ResumeData[];
        if (parsed.length > 0) {
          setResumes(parsed);
          setActiveResumeId(parsed[0].id);
        } else {
          setResumes([initialSampleResume]);
          setActiveResumeId(initialSampleResume.id);
        }
      } catch (err) {
        console.error("Failed to parse saved resumes", err);
        setResumes([initialSampleResume]);
        setActiveResumeId(initialSampleResume.id);
      }
    } else {
      setResumes([initialSampleResume]);
      setActiveResumeId(initialSampleResume.id);
    }
  }, []);

  // Save changes to local storage
  const saveToLocalStorage = (updatedResumes: ResumeData[]) => {
    localStorage.setItem("ai_resumes_collection", JSON.stringify(updatedResumes));
  };

  const handleResumeChange = (updatedActive: ResumeData) => {
    const updated = resumes.map((r) => (r.id === updatedActive.id ? { ...updatedActive, updatedAt: new Date().toLocaleDateString() } : r));
    setResumes(updated);
    saveToLocalStorage(updated);
  };

  const handleCreateNew = () => {
    const titlePrompt = prompt("Enter a label for this new Resume:", "Frontend Engineer Copy");
    if (titlePrompt === null) return;
    const title = titlePrompt.trim() || `Resume Layout (${new Date().toLocaleDateString()})`;
    const newResume = defaultEmptyResume(title);
    const updated = [newResume, ...resumes];
    setResumes(updated);
    setActiveResumeId(newResume.id);
    saveToLocalStorage(updated);
    setActiveTab("edit");
  };

  const handleDuplicate = () => {
    const active = resumes.find((r) => r.id === activeResumeId);
    if (!active) return;
    const clone: ResumeData = {
      ...active,
      id: crypto.randomUUID(),
      title: `${active.title} (Clone)`,
      updatedAt: new Date().toLocaleDateString()
    };
    const updated = [clone, ...resumes];
    setResumes(updated);
    setActiveResumeId(clone.id);
    saveToLocalStorage(updated);
  };

  const handleDelete = () => {
    if (resumes.length <= 1) {
      alert("You should keep at least one active resume.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this resume layout?");
    if (!confirmDelete) return;

    const remaining = resumes.filter((r) => r.id !== activeResumeId);
    setResumes(remaining);
    setActiveResumeId(remaining[0].id);
    saveToLocalStorage(remaining);
  };

  const handleAiGenerated = (newResume: ResumeData) => {
    const updated = [newResume, ...resumes];
    setResumes(updated);
    setActiveResumeId(newResume.id);
    saveToLocalStorage(updated);
    setActiveTab("edit");
  };

  // Smart adopt rewritten bullets from ATS suggestions
  const handleAdoptBullet = (originalText: string, rewrittenText: string) => {
    const active = resumes.find((r) => r.id === activeResumeId);
    if (!active) return;

    // Clean original of markers like bullet point character
    const cleanOriginal = originalText.trim().replace(/^[•\-\*\s]+/, "").toLowerCase();

    let matchedCount = 0;

    // Map experiences
    const updatedExperiences = active.experiences.map((exp) => {
      const lines = exp.description.split("\n");
      let replaced = false;
      const updatedLines = lines.map((line) => {
        const cleanLine = line.trim().replace(/^[•\-\*\s]+/, "").toLowerCase();
        // If line contains original, or highly resembles it, replace it
        if (
          cleanLine.includes(cleanOriginal) || 
          cleanOriginal.includes(cleanLine) || 
          line.toLowerCase().includes(cleanOriginal) || 
          line.trim() === originalText.trim()
        ) {
          replaced = true;
          matchedCount++;
          return `• ${rewrittenText}`;
        }
        return line;
      });
      return replaced ? { ...exp, description: updatedLines.join("\n") } : exp;
    });

    // Map projects
    const updatedProjects = active.projects.map((proj) => {
      const cleanDesc = proj.description.trim().toLowerCase();
      if (
        cleanDesc.includes(cleanOriginal) || 
        cleanOriginal.includes(cleanDesc) || 
        proj.description.toLowerCase().includes(cleanOriginal)
      ) {
        matchedCount++;
        return { ...proj, description: rewrittenText };
      }
      return proj;
    });

    // If no explicit match was found, we will create/append it to their very first experience to ensure adoption succeeds!
    let experiencesResult = updatedExperiences;
    if (matchedCount === 0 && experiencesResult.length > 0) {
      const firstExp = experiencesResult[0];
      const separator = firstExp.description && !firstExp.description.endsWith("\n") ? "\n" : "";
      experiencesResult = experiencesResult.map((exp, idx) => 
        idx === 0 
          ? { ...exp, description: `${exp.description}${separator}• ${rewrittenText}` } 
          : exp
      );
      matchedCount++;
    }

    const updatedActive = {
      ...active,
      experiences: experiencesResult,
      projects: updatedProjects,
      updatedAt: new Date().toLocaleDateString()
    };

    handleResumeChange(updatedActive);
  };

  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans print:bg-white print:p-0">
      
      {/* GLOBAL HEADER BAR: Hidden inside Printer Drivers */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        {/* LOGO TITLE */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black tracking-tight shadow-sm font-mono text-sm border border-slate-800">
            A1
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-mono">CV Architect & ATS Analytica</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-mono text-slate-500 max-w-sm">Mepco AI Builder Core • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* ACTIVE DOCUMENT MANAGEMENT DROPDOWNS */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {resumes.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-55 border border-slate-200/80 px-2.5 py-1.5 rounded-lg bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Profile</span>
              <select
                value={activeResumeId}
                onChange={(e) => {
                  setActiveResumeId(e.target.value);
                  setPolishingSummary(false);
                }}
                className="text-xs font-semibold bg-transparent border-none text-slate-800 focus:outline-none focus:ring-0 max-w-[200px]"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-1.5">
            <button
              onClick={handleCreateNew}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 transition shadow-sm"
              title="Create standard empty layout"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={handleDuplicate}
              disabled={!activeResume}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 transition shadow-sm disabled:opacity-55"
              title="Clone active layout"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={handleDelete}
              disabled={resumes.length <= 1}
              className="p-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-lg text-slate-500 hover:text-red-650 transition shadow-sm disabled:opacity-55"
              title="Delete active layout"
            >
              <Trash size={14} />
            </button>
          </div>
        </div>

        {/* SWITCH TABS (Editor / ATS Scanner / Generation Hub) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/40">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "edit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={12} />
            Draft & Design
          </button>
          <button
            onClick={() => setActiveTab("ats")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "ats" ? "bg-white text-slate-905 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Gauge size={12} className="text-emerald-500" />
            ATS Compliancy
          </button>
          <button
            onClick={() => setActiveTab("ai-hub")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === "ai-hub" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={12} className="text-indigo-500 animate-pulse" />
            AI Generator
          </button>
        </div>
      </header>

      {/* ACTION BANNER ALERT: INFORM USER ABOUT SECRETS SETUP FOR PROPER AI ASSISTANCE */}
      <div className="bg-slate-900 text-slate-400 py-2 px-4 text-center text-[11px] font-mono border-b border-slate-950 flex items-center justify-center gap-1.5 print:hidden">
        <Info size={12} className="text-teal-400 mt-0.5" />
        <span>Fully integrated with Google Gemini LLM API (Server-Side). Active model: <strong>gemini-3.5-flash</strong>.</span>
      </div>

      {/* CORE FRAMEWORK WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 print:p-0">
        
        {/* VIEW REGION 1: AI GENERATOR FROM SCRATCH */}
        {activeTab === "ai-hub" && (
          <div className="w-full max-w-4xl mx-auto print:hidden">
            <AisGenerator onGenerated={handleAiGenerated} />
          </div>
        )}

        {/* VIEW REGION 2: DRAFT & DESIGN ENGINE (SPLIT FRAMEWORK) */}
        {activeTab === "edit" && activeResume && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            {/* LEFT INPUT COLUMN: HIDDEN IN PRINTS */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Active Sheet Document</span>
                  <h2 className="text-xs font-bold text-slate-100 mt-0.5">{activeResume.title}</h2>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Make standard updates to your academic backgrounds, job bullets, and language skills. Alter individual descriptions directly or utilize our STAR AI helpers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>ID: {activeResume.id.substring(0, 8)}...</span>
                  <span>Updated: {activeResume.updatedAt}</span>
                </div>
              </div>

              <ResumeForm data={activeResume} onChange={handleResumeChange} />
            </div>

            {/* RIGHT PREVIEW COLUMN: PERFECT RESOLUTION SHEETS */}
            <div className="lg:col-span-7 space-y-4 print:w-full print:p-0">
              {/* Template selector triggers: Hidden inside prints */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg bg-white border border-slate-100 p-4 gap-3 print:hidden shadow-sm">
                <span className="text-xs font-bold font-mono uppercase text-slate-500 tracking-wider">Visual Themes</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "modern", label: "Modern Slate" },
                    { id: "editorial", label: "Editorial Serif" },
                    { id: "slate", label: "Slate Clean" },
                    { id: "minimalist", label: "Clean Minimal" }
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id as TemplateId)}
                      className={`text-xs px-2.5 py-1 rounded font-semibold border transition ${
                        selectedTemplate === tpl.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printable sheet node */}
              <div className="print:block print:p-0 print:m-0">
                <ResumePreview data={activeResume} templateId={selectedTemplate} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW REGION 3: ATS ENHANCEMENT SUITE */}
        {activeTab === "ats" && activeResume && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            {/* LEFT COLUMN: ATS AUDIT TOOL */}
            <div className="lg:col-span-5 space-y-6 print:hidden animate-fade-in">
              <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Integrated Evaluator</span>
                <h2 className="text-xs font-bold text-slate-100 mt-0.5">Resume ATS Score Audit</h2>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  We compare your loaded document copy (<strong>{activeResume.title}</strong>) against any target Job Description. 
                  Our system evaluates vocabulary compliance, technical keywords, phrasing structures, and format densities to deliver clean HR score alignment.
                </p>
              </div>

              <AtsAnalyzer currentResume={activeResume} onAdoptBullet={handleAdoptBullet} />
            </div>

            {/* RIGHT COLUMN: PREVIEW OF RESUME TO SHOW DYNAMIC CHANGES ONCE ADOPTED */}
            <div className="lg:col-span-7 space-y-4 print:w-full print:p-0 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-2 print:hidden text-xs text-emerald-800">
                <span className="p-1 bg-emerald-100 rounded-full font-bold">💡</span>
                <span>
                  <strong>Dynamic Target Syncing:</strong> Keep this preview loaded alongside the ATS Scanner. When you hit <strong>"Adopt Enhancement"</strong>, watch the resume preview re-render with your STAR-optimized metrics instantly!
                </span>
              </div>

              <div className="print:block print:p-0 print:m-0">
                <ResumePreview data={activeResume} templateId={selectedTemplate} />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER METRICS INFO */}
      <footer className="py-8 bg-white border-t border-slate-150 text-center text-xs text-slate-400 font-mono tracking-tight mt-12 print:hidden">
        <p>AI Resume Architect & ATS Analyzer Cluster 2026</p>
        <p className="text-[10px] text-slate-300 mt-1">Built with React, Express, and Google GenAI SDK (gemini-3.5-flash).</p>
      </footer>
    </div>
  );
}

// Global local loading state variable for helper UI
let setPolishingSummary: React.Dispatch<React.SetStateAction<boolean>> = () => {};
