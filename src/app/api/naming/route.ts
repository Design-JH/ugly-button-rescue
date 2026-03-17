import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { radius, paddingX, paddingY, fontSize, colorId } = await req.json();

    // Anthropic(Claude) API 호출 방식으로 변경
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OPENAI_API_KEY || "", // 이름은 그대로 써도 값만 Anthropic이면 됩니다.
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 20,
        messages: [
          { 
            role: "user", 
            content: `Generate one stylish kebab-case name for a button: Radius ${radius}px, Padding ${paddingY}x${paddingX}, Color ${colorId}.` 
          }
        ],
      }),
    });

    const data = await response.json();
    const aiName = data.content?.[0]?.text?.trim() || "Rescue-Button";

    return NextResponse.json({ name: aiName });
  } catch (error) {
    return NextResponse.json({ name: "Rescue-Custom-Btn" });
  }
}