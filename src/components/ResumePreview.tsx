import React, { useRef } from "react";
import { ResumeData, TemplateId } from "../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Printer, Sparkles } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  templateId: TemplateId;
}

export default function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;

  // Helper to format text with linebreaks into styled bullets or paragraphs
  const renderFormattedDescription = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n").filter(line => line.trim() !== "");
    return (
      <ul className="list-disc list-outside pl-4 space-y-1">
        {lines.map((line, idx) => {
          // Clean leading bullets/hyphens if present
          const cleanLine = line.replace(/^[•\-\*\s]+/, "");
          return (
            <li key={idx} className="text-[13px] text-gray-700 leading-relaxed">
              {cleanLine}
            </li>
          );
        })}
      </ul>
    );
  };

  // Modern Template Layout
  const renderModern = () => (
    <div className="bg-white min-h-[11in] p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 max-w-4xl mx-auto text-gray-800 font-sans print:shadow-none print:border-none print:p-0">
      {/* Header Banner Block */}
      <div className="border-b-4 border-slate-700 pb-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">{personalInfo.fullName || "Your Full Name"}</h1>
        <p className="text-lg text-slate-600 font-medium mt-1">{data.title || "Target Job Title"}</p>
        
        {/* Contact Strip */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} className="text-slate-500" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-slate-500" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-500" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe size={12} className="text-slate-500" /> {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={12} className="text-slate-500" /> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github size={12} className="text-slate-500" /> {personalInfo.github}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-2">Professional Summary</h2>
          <p className="text-[13px] text-gray-700 leading-relaxed font-normal">{personalInfo.summary}</p>
        </div>
      )}

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left narrower column - Skills, Education, Certs */}
        <div className="md:col-span-1 space-y-6">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-3">Core Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-800 text-[11px] rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-3">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-semibold text-slate-800 text-xs">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{edu.startDate} – {edu.endDate}</p>
                    {edu.location && <p className="text-[11px] text-gray-500">{edu.location}</p>}
                    {edu.grade && <p className="text-[11px] text-emerald-600 font-medium">GPA: {edu.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-3">Credentials</h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <p className="font-semibold text-slate-800">{cert.name}</p>
                    <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-3">Languages</h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">{lang.name}</span>
                    <span className="text-gray-500 text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right wider column - Work History & Projects */}
        <div className="md:col-span-2 space-y-6">
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-4">Professional Experience</h2>
              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="group relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{exp.position}</h3>
                        <p className="text-xs font-medium text-slate-600">{exp.company}</p>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <p className="font-medium">{exp.startDate} – {exp.endDate}</p>
                        {exp.location && <p className="text-gray-400">{exp.location}</p>}
                      </div>
                    </div>
                    <div className="mt-2 pl-0.5">
                      {renderFormattedDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b pb-1 mb-4">Selected Projects</h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800 text-xs">
                        {proj.name}
                        {proj.role && <span className="text-gray-500 font-normal"> — {proj.role}</span>}
                      </h4>
                      {proj.url && <span className="text-[11px] text-slate-500 underline break-all">{proj.url}</span>}
                    </div>
                    {proj.technologies && (
                      <p className="text-[11px] font-mono font-medium text-slate-600 mt-0.5">Tech: {proj.technologies}</p>
                    )}
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Editorial (Serif Elegant) Template Layout
  const renderEditorial = () => (
    <div className="bg-[#FCFBF9] min-h-[11in] p-8 md:p-12 shadow-sm rounded-lg border border-gray-150 max-w-4xl mx-auto text-[#1C1A17] font-serif print:shadow-none print:bg-white print:p-0 print:border-none">
      {/* Centered Monospace Header */}
      <div className="text-center pb-6 mb-6 border-b border-gray-200">
        <h1 className="text-3xl font-normal tracking-wide uppercase font-serif text-[#1C1A17]">{personalInfo.fullName || "Your Full Name"}</h1>
        <p className="text-xs tracking-widest uppercase font-mono text-gray-500 mt-1">{data.title || "Target Job Title"}</p>
        
        {/* Contact Links Separated by Dots */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4 text-[11px] tracking-tight font-sans text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6 max-w-3xl mx-auto text-justify">
          <p className="text-[13px] text-gray-800 leading-relaxed italic font-serif">"{personalInfo.summary}"</p>
        </div>
      )}

      {/* Single-Column Editorial Spacing */}
      <div className="space-y-6">
        {/* Experience Section */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-mono text-gray-500 border-b border-gray-200 pb-1 mb-4">Professional History</h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm text-gray-900 font-serif">{exp.position} — <span className="font-normal text-gray-600">{exp.company}</span></span>
                    <span className="text-[11px] font-mono text-gray-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 italic font-serif mt-0.5">{exp.location}</p>
                  <div className="mt-2 pl-2">
                    {renderFormattedDescription(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-mono text-gray-500 border-b border-gray-200 pb-1 mb-4">Technical Exploits</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs text-gray-900">{proj.name} {proj.role && <span className="text-gray-500 text-[11px] font-mono">({proj.role})</span>}</span>
                    {proj.url && <span className="text-[10px] tracking-tight font-mono text-gray-400 underline">{proj.url}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] tracking-wider font-mono text-gray-500 mt-0.5">STACK: {proj.technologies}</p>
                  )}
                  <p className="text-[12px] text-gray-700 leading-relaxed font-serif mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two columns for remaining sections inside Editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left: Education & Langs */}
          <div className="space-y-6">
            {education.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest font-mono text-gray-500 border-b border-gray-200 pb-1 mb-3">Academic Base</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <p className="font-semibold text-gray-900 font-serif">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-gray-600 font-serif">{edu.institution}, {edu.location}</p>
                      <p className="text-[11px] font-mono text-gray-500 mt-0.5">{edu.startDate} – {edu.endDate} {edu.grade && `• GPA: ${edu.grade}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Skills & Certifications */}
          <div className="space-y-6">
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest font-mono text-gray-500 border-b border-gray-200 pb-1 mb-3">Technical Armor</h2>
                <p className="text-xs text-gray-700 leading-relaxed font-serif">
                  {skills.join(", ")}
                </p>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest font-mono text-gray-500 border-b border-gray-200 pb-1 mb-3">Accreditations</h2>
                <div className="space-y-2 text-xs">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <span className="font-semibold text-gray-800">{cert.name}</span>
                      <span className="text-gray-500 text-[11px] font-mono"> — {cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Slate Clean (Responsive Modern Layout with subtle blue tones)
  const renderSlate = () => (
    <div className="bg-white min-h-[11in] overflow-hidden p-8 md:p-12 shadow-sm rounded-lg border border-gray-100 max-w-4xl mx-auto text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{personalInfo.fullName || "Your Full Name"}</h1>
          <p className="text-md text-emerald-600 font-semibold tracking-wider uppercase mt-1">{data.title || "Target Job Title"}</p>
        </div>
        <div className="grid grid-cols-2 md:flex md:flex-col gap-2 mt-4 md:mt-0 text-left md:text-right text-[11px] text-slate-500 font-medium">
          {personalInfo.email && <div className="flex items-center gap-1 md:justify-end"><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1 md:justify-end"><span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-1 md:justify-end"><span>{personalInfo.location}</span></div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1 md:justify-end"><span>{personalInfo.linkedin}</span></div>}
          {personalInfo.github && <div className="flex items-center gap-1 md:justify-end"><span>{personalInfo.github}</span></div>}
        </div>
      </div>

      <div className="space-y-6">
        {personalInfo.summary && (
          <div>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-2">Executive Overview</h2>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-3">Employment Summary</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-b border-dashed border-slate-100 pb-3 last:border-none last:pb-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 text-xs">{exp.position}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-emerald-700 font-medium mt-0.5">
                    <span>{exp.company}</span>
                    <span className="text-gray-400 italic">{exp.location}</span>
                  </div>
                  <div className="mt-2 text-xs">
                    {renderFormattedDescription(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-3">Showcase & Systems</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded border border-slate-100/50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-805 text-xs">{proj.name} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</span>
                    {proj.url && <span className="text-[10px] text-slate-400 hover:underline">{proj.url}</span>}
                  </div>
                  {proj.technologies && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {proj.technologies.split(",").map((tech, i) => (
                        <span key={i} className="text-[9px] bg-white border border-slate-150 px-1.5 py-0.5 text-slate-600 rounded">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-3">Academic Base</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-800">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-[11px] text-slate-600">{edu.institution} • {edu.location}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{edu.startDate} – {edu.endDate} {edu.grade && `• Score: ${edu.grade}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-2">Technical Summary</h2>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-950 uppercase tracking-widest border-l-4 border-slate-800 pl-2.5 mb-2">Certifications</h2>
                <div className="space-y-1 text-xs">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span className="font-medium text-slate-800">{cert.name}</span>
                      <span className="text-slate-400 text-[11px]">{cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Minimalist (Super Compact High-Contrast Layout)
  const renderMinimalist = () => (
    <div className="bg-white min-h-[11in] p-6 md:p-10 shadow-sm rounded-lg border border-gray-100 max-w-4xl mx-auto text-black font-sans print:shadow-none print:border-none print:p-0">
      <div className="pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold tracking-tight">{personalInfo.fullName || "Your Full Name"}</h1>
        <p className="text-sm text-gray-700 tracking-wide mt-0.5 uppercase font-medium">{data.title || "Target Job Title"}</p>
        <div className="flex flex-wrap gap-x-4 mt-2 text-[11px] text-gray-500 font-normal">
          {personalInfo.email && <span className="underline">{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span className="underline">{personalInfo.website}</span>}
          {personalInfo.linkedin && <span className="underline">{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="underline">{personalInfo.github}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {personalInfo.summary && (
          <div>
            <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black mb-1">Executive Summary</h2>
            <p className="text-[12px] text-gray-800 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div>
            <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black border-t border-gray-100 pt-2 mb-2">Experience</h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline text-[12px]">
                    <span className="font-bold">{exp.position} <span className="font-normal text-gray-600">at {exp.company}</span></span>
                    <span className="font-medium text-gray-500 text-[11px]">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic mb-1">{exp.location}</p>
                  <div>
                    {renderFormattedDescription(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black border-t border-gray-100 pt-2 mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[12px]">
                  <div className="flex justify-between items-center font-bold">
                    <span>{proj.name} {proj.role && <span className="font-normal text-gray-500">[{proj.role}]</span>}</span>
                    {proj.url && <span className="text-[11px] font-normal text-gray-400">{proj.url}</span>}
                  </div>
                  {proj.technologies && <p className="text-[10px] font-mono text-gray-500 mt-0.5">Stack: {proj.technologies}</p>}
                  <p className="text-gray-800 leading-normal mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-2">
          {education.length > 0 && (
            <div>
              <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black mb-1.5">Education</h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[12px]">
                    <p className="font-bold">{edu.degree} — <span className="font-semibold text-gray-700">{edu.fieldOfStudy}</span></p>
                    <p className="text-gray-500 text-[11px]">{edu.institution}, {edu.location}</p>
                    <p className="text-gray-400 text-[10px]">{edu.startDate} – {edu.endDate} {edu.grade && `• GPA: ${edu.grade}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            {skills.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black mb-1">Key Disciplines</h2>
                <p className="text-[12px] text-gray-700 leading-relaxed">{skills.join(" • ")}</p>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-[11px] uppercase tracking-wider font-extrabold text-black mb-1">Credentials</h2>
                <div className="space-y-1 text-[11px] text-gray-650">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span className="font-medium">{cert.name}</span>
                      <span className="text-gray-400">{cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Action panel in normal view: Hidden inside printer drivers */}
      <div className="flex justify-between items-center border border-slate-100 bg-slate-50/50 p-4 rounded-lg mb-4 print:hidden">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-semibold font-mono tracking-wider uppercase">Visual Templates Layer</span>
          <span className="text-xs text-gray-500 mt-0.5">Toggle spacing and layouts. Optimized for high-res A4 vector exports.</span>
        </div>
        <button
          id="btn-trigger-pdf-print"
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-800 hover:shadow shadow-sm transition active:scale-95"
        >
          <Printer size={13} />
          Export PDF / AirPrint
        </button>
      </div>

      <div id="capture-printable-resume-node" ref={resumeRef} className="print:block">
        {templateId === "modern" && renderModern()}
        {templateId === "editorial" && renderEditorial()}
        {templateId === "slate" && renderSlate()}
        {templateId === "minimalist" && renderMinimalist()}
      </div>
    </div>
  );
}
