import React, { useState } from "react";
import { ResumeData, ATSAnalysisResult } from "../types";
import { Gauge, Sparkles, Check, AlertTriangle, ArrowRight, CornerDownRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface AtsAnalyzerProps {
  currentResume: ResumeData;
  onAdoptBullet: (original: string, rewritten: string) => void;
}

export default function AtsAnalyzer({ currentResume, onAdoptBullet }: AtsAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState(
    `We are seeking a senior MERN stack engineer with 3+ years experience. Expected core proficiencies: React, Redux, Node.js, Express, MongoDB, TypeScript, RESTful APIs, and responsive CSS (such as Tailwind CSS). Docker and AWS cloud deployments are highly preferred. Successful candidates must demonstrate exceptional leadership, agile teamwork, and write metrics-driven code.`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [adoptedBullets, setAdoptedBullets] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste the target job description to match against.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/resume/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: currentResume,
          jobDescription: jobDescription
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process ATS audit. Please try again.");
      }

      const report = await response.json();
      if (report.error) {
        throw new Error(report.error);
      }

      setResult(report);
      setAdoptedBullets([]); // Reset adapted bullet tracks of previous analyses
    } catch (err: any) {
      console.error(err);
      alert(`ATS Analyzer Error: ${err.message || "An error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  const adoptBulletSuggestion = (original: string, rewritten: string, idx: number) => {
    onAdoptBullet(original, rewritten);
    setAdoptedBullets([...adoptedBullets, idx.toString()]);
  };

  // Helper to color importance tags
  const getImportanceBadge = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Score description tag
  const getScoreDescription = (score: number) => {
    if (score >= 85) return { label: "Excellent Match!", color: "text-emerald-600", bg: "bg-emerald-50", border: 'border-emerald-100' };
    if (score >= 70) return { label: "Good Potential", color: "text-amber-600", bg: "bg-amber-100/40", border: 'border-amber-100' };
    return { label: "Needs Alignment", color: "text-rose-600", bg: "bg-rose-50", border: 'border-rose-100' };
  };

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5">
      <div className="mb-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">ATS Compatibility Scanner</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Audit compliance, measure keyword coverage, and implement precise enhancements.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Job description input box */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Description (JD)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none font-sans leading-relaxed"
            placeholder="Paste the target job opening requirements or copy specifications page details..."
          />
        </div>

        {/* Scan Button Action */}
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 border border-slate-800 rounded text-xs font-bold transition disabled:opacity-50 select-none active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Auditing Qualifications...
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-teal-400" />
                Analyze ATS Alignment
              </>
            )}
          </button>
        </div>

        {/* RESULTS WRAPPER */}
        {result && !loading && (
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-6">
            
            {/* MATCH STAT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Radial/Big score block */}
              <div className={`p-4 rounded-lg border ${getScoreDescription(result.score).border} ${getScoreDescription(result.score).bg} flex flex-col items-center justify-center text-center`}>
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">ATS Score</span>
                <div className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {result.score}%
                </div>
                <span className={`text-xs font-bold font-mono mt-1 ${getScoreDescription(result.score).color}`}>
                  {getScoreDescription(result.score).label}
                </span>
              </div>

              {/* Overall executive summary feedback */}
              <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-100 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold mb-1">Executive Alignment statement</span>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">{result.overallFeedback}</p>
              </div>
            </div>

            {/* KEYWORD TARGET GAP LISTING */}
            <div className="p-4 border border-slate-100 rounded-lg bg-white">
              <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold block mb-3">Critical Keyword Index Check</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {result.keywordAnalysis.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {item.present ? (
                        <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 truncate">{item.keyword}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold border rounded px-1.5 uppercase font-mono ${getImportanceBadge(item.importance)}`}>
                        {item.importance}
                      </span>
                      <span className={`text-[10px] font-bold ${item.present ? "text-emerald-700 bg-emerald-50 border border-emerald-100 px-1 rounded" : "text-amber-700 bg-amber-50 border border-amber-100 px-1 rounded"}`}>
                        {item.present ? "Found" : "Gap"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION BY SECTION ANALYSING CRITIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono border-b pb-2 mb-2 flex items-center justify-between">
                  <span>Summary & Contact Profile</span>
                  <span className="text-[10px] px-1 bg-slate-205 rounded text-slate-550 border border-slate-200">ATS Audit</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{result.sectionFeedback.summary}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono border-b pb-2 mb-2 flex items-center justify-between">
                  <span>Experience Alignment</span>
                  <span className="text-[10px] px-1 bg-slate-205 rounded text-slate-550 border border-slate-200">ATS Audit</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{result.sectionFeedback.experience}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono border-b pb-2 mb-2 flex items-center justify-between">
                  <span>Core Skills Density</span>
                  <span className="text-[10px] px-1 bg-slate-205 rounded text-slate-550 border border-slate-200">ATS Audit</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{result.sectionFeedback.skills}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono border-b pb-2 mb-2 flex items-center justify-between">
                  <span>Format & File Structure</span>
                  <span className="text-[10px] px-1 bg-slate-205 rounded text-slate-550 border border-slate-200">ATS Audit</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{result.sectionFeedback.format}</p>
              </div>
            </div>

            {/* TAILORED REWRITES WITH "ADOPT" ACTIONS */}
            {result.improvedBullets.length > 0 && (
              <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/20">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={14} className="text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-905 uppercase tracking-wider font-mono">Tailored AI Achievement Optimizer</h4>
                </div>
                <p className="text-[11px] text-slate-550 mb-4 leading-relaxed">
                  These custom re-engineered points are automatically woven around requirements and target keywords. 
                  Click <strong>"Adopt Enhancement"</strong> to immediately inject these revisions into your resume copy!
                </p>

                <div className="space-y-4">
                  {result.improvedBullets.map((bullet, idx) => {
                    const isAdopted = adoptedBullets.includes(idx.toString());
                    return (
                      <div key={idx} className="bg-white border border-slate-100 rounded-md p-3.5 space-y-2.5 shadow-sm text-xs relative">
                        {/* Status Adoption Tag */}
                        {isAdopted && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            <Check size={11} /> Adopted
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 block font-mono">In Your Resume (or approximate)</span>
                          <p className="text-gray-500 italic">"{bullet.original || 'Raw task details'}"</p>
                        </div>

                        <div className="pl-3 border-l-2 border-indigo-500 space-y-1 bg-indigo-50/30 p-2.5 rounded-r">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-600 block flex items-center gap-1 font-mono">
                            <CornerDownRight size={10} /> Optimized Target Highlight
                          </span>
                          <p className="text-slate-800 font-medium">"{bullet.suggested}"</p>
                          <p className="text-[10px] text-indigo-700 mt-1.5 font-sans">
                            <strong>Insight:</strong> {bullet.reason}
                          </p>
                        </div>

                        {!isAdopted && (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => adoptBulletSuggestion(bullet.original, bullet.suggested, idx)}
                              className="px-2.5 py-1 bg-indigo-600 border border-indigo-700 text-white rounded font-bold hover:bg-indigo-700 transition active:scale-95 text-[10px] font-mono tracking-tight"
                            >
                              Adopt Enhancement
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
