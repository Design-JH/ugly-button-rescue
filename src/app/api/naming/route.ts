import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. 프론트엔드에서 보낸 데이터 안전하게 파싱
    const body = await req.json();
    const { radius, paddingX, paddingY, fontSize, colorId } = body;

    // 2. OpenAI API 호출 (규격에 딱 맞게 수정된 버전)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a professional design system engineer. Return ONLY one stylish kebab-case name for a button." 
          },
          { 
            role: "user", 
            content: `Button spec: Radius ${radius}px, Padding ${paddingY}x${paddingX}, FontSize ${fontSize}, Color ${colorId}. Name it.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 20
      }),
    });

    const data = await response.json();

    // 3. 만약 OpenAI 측에서 400 에러 등을 응답했을 경우를 대비한 안전장치
    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return NextResponse.json({ name: "Rescue-Custom-Btn" });
    }

    const aiName = data.choices?.[0]?.message?.content?.trim() || "Rescue-Action-Btn";

    return NextResponse.json({ name: aiName });

  } catch (error) {
    console.error("Critical Error:", error);
    // 어떤 상황에서도 에러 메시지 대신 '기본 이름'이라도 보내서 400을 방지함
    return NextResponse.json({ name: "Rescue-Ready-Btn" });
  }
}