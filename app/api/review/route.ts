import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, language, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required. Please add your Gemini API key in Settings." },
        { status: 400 }
      );
    }

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "No code provided for review." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and identify issues.

For each issue found, return a JSON object with these fields:
- "title": A short, descriptive title for the issue (e.g., "SQL Injection Vulnerability")
- "category": One of "Security", "Bug", "Best Practice", "Performance", "Code Style"
- "severity": One of "critical", "warning", "info"
- "line": The approximate line number where the issue occurs (number)
- "description": A clear explanation of the problem
- "suggestion": The corrected code snippet that fixes the issue

Return ONLY a valid JSON array of issues. If no issues are found, return an empty array [].
Do NOT include any markdown formatting, code fences, or explanatory text outside the JSON array.

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON from the response
    let issues;
    try {
      // Try to extract JSON from the response (handle cases where model wraps in markdown)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        issues = JSON.parse(jsonMatch[0]);
      } else {
        issues = [];
      }
    } catch {
      console.error("Failed to parse Gemini response:", text);
      issues = [];
    }

    return NextResponse.json({ issues });
  } catch (error: unknown) {
    console.error("Review API error:", error);

    // Handle specific API errors with user-friendly messages
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errMsg.includes("429") || errMsg.includes("Too Many Requests") || errMsg.includes("quota")) {
      return NextResponse.json(
        { error: "⚠️ API quota exceeded. You've hit the Gemini free-tier rate limit. Please wait a minute and try again, or upgrade your plan at https://ai.google.dev." },
        { status: 429 }
      );
    }

    if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("401")) {
      return NextResponse.json(
        { error: "❌ Invalid API key. Please check your Gemini API key in Settings." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to review code: ${errMsg}` },
      { status: 500 }
    );
  }
}
