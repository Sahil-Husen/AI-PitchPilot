import axios from "axios";
import EmailHistory from "../models/EmailHistory.js";
import dotenv from "dotenv";
dotenv.config();

const generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (typeof prompt !== "string") {
      return res.status(400).json({ message: "Prompt must be a string" });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({ message: "Prompt cannot be empty" });
    }

    if (prompt.length > 2000) {
      return res
        .status(400)
        .json({ message: "Prompt cannot exceed 2000 characters" });
    }

    // Call Groq API (Free tier - No quota issues!)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({ message: "AI service is not configured" });
    }

    const systemPrompt = `You are an expert job outreach strategist who crafts HIGH-CONVERTING cold emails.

====================================================
MOST IMPORTANT RULE
====================================================

The user's input is the SINGLE SOURCE OF TRUTH.
Read it carefully word by word.
Do NOT ignore any detail the user provides.
Do NOT replace user's intent with generic job-seeking templates.

Examples of different intents:
- "email to HR for campus placement drive" → Write on BEHALF of a COLLEGE, inviting company to campus
- "apply for SDE role at Google" → Write as a JOB SEEKER applying to Google
- "follow up with client about project" → Write as a PROFESSIONAL following up

DETECT the user's intent first — then generate accordingly.

====================================================
INTENT DETECTION (STRICT)
====================================================

Before generating, identify:

1. WHO is writing? (job seeker / college / company / freelancer)
2. WHO is the recipient? (HR / recruiter / client / manager)
3. WHAT is the purpose? (job application / campus drive / follow-up / collaboration)
4. WHAT details did user provide? (name, company, role, skills, college name, etc.)

====================================================
OUTPUT FORMAT (STRICT)
====================================================

Return ONLY valid JSON — no markdown, no explanation:

{
  "subject": "",
  "emailBody": "",
  "linkedInDM": "",
  "followUpEmail": ""
}

====================================================
SUBJECT LINE RULES
====================================================

- 6–9 words
- Must reflect the ACTUAL purpose from user input
- Confident and specific

====================================================
EMAIL BODY RULES
====================================================

- 60–90 words
- Must match user's ACTUAL intent
- Structure based on purpose:

  IF job application:
    Line 1: Observation about company/role
    Line 2: Challenge the company faces
    Line 3-4: Candidate's experience and strengths
    Line 5: Concrete achievement
    Line 6: CTA
    Line 7: Sign-off

  IF campus placement drive:
    Line 1: Introduction of college/institution
    Line 2: Why this company fits for campus drive
    Line 3-4: College's strengths (students, placements, courses)
    Line 5: What company will benefit
    Line 6: CTA (visit campus / schedule call)
    Line 7: Sign-off with sender's name/designation

  IF collaboration/other:
    Adapt structure to match the purpose

Tone: Professional, confident, not desperate

====================================================
SMART ASSUMPTION RULES
====================================================

Only assume when user does NOT provide a detail:

| Missing Info       | Assumption                              |
|--------------------|-----------------------------------------|
| Sender name        | Use "I" or "We"                         |
| College name       | "Our institution"                       |
| Company name       | "Your organization"                     |
| Experience         | 2+ years (only for job applications)    |
| Achievement        | Based on context                        |

====================================================

REMEMBER:
- User said "campus placement drive" → Write FOR A COLLEGE inviting company
- User said "apply for job" → Write AS A JOB SEEKER
- NEVER mix up these two contexts
- Always prioritize user's exact words over assumptions
Return ONLY valid JSON.`;

    const fullPrompt = `${systemPrompt}

====================================================
USER INPUT
====================================================
"${prompt.trim()}"

Based on above input, generate a HIGH-CONVERTING cold email.
Extract all details from the input.
Only assume what is missing.
Return ONLY valid JSON:
{
  "subject": "...",
  "emailBody": "...",
  "linkedInDM": "...",
  "followUpEmail": "..."
}`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    // Parse the Groq response
    if (
      !aiResponse.data.choices ||
      !aiResponse.data.choices[0] ||
      !aiResponse.data.choices[0].message
    ) {
      throw new Error("Invalid response from Groq API");
    }

    const generatedText = aiResponse.data.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    let parsedResponse;

    try {
      parsedResponse = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : JSON.parse(generatedText);
    } catch (parseError) {
      console.error(
        "JSON parse error:",
        parseError,
        "Generated text:",
        generatedText,
      );
      return res.status(500).json({
        message: "Failed to parse AI response",
        error: "The AI generated invalid JSON. Please try again.",
      });
    }

    const emailData = {
      subject: parsedResponse.subject || "New Opportunity",
      emailBody: parsedResponse.emailBody || "",
      linkedInDm: parsedResponse.linkedInDM || "",
      followUpEmail: parsedResponse.followUpEmail || "",
    };

    // Validate response data
    if (!emailData.subject || !emailData.emailBody) {
      return res.status(500).json({
        message: "AI generated incomplete email data. Please try again.",
      });
    }

    // Save to history
    const historyEntry = await EmailHistory.create({
      user: req.user._id, // ← userid → user
      prompt: prompt.trim(),
      subject: emailData.subject,
      emailBody: emailData.emailBody,
      linkedInDm: emailData.linkedInDm, // ← DM → Dm
      followUpEmail: emailData.followUpEmail,
    });

    res.status(200).json(historyEntry);
  } catch (error) {
    console.error(
      "AI Generation Error:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Too many requests. Please wait a moment before trying again.",
        error: "Rate limit exceeded",
      });
    }

    res.status(500).json({
      message: "Failed to generate email",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      history: history,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch the history",
      error: error.message,
    });
  }
};

export { generateEmail, getHistory };
