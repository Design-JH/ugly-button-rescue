import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { radius, paddingX, paddingY, fontSize, colorId } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.OPENAI_API_KEY || "", 
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 100,
        system: "You are a Senior UI Developer following KRDS naming conventions. Formula: btn-[function]-[type]-[shape]-[size]-[state]. Output ONLY the kebab-case string.",
        messages: [
          { 
            role: "user", 
            content: `Specs: Radius ${radius}px, Padding ${paddingY}px ${paddingX}px, Font ${fontSize}px, ColorID ${colorId}.` 
          }
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return NextResponse.json({ name: data.content[0].text.trim() });
    }

    // 데이터 구조가 예상과 다를 때 실행될 안전장치
    return NextResponse.json({ name: `btn-rescue-primary-rounded-md-normal` });

  } catch (error) {
    // 에러 발생 시(API 실패 포함) 실행될 최후의 보루
    return NextResponse.json({ name: "btn-rescue-action-normal-md-default" });
  }
}