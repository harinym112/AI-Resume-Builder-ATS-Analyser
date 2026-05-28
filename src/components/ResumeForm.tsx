import React, { useState } from "react";
import { ResumeData, WorkExperience, Education, Project, Certification, Language } from "../types";
import { Plus, Trash, Sparkles, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "projects" | "skills" | "extra">("personal");
  
  // Loading states for individual AI bullet polish action
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [polishingMessage, setPolishingMessage] = useState<string | null>(null);

  // Loading state for summary optimizer
  const [polishingSummary, setPolishingSummary] = useState(false);

  const updatePersonalInfo = (field: string, val: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: val
      }
    });
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      description: ""
    };
    onChange({
      ...data,
      experiences: [...data.experiences, newExp]
    });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, val: any) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp))
    });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((exp) => exp.id !== id)
    });
  };

  const polishExperienceBullet = async (id: string, item: WorkExperience) => {
    if (!item.description.trim()) {
      alert("Provide some initial description details to polish.");
      return;
    }
    setPolishingId(id);
    setPolishingMessage(null);
    try {
      const response = await fetch("/api/resume/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: item.description,
          company: item.company,
          position: item.position
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      updateExperience(id, "description", resData.suggested);
      setPolishingMessage(`Optimized successfully with metrics! Reason: ${resData.reason}`);
    } catch (err: any) {
      console.error(err);
      alert(`AI Rewrite failed: ${err.message}`);
    } finally {
      setPolishingId(null);
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      location: "",
      grade: ""
    };
    onChange({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const updateEducation = (id: string, field: keyof Education, val: any) => {
    onChange({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: val } : edu))
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id)
    });
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      technologies: "",
      description: "",
      url: ""
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const updateProject = (id: string, field: keyof Project, val: any) => {
    onChange({
      ...data,
      projects: data.projects.map((proj) => (proj.id === id ? { ...proj, [field]: val } : proj))
    });
  };

  const deleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id)
    });
  };

  const polishProjectBullet = async (id: string, item: Project) => {
    if (!item.description.trim()) {
      alert("Provide some description content to polish with AI.");
      return;
    }
    setPolishingId(id);
    setPolishingMessage(null);
    try {
      const response = await fetch("/api/resume/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: item.description,
          position: item.role,
          company: item.name
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      updateProject(id, "description", resData.suggested);
      setPolishingMessage(`Optimized successfully with metrics! Reason: ${resData.reason}`);
    } catch (err: any) {
      console.error(err);
      alert(`AI Rewrite failed: ${err.message}`);
    } finally {
      setPolishingId(null);
    }
  };

  const optimizeSummary = async () => {
    if (!data.personalInfo.summary.trim()) {
      alert("Please write a draft description of yourself in the summary box first.");
      return;
    }
    setPolishingSummary(true);
    try {
      const response = await fetch("/api/resume/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalSummary: data.personalInfo.summary,
          targetRole: data.title
        })
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      onChange({
        ...data,
        personalInfo: {
          ...data.personalInfo,
          summary: resData.summary
        }
      });
    } catch (err: any) {
      console.error(err);
      alert(`Summary polish failed: ${err.message}`);
    } finally {
      setPolishingSummary(false);
    }
  };

  const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim().replace(/,$/, "");
      if (val && !data.skills.includes(val)) {
        onChange({
          ...data,
          skills: [...data.skills, val]
        });
        e.currentTarget.value = "";
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s !== skillToRemove)
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: ""
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newCert]
    });
  };

  const updateCertification = (id: string, field: keyof Certification, val: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    });
  };

  const deleteCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id)
    });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: crypto.randomUUID(),
      name: "",
      proficiency: "Conversational"
    };
    onChange({
      ...data,
      languages: [...data.languages, newLang]
    });
  };

  const updateLanguage = (id: string, field: keyof Language, val: string) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    });
  };

  const deleteLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter((l) => l.id !== id)
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5">
      {/* Tab Navigation header */}
      <div className="flex flex-wrap border-b border-gray-100 gap-1 pb-3 mb-5">
        {[
          { key: "personal", label: "Contact Info" },
          { key: "experience", label: "Experience" },
          { key: "education", label: "Education" },
          { key: "projects", label: "Projects" },
          { key: "skills", label: "Skills Stack" },
          { key: "extra", label: "Certifications/Lang" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setPolishingMessage(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
              activeTab === tab.key
                ? "bg-slate-900 border border-slate-800 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {polishingMessage && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded text-xs flex gap-2 items-start border border-emerald-100">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{polishingMessage}</span>
        </div>
      )}

      {/* TABS CONTAINER */}
      <div>
        {/* PERSONAL DETAIL TAB */}
        {activeTab === "personal" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Professional Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => onChange({ ...data, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="e.g. Lead Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="jane.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Personal Website / Portfolio</label>
                <input
                  type="url"
                  value={data.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="https://janedoe.me"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="linkedin.com/in/janedoe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub Username / URL</label>
                <input
                  type="text"
                  value={data.personalInfo.github}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                  placeholder="github.com/janedoe"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-600">Executive Summary / Pitch</label>
                <button
                  type="button"
                  onClick={optimizeSummary}
                  disabled={polishingSummary}
                  className="flex items-center gap-1.5 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition active:scale-95 disabled:opacity-50"
                >
                  <Sparkles size={11} />
                  {polishingSummary ? "Optimizing Summary..." : "Polish Summary with AI"}
                </button>
              </div>
              <textarea
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                rows={5}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none focus:ring-slate-800 font-sans"
                placeholder="Brief summary of your professional expertise, leadership style, and accomplishments..."
              />
            </div>
          </div>
        )}

        {/* WORK EXPERIENCES TAB */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Work Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-150 rounded text-xs font-semibold"
              >
                <Plus size={13} /> Add Role
              </button>
            </div>

            {data.experiences.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                No work experiences listed. Click 'Add Role' above to insert.
              </div>
            ) : (
              <div className="space-y-6">
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-50/50 outline outline-1 outline-offset-4 outline-slate-100 rounded border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                      title="Delete experience listing"
                    >
                      <Trash size={14} />
                    </button>

                    <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200/60 rounded text-slate-700 mb-3">
                      ROLE #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Team</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Google AI team"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Position / Job Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Senior Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="June 2021"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Present or Dec 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Job Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="San Francisco, CA (Hybrid)"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-slate-600">Work Description (Separate bullets with new lines)</label>
                        <button
                          type="button"
                          onClick={() => polishExperienceBullet(exp.id, exp)}
                          disabled={polishingId === exp.id}
                          className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition active:scale-95 disabled:opacity-50"
                        >
                          <Sparkles size={11} className={polishingId === exp.id ? "animate-spin" : ""} />
                          {polishingId === exp.id ? "Analyzing & Writing..." : "Apply AI STAR Format"}
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        rows={5}
                        className="w-full text-xs p-3 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none font-sans"
                        placeholder="• Spearheaded React microfrontend framework scaling to 15 teams.&#10;• Reduced load speeds by 42% through lazy loading & client caches."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Academic Degrees</h3>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-150 rounded text-xs font-semibold"
              >
                <Plus size={13} /> Add Education
              </button>
            </div>

            {data.education.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                No education history listed. Click 'Add Education' above.
              </div>
            ) : (
              <div className="space-y-5">
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-50/50 rounded border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => deleteEducation(edu.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                      title="Remove degree"
                    >
                      <Trash size={14} />
                    </button>

                    <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200/65 rounded text-slate-700 mb-3">
                      DEGREE #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Stanford University"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="M.S. in Computer Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Artificial Intelligence"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Sep 2018"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="June 2020"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Grade / GPA / Score (Optional)</label>
                        <input
                          type="text"
                          value={edu.grade}
                          onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="3.9 / 4.0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Portfolio Projects</h3>
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-150 rounded text-xs font-semibold"
              >
                <Plus size={13} /> Add Project
              </button>
            </div>

            {data.projects.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                No portfolio projects listed. Click 'Add Project' above.
              </div>
            ) : (
              <div className="space-y-5">
                {data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 bg-slate-50/50 rounded border border-gray-200 relative">
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                      title="Remove project listing"
                    >
                      <Trash size={14} />
                    </button>

                    <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200/65 rounded text-slate-700 mb-3">
                      PROJECT #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="ATS Resume Evaluator"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Technologies Used</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="React, Node.js, Express, Gemini API"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Your Role / Contributions (Optional)</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => updateProject(proj.id, "role", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="Solo Creator / Full Stack Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Project Link / Repo URL (Optional)</label>
                        <input
                          type="url"
                          value={proj.url}
                          onChange={(e) => updateProject(proj.id, "url", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="https://github.com/janedoe/builder-ats"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-slate-600">Project Highlights & Impact</label>
                        <button
                          type="button"
                          onClick={() => polishProjectBullet(proj.id, proj)}
                          disabled={polishingId === proj.id}
                          className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold transition active:scale-95 disabled:opacity-50"
                        >
                          <Sparkles size={11} className={polishingId === proj.id ? "animate-spin" : ""} />
                          {polishingId === proj.id ? "Optimizing..." : "Apply AI STAR Format"}
                        </button>
                      </div>
                      <textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                        rows={4}
                        className="w-full text-xs p-3 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none font-sans"
                        placeholder="Built an in-browser resume parser utilizing Gemini, leading to 1.2k active daily engagements..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAGS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Skills Tags Matrix</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Add Tech / Professional Skills</label>
              <input
                type="text"
                onKeyDown={handleSkillsChange}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                placeholder="Type a skill (e.g. Node.js) and press Enter or comma (,)"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Your list updates in real-time on keypress.</span>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Active Keyword Index ({data.skills.length})</label>
              {data.skills.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-150 rounded">
                  No skills tags entered. Type skills above.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 text-xs rounded shadow-sm text-slate-700"
                    >
                      <span className="font-semibold">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-gray-400 hover:text-red-500 font-bold ml-1 hover:scale-125 transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADDITIONAL META TAB (CERTIFICATIONS & LANGUAGES) */}
        {activeTab === "extra" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Certifications</h4>
                <button
                  type="button"
                  onClick={addCertification}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-750 border border-slate-150 rounded text-[11px] font-semibold"
                >
                  <Plus size={11} /> Add
                </button>
              </div>

              {data.certifications.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-[11px] border border-dashed border-gray-200 rounded">
                  No professional certifications listed.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-50/50 border border-gray-200 rounded relative">
                      <button
                        type="button"
                        onClick={() => deleteCertification(cert.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash size={12} />
                      </button>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="AWS Solutions Architect Associate"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                            className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                            placeholder="Amazon Web Services"
                          />
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                            className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                            placeholder="May 2024"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Languages</h4>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-750 border border-slate-150 rounded text-[11px] font-semibold"
                >
                  <Plus size={11} /> Add
                </button>
              </div>

              {data.languages.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-[11px] border border-dashed border-gray-200 rounded">
                  No languages listed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="p-3 bg-slate-50/50 border border-gray-200 rounded relative flex gap-2 items-center justify-between">
                      <div className="grid grid-cols-2 gap-2 flex-grow pr-6">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                          className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          placeholder="English / Spanish"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                          className="text-xs px-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-slate-800 focus:outline-none"
                        >
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional">Professional</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Elementary">Elementary</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteLanguage(lang.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
