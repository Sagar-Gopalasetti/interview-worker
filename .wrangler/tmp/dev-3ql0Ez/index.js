var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var JSON_CT = "application/json; charset=utf-8";
var GROQ_CHAT = "https://api.groq.com/openai/v1/chat/completions";
var DEEPSEEK_CHAT = "https://api.deepseek.com/v1/chat/completions";
var MODELS = [
  "llama-3.1-8b-instant",
  "deepseek-chat",
  "llama-3.3-70b-versatile"
];
var COVER_LETTER_TEMPLATE = `
You are an expert cover letter writer at a top recruiting firm specializing in ATS optimization. 
Your task is to craft a compelling cover letter that strictly uses information from the provided 
resume to match the job description requirements.

Resume:
{resume}

Job Description:
{job_description}

User's Custom Requirements:
{user_custom_prompt}

Follow these precise guidelines:

1. OPENING PARAGRAPH:
- Begin with a strong introduction referencing the specific job title
- Mention how you discovered the position
- Include a brief (1-2 sentence) summary of your most relevant qualification from the resume

2. BODY PARAGRAPHS (2-3):
- Each paragraph must reference specific accomplishments from the resume
- Format: Situation -> Action -> Result
- Use metrics and achievements mentioned in the resume
- Connect each point directly to job requirements
- Only include information present in the resume

3. CLOSING PARAGRAPH:
- Summarize why you're an excellent fit based on resume qualifications
- Express enthusiasm for the opportunity
- Include clear call to action

STRICT REQUIREMENTS:
- Divide the cover letter into paragraphs 
- Do not bold or italicize any text not even the headings, subject line, names, salutations, or closing or any other text
- Must use formal business letter format
- Every claim must be verifiable from the resume
- Use active voice and professional tone
- Avoid generic statements that could apply to any candidate

PROHIBITED:
- Adding skills or experiences not mentioned in the resume
- Generic phrases or clich\xE9s
- Bolding or italicizing text 
- Unsubstantiated claims
- Personal information not related to professional qualifications
`;
var RESUME_OPTIMIZATION_TEMPLATE = `
You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. 
Your task is to analyze the provided resume section against the job description and provide detailed, actionable 
feedback.

Resume Section to Analyze: {resume_section}
Job Description: {job_description}
Custom User Prompt (if any): {user_custom_prompt}

Analysis Steps for Each Section:

SECTION 1 - NEW POINTS SUGGESTIONS: Suggest atleast 6 new points covering all the subsections of the resume section. 
1. Gap Analysis:
   - Compare job requirements against current resume content
   - Identify missing critical experiences
   - Note unexpressed relevant achievements

2. Point Generation:
   - Focus on gaps identified in job requirements
   - Leverage candidate's background for relevant examples
   - Ensure alignment with industry standards
   - Include specific metrics and technical details

3. Validation:
   - Verify each suggestion is realistic given the experience
   - Ensure alignment with job requirements
   - Confirm measurable impact inclusion
   - Check technical keyword relevance

SECTION 2 - KEYWORD ANALYSIS:
1. Keyword Extraction:
   First, extract ALL important keywords from the job description that are valuable for ATS/Recruiter evaluation:
   - Must extract ALL technical skills and technologies mentioned
   - ALL programming languages and frameworks
   - ALL tools, platforms, and software
   - ALL methodologies and processes
   - ALL soft skills that appear multiple times or are emphasized
   - ALL industry-specific terminology
   - ALL required certifications
   - ANY keywords that appear to be emphasized or repeated in the job description
   
2. Comprehensive Matching Process:
   For EACH extracted keyword:
   - Perform case-insensitive exact match check in the resume section
   - Mark as "Yes" if present in ANY form
   - Mark as "No" if absent
   - You must include EVERY important keyword in the output, regardless of whether it's present or not
   
3. Recommendation Formation:
   For EACH "No" keyword:
   - Create a specific bullet point showing how to incorporate the keyword
   - Identify the most relevant subsection for placement
   - Explain why this placement makes sense
   - Ensure the recommendation aligns with the candidate's actual experience
   
IMPORTANT OUTPUT FORMATTING INSTRUCTIONS:
1. Return ONLY pure JSON without any additional formatting characters
2. Do NOT include \`\`\`json, \\n, or any other markdown/formatting syntax
3. The response should start directly with the opening curly brace
4. Ensure proper JSON escaping for any special characters
5. Do not add any text before or after the JSON object

Format your response as a clean JSON object:
{{
    "analysis_results": {{
        "section_1": {{
            "title": "Suggested New Points",
            "suggestions": [
                {{
                    "bullet_point": "<detailed point with metrics and technical keywords>",
                    "rationale": "<specific gap or requirement addressed>",
                    "alignment": "<relevant job requirements and how this point meets them and where it can be placed in the resume>"
                }}
            ]
        }},
        "section_2": {{
            "title": "Keyword Analysis",
            "keywords": [
                {{
                    "key_term": "<extract EVERY important keyword from job description>",
                    "present_in_resume": "<strictly Yes or No>",
                    "recommendation": "<Required if No: provide specific bullet point for incorporating this keyword>",
                    "placement_reasoning": "<Required if No: specify exact subsection and detailed reasoning for placement>"
                }}
            ]
        }}
    }}
}}

Additional Requirements for Section 3:
1. Include ALL important keywords from job description, not just matches
2. Ensure "present_in_resume" is ALWAYS either "Yes" or "No"
3. For "No" matches, ALWAYS provide both recommendation and placement_reasoning
4. For "Yes" matches, set recommendation and placement_reasoning to "Already present in resume"
5. Keywords should be listed in order of importance/frequency in job description
6. Include technical terms, soft skills, and methodologies
7. Do not skip any important keyword, even if it seems minor

Critical and Strict Requirements:
1. Start response directly with {{ and end with }}
2. No markdown formatting (\`\`\`), newline characters (\\n), or other special formatting
3. No additional text outside the JSON object
4. Ensure all JSON syntax is valid and properly nested
5. Use proper escaping for quotes and special characters within strings
`;
var FUNC2_PROMPT_TEMPLATE = `
You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. 
Your task is to analyze the provided resume section against the job description and provide detailed, actionable 
feedback.

Resume Section to Analyze: {resume_section}
Job Description: {job_description}
Custom User Prompt (if any): {user_custom_prompt}

Analysis Steps for Each Section:

SECTION 1 - EXISTING POINTS OPTIMIZATION:
1. Mandatory Subsection Detection (CRITICAL):
   a. First pass - Identification:
      - Scan for ALL experience entries containing:
        * Company name AND
        * Role/title AND
        * Date range
      - Create a LIST of ALL detected experiences
      - Count total number of experiences found
   
   b. Second pass - Validation:
      - Compare detected experiences against original text
      - Confirm NO experiences were missed
      - Record exact count of bullet points per experience
      - REQUIRE minimum 4 distinct subsections for typical resume
      - Flag if fewer subsections found than exist in input

   c. Quality Check:
      - Assert all date ranges are accounted for
      - Verify no content exists outside detected subsections
      - Confirm all experiences have associated bullet points

2. Comprehensive Analysis Requirements:
   For EACH subsection identified above:
   - Must process ALL bullet points
   - Must analyze EVERY subsection detected
   - Cannot skip or combine subsections
   - Must maintain chronological order
   - Must process most recent to oldest experience

3. For each bullet point in EVERY subsection:
   Analyze and improve based on:
   - Quantifiable metrics presence and effectiveness
   - Impact demonstration (business value, outcomes)
   - Action verb strength and specificity
   - Technical keyword inclusion and relevance
   - Alignment with job requirements

4. For bullet points needing improvement:
   - Identify specific weaknesses
   - Add missing metrics where possible
   - Strengthen action verbs
   - Enhance technical detail
   - Improve alignment with job requirements

5. For effective bullet points:
   - Document why they work well
   - Note specific elements that make them strong

IMPORTANT OUTPUT FORMATTING INSTRUCTIONS:
1. Return ONLY pure JSON without any additional formatting characters
2. Do NOT include \`\`\`json, \\n, or any other markdown/formatting syntax
3. The response should start directly with the opening curly brace
4. Ensure proper JSON escaping for any special characters
5. Do not add any text before or after the JSON object

Format your response as a clean JSON object:
{{
    "analysis_results": {{
        "section_1": {{
            "title": "Existing Points Optimization",
            "subsections": [
                {{
                    "subsection_name": "<company/role name>",
                    "points": [
                        {{
                            "original": "<original bullet point>",
                            "improved": "<enhanced version with metrics, stronger verbs, and job alignment>",
                            "reasoning": "<specific improvements made and their value>"
                        }}
                    ],
                    "unchanged_points": [
                        {{
                            "point": "<bullet point>",
                            "assessment": "<specific elements that make it effective>"
                        }}
                    ]
                }}
            ]
        }}
    }}
}}
`;
var INTERVIEW_PREP_TEMPLATE = `
You are a senior interview coach who has helped 1000+ candidates successfully prepare for 
interviews at top companies. Create a comprehensive interview preparation guide.

This is candidate's Resume: 
{resume}

This is the Job Description:
{job_description}

Interview Context:
- Interviewer: {interviewer_role} - {interviewer_profile}
- Duration: {interview_duration} minutes
- Format: {interview_description}
- User's Custom Prompt: {user_custom_prompt}

You will analyze the provided information and generate a response in the specified JSON format below.
Do not include any text, prefixes, or explanations outside the JSON structure.
Ensure the response is a single, valid JSON object.

PREPARATION FRAMEWORK:
1. STRATEGIC ANALYSIS
First analyze:
A. Experience Alignment
   - Map resume experiences to job requirements
   - Identify potential experience gaps
   - List strongest achievements relevant to role
B. Interview Context Analysis
   - Interviewer's perspective based on their role
   - Time management strategy for {interview_duration} minutes
   - Critical areas based on interview type

2. PREPARATION GUIDE
Structure the preparation into:
A. Technical Preparation (if applicable)
   - Core concepts to review
   - Practice exercises
   - System design considerations
   - Coding language specifics
B. Experience Preparation
   - Key projects to highlight
   - Metrics to memorize
   - Challenge-solution stories
   - Leadership examples
C. Company/Role Preparation
   - Industry trends
   - Company background
   - Role-specific knowledge
   - Expected challenges

3. QUESTION PREDICTION & PREPARATION
Generate three types of questions:
A. Guaranteed Questions (80% likelihood)
   - Based on job requirements
   - Based on resume experiences
   - Standard for interview type
B. Likely Questions (50% likelihood)
   - Based on interviewer's role
   - Based on industry trends
   - Based on company challenges
C. Preparation Questions
   - Technical concepts to review
   - Projects to prepare discussing
   - Metrics to remember
4. ANSWER FRAMEWORKS
For each predicted question:
A. Structure:
   - Opening statement
   - Key points to cover
   - Supporting evidence from resume
   - Conclusion/impact
B. Delivery Notes:
   - Time allocation
   - Key phrases to use
   - Data points to include
   - Follow-up considerations

OUTPUT:
{
  "strategic_analysis": {
    "experience_alignment": {
      "matching_experiences": [
        {
          "requirement": "",
          "matching_experience": "",
          "strength_level": ""
        }
      ],
      "potential_gaps": [
        {
          "gap": "",
          "mitigation_strategy": ""
        }
      ],
      "key_achievements": [
        {
          "achievement": "",
          "relevance": ""
        }
      ]
    },
    "interview_context": {
      "interviewer_perspective": {
        "key_interests": [],
        "likely_focus_areas": []
      },
      "time_management": {
        "introduction": 0,
        "main_discussion": 0,
        "questions": 0,
        "closing": 0
      },
      "critical_areas": []
    }
  },
  "preparation_guide": {
    "technical_preparation": {
      "core_concepts": [
        {
          "concept": "",
          "importance": "",
          "review_materials": []
        }
      ],
      "practice_exercises": [
        {
          "topic": "",
          "recommended_problems": []
        }
      ],
      "system_design": {
        "key_considerations": [],
        "practice_scenarios": []
      }
    },
    "experience_preparation": {
      "key_projects": [
        {
          "project": "",
          "relevance": "",
          "key_points": [],
          "metrics": []
        }
      ],
      "stories": [
        {
          "category": "",
          "situation": "",
          "task": "",
          "action": "",
          "result": ""
        }
      ]
    },
    "company_preparation": {
      "industry_trends": [],
      "company_background": {
        "key_points": [],
        "recent_developments": []
      },
      "role_specific": {
        "key_responsibilities": [],
        "expected_challenges": []
      }
    }
  },
  "questions": {
    "guaranteed_questions": [
      {
        "question": "",
        "answer_framework": {
          "opening": "",
          "key_points": [],
          "evidence": [],
          "conclusion": ""
        },
        "delivery_notes": {
          "time_allocation": "",
          "key_phrases": [],
          "data_points": []
        }
      }
    ],
    "likely_questions": [
      {
        "question": "",
        "answer_framework": {
          "opening": "",
          "key_points": [],
          "evidence": [],
          "conclusion": ""
        },
        "delivery_notes": {
          "time_allocation": "",
          "key_phrases": [],
          "data_points": []
        }
      }
    ],
    "preparation_questions": {
      "technical_review": [],
      "project_discussion": [],
      "metrics_to_remember": []
    }
  }
}

IMPORTANT NOTES FOR MODEL:
1. Provide output as a pure JSON object without any prefixes, suffixes, or explanatory text
2. Strictly do not provide preambles, explanations, or additional information outside the JSON structure. 
2. Do not include 'json\\n' or any other formatting prefixes
3. Fill all fields with relevant content based on the provided information
4. Ensure arrays are properly formatted, even if empty
5. Use double quotes for all strings in JSON
6. Do not include any markdown formatting or code blocks
7. Maintain proper JSON structure and nesting
8. Remove any null or undefined values
`;
var INTERVIEW_SIM_TEMPLATE = `
You are an experienced interviewer conducting an interview. You will simulate a realistic interview based on:

Input Parameters:
- Resume: {resume} (Candidate's background and experience)
- Job Description: {job_description} (Role requirements and expectations) 
- Interview Type: {interview_type} (Style and format of interview)
- Interviewer Role: {interviewer_role} (Your role as the interviewer)
- Interviewer Profile: {interviewer_profile} (Your background and expertise)
- Interview Duration: {interview_duration} (Length of interview)
- Interview Description: {interview_description} (Specific interview guidelines)
- Custom Instructions: {user_custom_prompt} (Additional requirements)

Interview Simulation Guidelines:

1. Role Embodiment:
- Fully embody the specified interviewer role and expertise level.
- Maintain consistent personality throughout the interview.
- Consider the company culture and position requirements from Job Description.
- Follow the specified interview format and duration.

2. Question Strategy:
- Generate 12-15 strategically sequenced questions
- Begin with rapport-building questions before diving deep.
- Answer every question with a detailed and in-depth STAR response.
- Strictly include questions related to the type of interview mentioned by the user - {interview_type} 
- Keep in mind the candidate's background from Resume and the Job Description.
- Follow up on relevant points from previous answers.
- After each response, provide 3-4 follow-up questions related to the candidate's response to deepen the discussion.  

3. Response Generation:
- Create detailed candidate responses following STAR format:
 * Situation: Set the context and background
 * Task: Explain the specific challenge or responsibility
 * Action: Detail the steps taken to address the situation
 * Result: Share the outcomes and learnings
- Ensure responses demonstrate:
 * Clear problem-solving approach
 * Technical depth where appropriate
 * Leadership and teamwork skills
 * Decision-making process
- Generate 3-4 relevant follow-up questions after each response

4. Interview Focus:
- Maintain clear progression of topics
- Ensure technical depth aligns with role requirements
- Focus on real-world scenarios and examples
- Build upon previous responses for context
- Keep engagement professional and constructive

The simulation should maintain professional tone while creating a realistic interview 
environment relevant to the candidate's background and the job requirements. . Each response must strictly follow 
the STAR methodology with detailed answers.

Format your response as a JSON object with the following structure:

{
  "interview_metadata": {
    "position": string,
    "interview_type": string,
    "interviewer": string,
    "duration": string
  },
  "interview_summary": {
    "candidate_background": string,
    "job_fit_analysis": string
  },
  "interview_exchange": [
    {
      "question_number": number,
      "interviewer_question": string,
      "candidate_response": {
        "situation": string,
        "task": string,
        "action": string,
        "result": string
      },
      "potential_follow_ups": [
        string,
        string,
        string,
        string
      ]
    }
  ]
}

Generate at least 12-15 questions.
Ensure each response strictly follows STAR format with elaborate details for each component.
Include 3-4 potential follow-up questions after each response.
Generate detailed, context-aware responses that demonstrate understanding of both the 
technical and soft skills required for the position.

- Do not deviate from the JSON format. Do not give any extra output apart from a valid JSON. 
- Do not include any markdown or code blocks.
- Do not include any additional text or explanations outside the JSON structure.

Critical Requirements:
1. Start response directly with { and end with }
2. No markdown formatting (\`\`\`), newline characters (\\n), or other special formatting
3. No additional text outside the JSON object
4. Ensure all JSON syntax is valid and properly nested
5. Use proper escaping for quotes and special characters within strings
6. The response should start directly with the opening curly brace
7. Do not add any text before or after the JSON object
8. Start response directly with { and end with }
`;
function render(tpl, vars) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
__name(render, "render");
async function chat(env, modelName, messages, temperature = 0.3, max_tokens = 8e3) {
  if (modelName === "deepseek-chat") {
    if (!env.DEEPSEEK_API_KEY) throw new Error("DeepSeek requested but DEEPSEEK_API_KEY is not set.");
    const resp2 = await fetch(DEEPSEEK_CHAT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ model: "deepseek-chat", temperature, max_tokens, messages })
    });
    if (!resp2.ok) throw new Error(`DeepSeek error ${resp2.status}: ${await resp2.text()}`);
    const data2 = await resp2.json();
    return data2?.choices?.[0]?.message?.content ?? "(No content)";
  }
  if (!env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set.");
  const resp = await fetch(GROQ_CHAT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.GROQ_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ model: modelName, temperature, max_tokens, messages })
  });
  if (!resp.ok) throw new Error(`Groq error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content ?? "(No content)";
}
__name(chat, "chat");
async function asJson(request) {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error("Use application/json");
  return await request.json();
}
__name(asJson, "asJson");
function requireFields(obj, keys) {
  const missing = keys.filter((k) => obj[k] === void 0 || obj[k] === null || obj[k] === "");
  if (missing.length) throw new Error(`Missing: ${missing.join(", ")}`);
}
__name(requireFields, "requireFields");
function corsHeaders(env) {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", env.ALLOWED_ORIGIN || "*");
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "86400");
  return h;
}
__name(corsHeaders, "corsHeaders");
function withCORS(env, res) {
  const out = new Response(res.body, res);
  corsHeaders(env).forEach((v, k) => out.headers.set(k, v));
  return out;
}
__name(withCORS, "withCORS");
function ok(env, data, status = 200) {
  return withCORS(env, new Response(JSON.stringify(data), { status, headers: { "content-type": JSON_CT } }));
}
__name(ok, "ok");
function err(env, status, data) {
  return withCORS(env, new Response(JSON.stringify(data), { status, headers: { "content-type": JSON_CT } }));
}
__name(err, "err");
async function extractResumeSection(env, rawResume, sectionName) {
  const prompt = `
Extract the exact contents of the '${sectionName}' section from the following resume text. 
Do not modify, paraphrase, or summarize the content after extracting it. 
Ensure the output is an exact match to the text in the specified section.

Resume Text:
${rawResume}

Output only the content from the '${sectionName}' section.
  `.trim();
  const content = await chat(
    env,
    "llama-3.3-70b-versatile",
    [
      { role: "system", content: "You are a precise text extractor." },
      { role: "user", content: prompt }
    ],
    0,
    1200
  );
  return (content || "").trim();
}
__name(extractResumeSection, "extractResumeSection");
async function optimizeExistingPoints(env, resume_section, job_description, user_custom_prompt, model_name) {
  const rendered = render(FUNC2_PROMPT_TEMPLATE, {
    resume_section,
    job_description,
    user_custom_prompt: user_custom_prompt || "(none)"
  });
  return await chat(
    env,
    model_name,
    [
      {
        role: "system",
        content: "You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching."
      },
      { role: "user", content: rendered }
    ],
    0.3,
    8e3
  );
}
__name(optimizeExistingPoints, "optimizeExistingPoints");
var src_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return withCORS(env, new Response(null, { status: 204 }));
    const { pathname } = new URL(request.url);
    try {
      if (request.method === "GET" && pathname === "/") {
        return ok(env, { message: "Hello, World!" });
      }
      if (request.method === "GET" && pathname === "/api/models") {
        return ok(env, { models: MODELS });
      }
      if (request.method === "POST" && pathname === "/api/generate-cover-letter") {
        const body = await asJson(request);
        requireFields(body, ["resume", "job_description", "model_name"]);
        const rendered = render(COVER_LETTER_TEMPLATE, {
          resume: body.resume,
          job_description: body.job_description,
          user_custom_prompt: body.user_custom_prompt || "(none)"
        });
        const content = await chat(
          env,
          body.model_name,
          [
            {
              role: "system",
              content: "You are an expert cover letter writer at a top recruiting firm specializing in ATS optimization."
            },
            { role: "user", content: rendered }
          ],
          // use slightly higher temp for prose if you want; keeping 0.3 default
          0.3,
          8e3
        );
        return ok(env, { cover_letter: content });
      }
      if (request.method === "POST" && pathname === "/api/optimize-resume") {
        const body = await asJson(request);
        requireFields(body, ["resume", "job_description", "model_name", "resume_section"]);
        const sectionText = await extractResumeSection(env, body.resume, body.resume_section);
        const func2Json = await optimizeExistingPoints(
          env,
          sectionText,
          body.job_description,
          body.user_custom_prompt,
          body.model_name
        );
        const rendered = render(RESUME_OPTIMIZATION_TEMPLATE, {
          resume_section: sectionText,
          job_description: body.job_description,
          user_custom_prompt: body.user_custom_prompt || "(none)"
        });
        const mainJson = await chat(
          env,
          body.model_name,
          [
            {
              role: "system",
              content: "You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching."
            },
            { role: "user", content: rendered }
          ],
          0.3,
          8e3
        );
        return ok(env, {
          Resume_Optimization: func2Json,
          // mirrors your Python "optimized_resume_points"
          Remaining_Results: mainJson,
          // mirrors your Python "response.content"
          section_extracted: sectionText
          // helpful for debugging
        });
      }
      if (request.method === "POST" && pathname === "/api/interview-prep") {
        const body = await asJson(request);
        requireFields(body, [
          "resume",
          "job_description",
          "model_name",
          "interviewer_role",
          "interviewer_profile",
          "interview_duration",
          "interview_description"
        ]);
        const rendered = render(INTERVIEW_PREP_TEMPLATE, {
          resume: body.resume,
          job_description: body.job_description,
          interviewer_role: body.interviewer_role,
          interviewer_profile: body.interviewer_profile,
          interview_duration: body.interview_duration,
          interview_description: body.interview_description,
          user_custom_prompt: body.user_custom_prompt || "(none)"
        });
        const content = await chat(
          env,
          body.model_name,
          [
            {
              role: "system",
              content: "You are a senior interview coach. Provide targeted, JSON-only prep: question bank, key themes, and concise answer frameworks."
            },
            { role: "user", content: rendered }
          ],
          0.3,
          8e3
        );
        return ok(env, { interview_prep: content });
      }
      if (request.method === "POST" && pathname === "/api/interview-sim") {
        const body = await asJson(request);
        requireFields(body, [
          "resume",
          "job_description",
          "interview_type",
          "interviewer_role",
          "interviewer_profile",
          "interview_duration",
          "interview_description",
          "model_name"
        ]);
        const rendered = render(INTERVIEW_SIM_TEMPLATE, {
          resume: body.resume,
          job_description: body.job_description,
          interview_type: body.interview_type,
          interviewer_role: body.interviewer_role,
          interviewer_profile: body.interviewer_profile,
          interview_duration: body.interview_duration,
          interview_description: body.interview_description,
          user_custom_prompt: body.user_custom_prompt || "(none)"
        });
        const content = await chat(
          env,
          body.model_name,
          [
            {
              role: "system",
              content: "You are an experienced interviewer. Generate JSON-only simulation with agenda, tailored Qs, STAR responses, follow-ups, notes."
            },
            { role: "user", content: rendered }
          ],
          0.3,
          8e3
        );
        return ok(env, { interview_sim: content });
      }
      return err(env, 404, { error: "Not found" });
    } catch (e) {
      return err(env, 500, { error: e?.message || String(e) });
    }
  }
};

// ../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-AyQuKx/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-AyQuKx/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
