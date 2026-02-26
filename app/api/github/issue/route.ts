import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "Missing GITHUB_TOKEN in .env.local" },
        { status: 500 }
      );
    }
// TODO mettre un username pour savoir qui a fait l'issue ?
    const newBody = `
      ## 🚨 Bug Report (Auto)

      **Date:** ${new Date().toISOString()}
      **User ID:**
      **Page:** 

      ### Error
      \`\`\`
      ${body}
      \`\`\`

      ---
      [created-by-my-app]
      `

    const response = await fetch(
      "https://api.github.com/repos/" + process.env.GITHUB_REPO + "/issues", // ⚠️ adapte si besoin
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          title,
          body: newBody,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("GitHub error:", data);
      return NextResponse.json(data, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}