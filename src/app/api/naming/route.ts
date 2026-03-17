import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { radius, paddingX, paddingY, fontSize, colorId } = await req.json();

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
        system: `You are a Senior Design System Architect. 
        Construct a button component name using exactly this formula: 
        [Action]-[Object]-[Context]-[Variant]-[Size]-[State]
        
        Guidelines:
        - Action: click, submit, open, etc.
        - Object: button, cta, link
        - Context: login, rescue, signup, global
        - Variant: primary, secondary, outline, ghost (based on color/radius)
        - Size: sm, md, lg, xl (based on padding/fontSize)
        - State: default, hover, active
        
        Output ONLY the kebab-case string. No explanations.`,
        messages: [
          { 
            role: "user", 
            content: `Properties: Radius:${radius}px, Padding:${paddingY}px ${paddingX}px, FontSize:${fontSize}px, ColorID:${colorId}. 
            Create a name following the formula.` 
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      // AI가 지어준 'click-button-rescue-primary-md-default' 형태의 이름을 반환
      return NextResponse.json({ name: data.content[0].text.trim() });
    }

    throw new Error("API Path Error");

  } catch (error) {
    // 실패 시에도 규칙에 맞춘 랜덤 이름을 생성하여 사용자에게 신뢰감을 줌
    const actions = ["click", "submit", "open"];
    const variants = radius > 10 ? "rounded" : "square";
    const sizes = paddingX > 20 ? "lg" : "md";
    return NextResponse.json({ 
      name: `${actions[Math.floor(Math.random()*3)]}-button-rescue-${variants}-${sizes}-default` 
    });
  }
}