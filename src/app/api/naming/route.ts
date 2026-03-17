import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { radius, paddingX, paddingY, fontSize, colorId } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OPENAI_API_KEY || "", // Vercel에 등록된 sk-ant-... 키 사용
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 100,
        messages: [
          { 
            role: "user", 
            content: `Generate one stylish kebab-case name for a button component with these specs: Radius ${radius}px, Padding ${paddingY}x${paddingX}, Color ${colorId}. Output only the name.` 
          }
        ],
      }),
    });

    const data = await response.json();
    
    // Anthropic은 응답이 'content' 배열 안에 들어있습니다.
    // 이 부분이 어긋나면 백업 이름이 나옵니다.
    if (data.content && data.content.length > 0) {
      const aiName = data.content[0].text.trim();
      return NextResponse.json({ name: aiName });
    }

    // 혹시라도 API 응답 구조가 예상과 다를 경우 로그를 찍고 백업 이름 반환
    console.log("Anthropic Response Structure:", data);
    return NextResponse.json({ name: "Creative-Button-01" });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ name: "Rescue-Custom-Action" });
  }
}