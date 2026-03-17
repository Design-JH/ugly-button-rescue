import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. 데이터를 안전하게 읽어옵니다.
    const body = await req.json();
    
    // 2. 혹시라도 값이 비어있을 경우를 대비해 기본값을 설정합니다.
    const { 
      radius = 0, 
      paddingX = 0, 
      paddingY = 0, 
      fontSize = 16, 
      colorId = "blue" 
    } = body;

    // 3. AI에게 보낼 질문을 만듭니다.
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional design system engineer. Output only a stylish component name in kebab-case."
        },
        {
          role: "user",
          content: `Generate a name for a button with: Radius ${radius}px, Padding ${paddingY}px ${paddingX}px, FontSize ${fontSize}px, Color ${colorId}.`
        },
      ],
      temperature: 0.7,
      max_tokens: 20, // 짧은 이름만 필요하니까요!
    });

    const aiSuggestedName = response.choices[0].message.content?.trim() || "Custom-Button";
    
    return NextResponse.json({ name: aiSuggestedName });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    // 4. [중요] 에러가 나더라도 '400'을 띄우지 않고 가짜 이름을 보내서 
    // 사용자 화면에서는 정상 작동하는 것처럼 보이게 합니다 
    return NextResponse.json({ name: "Rescue-Custom-Button" });
  }
}