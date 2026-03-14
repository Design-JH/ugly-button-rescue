import { NextResponse } from 'next/server';



export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 해커톤 주최 측이 제공한 Anthropic 키 확인
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("API 키가 .env 파일에 없습니다!");
      return NextResponse.json({ error: 'API 키 누락' }, { status: 400 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5', // 해커톤 전용 모델명
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: `너는 시니어 프론트엔드 개발자야. 다음 디자인 토큰 값을 바탕으로 가장 직관적인 BEM 또는 Tailwind 스타일의 컴포넌트 클래스명(예: btn-primary-rounded-lg)을 딱 1개만 추천해줘. 다른 설명 없이 오직 이름만 텍스트로 출력해.\n\n토큰 값: ${JSON.stringify(body)}`
          }
        ]
      })
    });

    // 🚨 에러 발생 시 터미널에 상세 내용 출력
    if (!response.ok) {
      const errorData = await response.text();
      console.error("🚨 Anthropic API 에러 상세내역:", errorData);
      return NextResponse.json({ error: 'API 호출 실패', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const suggestedName = data.content[0].text.trim();

    return NextResponse.json({ name: suggestedName });

  } catch (error) {
    console.error("🚨 서버 내부 에러:", error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}