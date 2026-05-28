import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Lazy instantiation helper to safeguard startup when API keys are missing
let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via the Settings > Secrets menu in AI Studio.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Global middlewares
app.use(express.json({ limit: "15mb" }));

// Graceful Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

/**
 * AI Endpoint: Generate a fully structured resume template from user background/profile description
 */
app.post("/api/resume/generate", async (req: Request, res: Response) => {
  try {
    const { title, summary, skillsInput, workInput, educationInput } = req.body;
    
    if (!title) {
      res.status(400).json({ error: "Missing required parameter: title" });
      return;
    }

    const ai = getGenAI();

    const prompt = `
Generate a comprehensive, highly polished resume in JSON format for a candidate targeting the position of: "${title}".
Candidate Brief Summary details: "${summary || 'Generate a professional summary for this targeting role.'}"
Key Skills: "${skillsInput || 'Generate relevant core skills.'}"
Work Experience Highlights: "${workInput || 'Generate 2 professional experience listings with bullet points.'}"
Education Background: "${educationInput || 'Generate relevant college/degree details.'}"

Write high-quality, professional bullet points following the STAR (Situation, Task, Action, Result) method for experiences and projects. Elaborate empty details gracefully into strong professional examples. Leave fields like email, phone, location, linkedin, and github as empty placeholders ready to be filled, or generate professional mock examples.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master professional resume designer, headhunter, and resume writing expert. You write stunning, impact-focused, metrics-driven resumes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A label for this resume" },
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                summary: { type: Type.STRING, description: "Highly professional executive summary tailored for the target role" }
              },
              required: ["fullName", "email", "phone", "location", "summary"]
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING, description: "e.g., June 2022" },
                  endDate: { type: Type.STRING, description: "e.g., Present or Dec 2024" },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING, description: "3-4 professional descriptions separated by newlines, formatted with bullet points" }
                },
                required: ["company", "position", "startDate", "endDate", "location", "description"]
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: { type: Type.STRING, description: "e.g., Sep 2018" },
                  endDate: { type: Type.STRING, description: "e.g., May 2022" },
                  location: { type: Type.STRING },
                  grade: { type: Type.STRING }
                },
                required: ["institution", "degree", "fieldOfStudy", "startDate", "endDate", "location"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  technologies: { type: Type.STRING, description: "Comma separated technologies, e.g., React, Node.js" },
                  description: { type: Type.STRING, description: "Highlighting key accomplishments and challenge solved" },
                  url: { type: Type.STRING }
                },
                required: ["name", "technologies", "description"]
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING, description: "e.g., Oct 2024" }
                },
                required: ["name", "issuer", "date"]
              }
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING, description: "e.g., Native, Fluent, Conversational" }
                },
                required: ["name", "proficiency"]
              }
            }
          },
          required: [
            "title",
            "personalInfo",
            "experiences",
            "education",
            "skills",
            "projects",
            "certifications",
            "languages"
          ]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error generating resume template:", error);
    res.status(500).json({ error: error.message || "An error occurred during resume generation." });
  }
});

/**
 * AI Endpoint: Rewrite single bullet point or experience description
 */
app.post("/api/resume/rewrite-bullet", async (req: Request, res: Response) => {
  try {
    const { originalText, company, position, contextJobDescription } = req.body;
    if (!originalText) {
      res.status(400).json({ error: "Missing required parameter: originalText" });
      return;
    }

    const ai = getGenAI();
    let prompt = `Rewrite the following professional resume description to follow the industry-standard STAR format (Situation, Task, Action, Result). Always emphasize clear actions, insert professional action-verbs, and incorporate quantitative metrics/impact wherever logical.
Description bullet input: "${originalText}"`;

    if (position || company) {
      prompt += `\nRole context: candidate worked as a ${position || 'Professional'} at ${company || 'Organization'}.`;
    }
    if (contextJobDescription) {
      prompt += `\nTarget Job Description to optimize for keywords: "${contextJobDescription}"`;
    }

    prompt += `\nProvide the output in JSON layout with fields: "suggested" (the fully enhanced text) and "reason" (short explanation of changes made).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an executive CV reviewer who transforms basic descriptions into power bullets.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggested: { type: Type.STRING, description: "The single fully rewritten description text with professional metrics and verbs." },
            reason: { type: Type.STRING, description: "A clear bullet summary of what edits were introduced and why." }
          },
          required: ["suggested", "reason"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error rewriting bullet:", error);
    res.status(500).json({ error: error.message || "An error occurred while upgrading the description." });
  }
});

/**
 * AI Endpoint: Polishing professional summary/biography
 */
app.post("/api/resume/improve-summary", async (req: Request, res: Response) => {
  try {
    const { originalSummary, targetRole } = req.body;
    if (!originalSummary) {
      res.status(400).json({ error: "Missing required parameter: originalSummary" });
      return;
    }

    const ai = getGenAI();
    const prompt = `Rewrite and professionalize the following resume brief summary/bio. Ensure it captures attention, describes major skills, looks modern, and incorporates executive action words.
Original summary: "${originalSummary}"
${targetRole ? `Optimized for Target Job Alignment: "${targetRole}"` : ''}

Provide output as a JSON with "summary" containing the rewritten textual copy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "The newly polished summary" }
          },
          required: ["summary"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error improving summary:", error);
    res.status(500).json({ error: error.message || "An error occurred while polishing the summary." });
  }
});

/**
 * AI Endpoint: Robust ATS Match Scoring & Keyword Analysis
 */
app.post("/api/resume/analyze-ats", async (req: Request, res: Response) => {
  try {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
      res.status(400).json({ error: "Missing required parameters: resume and jobDescription are required." });
      return;
    }

    const ai = getGenAI();

    // Format resume details for clean LLM reading
    const resumeString = `
NAME: ${resume.personalInfo?.fullName || "Candidate"}
TARGET / TITLE: ${resume.title}
SUMMARY: ${resume.personalInfo?.summary || "None"}
SKILLS: ${(resume.skills || []).join(", ")}
EXPERIENCE:
${(resume.experiences || []).map((exp: any) => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}):\n  ${exp.description}`).join("\n")}
PROJECTS:
${(resume.projects || []).map((proj: any) => `- ${proj.name} using ${proj.technologies}:\n  ${proj.description}`).join("\n")}
EDUCATION:
${(resume.education || []).map((edu: any) => `- ${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution}`).join("\n")}
`;

    const prompt = `
Perform a high-precision ATS compliance check (Applicant Tracking System review) of the candidate's resume text against the provided Job Description.

Target Job Description:
"""
${jobDescription}
"""

Candidate's Resume Data:
"""
${resumeString}
"""

Instructions:
1. Score the match mathematically from 0-100% based on alignment of qualifications, industry buzzwords, frameworks, and job specs. Be realistic as real ATS parsers are strict.
2. Formulate a comprehensive 'overallFeedback' outlining formatting strengths, alignment gaps, and visual issues.
3. Perform a list analysis of skills/technical keywords. Mark distinct technical/hard keywords or core methodology phrases present vs those missing from the Job Description. Give each a relative 'importance' ("high" | "medium" | "low"). Mark 'present' as true or false. Include 8-12 vital terms.
4. Provide structured Section-by-Section feedback for 'summary', 'experience', 'skills', and 'format' sections, providing solid advice.
5. Create a listing 'improvedBullets' pointing out 2 to 4 bullet points in the experiences/projects with an direct improved rewrite tailored directly to weave missing target keywords or highlight metrics.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an enterprise talent acquisition director, lead HR technical recruiter, and ATS auditing bot. You provide objective, honest scoring and highly informative feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A realistic and strict ATS match score from 0 to 100" },
            overallFeedback: { type: Type.STRING, description: "In-depth summary statement of candidates alignment and major action items" },
            keywordAnalysis: {
              type: Type.ARRAY,
              description: "8 to 12 crucial keyword gaps (skills, tech, certifications, concepts)",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  importance: { type: Type.STRING, description: "Must be 'high', 'medium', or 'low'" },
                  present: { type: Type.BOOLEAN, description: "Whether the keyword was identified in the resume text" }
                },
                required: ["keyword", "importance", "present"]
              }
            },
            sectionFeedback: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "Critique and improvement of visual biography summary" },
                experience: { type: Type.STRING, description: "Critique of job bullets, performance tracking, dynamic verbs" },
                skills: { type: Type.STRING, description: "Tech stack keyword coverage analysis" },
                format: { type: Type.STRING, description: "Visual design, layout structural feedback, length of files" }
              },
              required: ["summary", "experience", "skills", "format"]
            },
            improvedBullets: {
              type: Type.ARRAY,
              description: "Specific suggestions showing how experiences or project items in the resume can be optimized to match the JD",
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "Exact or approximated original sentence/bullet" },
                  suggested: { type: Type.STRING, description: "Rewritten bullet point including key target buzzwords and metrics" },
                  reason: { type: Type.STRING, description: "Explanation of why this rewrite works better for ATS matching" }
                },
                required: ["original", "suggested", "reason"]
              }
            }
          },
          required: ["score", "overallFeedback", "keywordAnalysis", "sectionFeedback", "improvedBullets"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error analyzing ATS match details:", error);
    res.status(500).json({ error: error.message || "An error occurred during ATS analysis." });
  }
});

// Start routing servers with Vite integration
async function boot() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middleware
    app.use(vite.middlewares);
  } else {
    // production mode: serve assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Resume Builder Application] running on port ${PORT}`);
  });
}

boot().catch((err) => {
  console.error("Failed to start full-stack server container:", err);
});
