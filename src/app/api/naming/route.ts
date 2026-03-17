import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. 데이터 가져오기
    const { radius, paddingX, paddingY, fontSize, colorId } = await req.json();

    // 2. OpenAI 라이브러리 대신 직접 호출 (빌드 에러 방지)
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
            content: "You are a design naming expert. Output only one kebab-case name for a button." 
          },
          { 
            role: "user", 
            content: `Radius: ${radius}, Padding: ${paddingY}x${paddingX}, Color: ${colorId}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    // 만약 API 키 에러가 나더라도 '가짜 이름'을 줘서 에러를 막음
    const aiName = data.choices?.[0]?.message?.content?.trim() || "Rescue-Button-Classic";

    return NextResponse.json({ name: aiName });

  } catch (error) {
    console.error("Build safe error handling:", error);
    // 에러 발생 시에도 정상 응답을 줘서 프론트엔드가 멈추지 않게 함
    return NextResponse.json({ name: "Custom-UI-Button" });
  }
}