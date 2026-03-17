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
        system: `You are a Senior UI/UX Developer following the Korea Design System (KRDS) naming conventions. 
        Your task is to generate a semantic button name.
        
        Formula: btn-[function]-[type]-[shape]-[size]-[state]
        - btn: fixed prefix
        - function: 'rescue' (default context)
        - type: based on colorId (primary, secondary, outline)
        - shape: based on radius (square: 0-4px, rounded: 5-12px, pill: 13px+)
        - size: based on padding/fontSize (sm, md, lg)
        - state: always 'normal' for generated result
        
        Example: btn-rescue-primary-rounded-md-normal
        Output ONLY the kebab-case string.`,
        messages: [
          { 
            role: "user", 
            content: `Button Specs: Radius ${radius}px, Padding ${paddingY}px ${paddingX}px, Font ${fontSize}px, ColorID ${colorId}.` 
          }
        ],
        temperature: 0.5
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return NextResponse.json({ name: data.content[0].text.trim() });
    }

    throw new Error("Invalid Response");

  } catch (error) {
    // KRDS 규칙에 기반한 수동 조합 안전장치 (API 실패 시)
    const shape = radius > 12 ? "pill" : radius > 4 ? "rounded" : "square";
    const size = paddingX > 20 ? "lg" : "md";
    return NextResponse.json({ 
      name: `btn-rescue-primary-${shape}-${size}-normal` 
    });
  }
}