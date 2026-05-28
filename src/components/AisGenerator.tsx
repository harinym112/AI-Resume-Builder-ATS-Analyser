import React, { useState } from "react";
import { ResumeData } from "../types";
import { Sparkles, Loader2, ArrowRight, CornerDownRight, CheckCircle } from "lucide-react";

interface AisGeneratorProps {
  onGenerated: (newResume: ResumeData) => void;
}

export default function AisGenerator({ onGenerated }: AisGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Full-Stack Developer (MERN / Node.js)");
  const [summary, setSummary] = useState("I am looking to pivot from mechanical engineering to software development, having built multiple React projects, some databases, and understand API configurations.");
  const [skillsInput, setSkillsInput] = useState("React, Tailwind, Node.js, Express, MongoDB, TypeScript, Git");
  const [workInput, setWorkInput] = useState("Freelance developer role building a portfolio, plus past project coordination experiences.");
  const [educationInput, setEducationInput] = useState("B.E. in Mechanical Engineering, and online web development bootcamp certification.");

  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a target job title.");
      return;
    }

    setLoading(true);
    setAiSuccessMessage(null);

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          skillsInput,
          workInput,
          educationInput
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume with Gemini. Please check connection or API key.");
      }

      const generatedData = await response.json();
      if (generatedData.error) {
        throw new Error(generatedData.error);
      }

      // Add unique IDs to objects since backend doesn't construct them
      const fullyFormatedResume: ResumeData = {
        id: crypto.randomUUID(),
        title: generatedData.title || `AI Generated: ${title}`,
        updatedAt: new Date().toLocaleDateString(),
        personalInfo: {
          fullName: generatedData.personalInfo?.fullName || "Aisha Hariny",
          email: generatedData.personalInfo?.email || "aisha.hariny@mepcoeng.ac.in",
          phone: generatedData.personalInfo?.phone || "+91 98765 43210",
          location: generatedData.personalInfo?.location || "Tamil Nadu, India",
          website: generatedData.personalInfo?.website || "https://harinycodes.dev",
          linkedin: generatedData.personalInfo?.linkedin || "https://linkedin.com/in/aisha-hariny",
          github: generatedData.personalInfo?.github || "https://github.com/aishuhariny",
          summary: generatedData.personalInfo?.summary || ""
        },
        experiences: (generatedData.experiences || []).map((exp: any) => ({
          ...exp,
          id: crypto.randomUUID()
        })),
        education: (generatedData.education || []).map((edu: any) => ({
          ...edu,
          id: crypto.randomUUID()
        })),
        skills: generatedData.skills || [],
        projects: (generatedData.projects || []).map((proj: any) => ({
          ...proj,
          id: crypto.randomUUID()
        })),
        certifications: (generatedData.certifications || []).map((cert: any) => ({
          ...cert,
          id: crypto.randomUUID()
        })),
        languages: (generatedData.languages || []).map((lang: any) => ({
          ...lang,
          id: crypto.randomUUID()
        }))
      };

      onGenerated(fullyFormatedResume);
      setAiSuccessMessage(`Successfully engineered an industry-ready resume for "${title}"! Loaded automatically into the viewport.`);
    } catch (err: any) {
      console.error(err);
      alert(`AI Generation Error: ${err.message || "Unknown error occurring via server request."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-lg p-6 relative border border-slate-850 overflow-hidden shadow-xl">
      {/* Absolute ambient lights behind title */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-lg text-slate-950 font-bold">
            <Sparkles size={16} />
          </div>
          <h2 className="text-md font-bold tracking-tight">AI Resume Concept Generator</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-6">
          Short on ideas? State your target goal, past background nodes, and technical expertise.
          Our backend Gemini agent will write a optimized, high-fidelity resume layout following standard HR matrices.
        </p>

        {aiSuccessMessage && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded text-xs flex gap-2 items-start animate-fade-in">
            <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{aiSuccessMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">Target Professional Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded focus:ring-1 focus:ring-teal-400 focus:outline-none focus:border-transparent text-white"
                placeholder="e.g. Lead Full-Stack Engineer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">Expertise / Tech Stack Keywords</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                disabled={loading}
                className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded focus:ring-1 focus:ring-teal-400 focus:outline-none focus:border-transparent text-white"
                placeholder="React, Express, PyTorch, SQL"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">Brief Bio / Background Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={loading}
              rows={2}
              className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded focus:ring-1 focus:ring-teal-400 focus:outline-none focus:border-transparent text-white"
              placeholder="List professional focus, accomplishments, or raw career changes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">Raw Job History Highlights</label>
              <textarea
                value={workInput}
                onChange={(e) => setWorkInput(e.target.value)}
                disabled={loading}
                rows={2}
                className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded focus:ring-1 focus:ring-teal-400 focus:outline-none focus:border-transparent text-white"
                placeholder="Previous company names, internship focuses, or general responsibilities..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">Academic Background Draft</label>
              <textarea
                value={educationInput}
                onChange={(e) => setEducationInput(e.target.value)}
                disabled={loading}
                rows={2}
                className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded focus:ring-1 focus:ring-teal-400 focus:outline-none focus:border-transparent text-white"
                placeholder="Degree titles, certification pathways, bootcamps..."
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 hover:opacity-90 px-5 py-2.5 rounded text-xs font-bold transition uppercase tracking-wider select-none disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={13} />
                  Structuring Resume via Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  Generate AI Resume Blueprint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
