import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { radius, paddingX, paddingY, fontSize, colorId } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OPENAI_API_KEY || "", // Vercel에 등록된 sk-ant-... 키
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 50,
        system: "You are a professional Design System Engineer. Your task is to name a button component based on its CSS properties. Output only the component name in kebab-case, without any extra text or quotes.",
        messages: [
          { 
            role: "user", 
            content: `Generate a unique, creative, and professional name for a button with: Border-Radius: ${radius}px, Padding: ${paddingY}px ${paddingX}px, FontSize: ${fontSize}px, ColorID: ${colorId}.` 
          }
        ],
        temperature: 0.9, // 값을 높여서 매번 다른 이름이 나오도록 유도합니다.
      }),
    });

    const data = await response.json();
    
    // 에러 발생 시 로그 확인용 (Vercel Logs에서 확인 가능)
    if (data.error) {
      console.error("Anthropic API Error Details:", data.error);
      throw new Error(data.error.message);
    }

    if (data.content && data.content[0]) {
      const aiName = data.content[0].text.trim();
      return NextResponse.json({ name: aiName });
    }

    throw new Error("Invalid response structure");

  } catch (error: any) {
    console.error("Final Rescue Catch:", error);
    // 만약 에러가 나더라도 매번 똑같은 이름이 나오지 않게 랜덤 숫자를 붙입니다.
    const fallbackNames = ["dynamic-action", "custom-ui", "救助-button", "rescue-element"];
    const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
    return NextResponse.json({ name: `${randomName}-${Math.floor(Math.random() * 1000)}` });
  }
}