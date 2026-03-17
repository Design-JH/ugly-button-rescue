import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { radius, paddingX, paddingY, fontSize, colorId } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OPENAI_API_KEY || "", // Vercel의 그 sk-ant- 키를 사용
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 50,
        // Anthropic은 system 메시지를 별도 필드에 넣는 것을 선호합니다.
        system: "You are an expert Design System Architect. Based on the button's properties, suggest a professional, creative, and semantic component name in kebab-case. Output ONLY the name.",
        messages: [
          { 
            role: "user", 
            content: `Properties: Radius ${radius}px, Padding ${paddingY}px ${paddingX}px, FontSize ${fontSize}px, Color: ${colorId}. Give me a unique name.` 
          }
        ],
        temperature: 0.8
      }),
    });

    const data = await response.json();

    // 여기서 진짜 AI가 준 이름을 꺼내옵니다.
    if (data.content && data.content[0]) {
      const aiName = data.content[0].text.trim();
      return NextResponse.json({ name: aiName });
    }

    // 에러 발생 시 로그를 남겨서 범인을 찾습니다.
    console.error("API Response Error:", data);
    throw new Error("Failed to get response from AI");

  } catch (error) {
    // 만약 또 실패하면, 적어도 멋진 랜덤 이름이라도 나오게 합니다.
    const fallbackPrefix = ["modern", "elegant", "bold", "slick", "minimal"];
    const fallbackSuffix = ["cta", "action", "trigger", "element"];
    const randomName = `${fallbackPrefix[Math.floor(Math.random() * 5)]}-${fallbackSuffix[Math.floor(Math.random() * 4)]}`;
    return NextResponse.json({ name: randomName });
  }
}