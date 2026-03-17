"use client";

import { useMemo, useState } from "react";

const BG_COLORS = [
  { id: "slate", className: "bg-slate-500 hover:bg-slate-600" },
  { id: "red", className: "bg-red-500 hover:bg-red-600" },
  { id: "amber", className: "bg-amber-400 hover:bg-amber-500" },
  { id: "emerald", className: "bg-emerald-500 hover:bg-emerald-600" },
  { id: "blue", className: "bg-blue-500 hover:bg-blue-600" },
  { id: "indigo", className: "bg-indigo-500 hover:bg-indigo-600" },
  { id: "violet", className: "bg-violet-500 hover:bg-violet-600" },
  { id: "pink", className: "bg-pink-500 hover:bg-pink-600" },
  { id: "rose", className: "bg-rose-500 hover:bg-rose-600" },
  { id: "fuchsia", className: "bg-fuchsia-500 hover:bg-fuchsia-600" },
];

const TEXT_COLORS = [
  { id: "white", label: "White", className: "text-white" },
  { id: "black", label: "Black", className: "text-slate-900" },
];

const FONT_FAMILIES = [
  { id: "sans", label: "Sans", className: "font-sans" },
  { id: "serif", label: "Serif", className: "font-serif" },
  { id: "mono", label: "Mono", className: "font-mono" },
];

export default function Home() {
  const [buttonText, setButtonText] = useState("Primary Button");
  const [radius, setRadius] = useState(8);
  const [paddingX, setPaddingX] = useState(20);
  const [paddingY, setPaddingY] = useState(10);
  const [fontSize, setFontSize] = useState(16);
  const [colorId, setColorId] = useState("blue");
  const [textColorId, setTextColorId] = useState<"white" | "black">("white");
  const [fontFamilyId, setFontFamilyId] = useState<"sans" | "serif" | "mono">("sans");
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [aiSuggestedName, setAiSuggestedName] = useState<string | null>(null);

  // UX 개선: 복사 상태를 보여주기 위한 State들
  const [copyCodeStatus, setCopyCodeStatus] = useState("복사하기");
  const [copyNameStatus, setCopyNameStatus] = useState("클릭해서 복사");

  const selectedBg = useMemo(
    () => BG_COLORS.find((c) => c.id === colorId) ?? BG_COLORS[0],
    [colorId]
  );
  const selectedTextColor = useMemo(
    () => TEXT_COLORS.find((t) => t.id === textColorId) ?? TEXT_COLORS[0],
    [textColorId]
  );
  const selectedFont = useMemo(
    () => FONT_FAMILIES.find((f) => f.id === fontFamilyId) ?? FONT_FAMILIES[0],
    [fontFamilyId]
  );

  const buttonClasses = useMemo(
    () =>
      [
        "inline-flex items-center justify-center",
        "font-medium",
        "shadow-md",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white",
      ].join(" "),
    []
  );

  const tailwindPreview = useMemo(
    () =>
      [
        "inline-flex items-center justify-center",
        "font-medium",
        "shadow-md",
        selectedBg.className,
        selectedTextColor.className,
        selectedFont.className,
        "transition-all duration-200 ease-out",
      ].join(" "),
    [selectedBg.className, selectedTextColor.className, selectedFont.className]
  );

  const buttonInlineStylePreview = useMemo(
    () =>
      `{
  borderRadius: "${radius}px",
  padding: "${paddingY}px ${paddingX}px",
  fontSize: "${fontSize}px"
}`,
    [radius, paddingX, paddingY, fontSize]
  );

  const handleGenerateName = async () => {
    // 로그 1: 함수가 실행되는지 확인
    console.log("🚀 버튼 클릭됨: AI 처방 시작!"); 
  
    setIsGeneratingName(true);
    setAiSuggestedName(null);
  
    try {
      // 로그 2: 어떤 데이터를 보내는지 확인
      console.log("📦 보낼 데이터:", { radius, paddingX, paddingY, fontSize, colorId });
  
      const response = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ radius, paddingX, paddingY, fontSize, colorId }),
      });
  
      // 로그 3: 서버의 응답 상태 확인 (200이 나오면 성공, 404면 경로 에러, 500이면 서버 에러)
      console.log("📡 서버 응답 상태:", response.status);
  
      if (!response.ok) {
        throw new Error("서버 응답이 좋지 않습니다.");
      }
  
      const data = await response.json();
      
      // 로그 4: AI가 지어준 이름 확인
      console.log("✨ AI 추천 결과:", data.name);
      
      setAiSuggestedName(data.name);
  
    } catch (err) {
      console.error("❌ 에러 발생:", err);
    } finally {
      setIsGeneratingName(false);
    }
  };

  // ✅ UX 개선: Alert 대신 버튼 텍스트 변경 피드백 (컴포넌트 이름 복사)
  const handleCopySuggestedName = async () => {
    if (!aiSuggestedName) return;
    try {
      await navigator.clipboard.writeText(aiSuggestedName);
      setCopyNameStatus("복사됨! ✅");
      setTimeout(() => setCopyNameStatus("클릭해서 복사"), 2000);
    } catch {
      console.error("이름 복사 실패");
    }
  };

  // ✅ UX 개선: Alert 대신 버튼 텍스트 변경 피드백 (코드 복사)
  const handleCopy = async () => {
    const copyText = `<button
  className="${tailwindPreview}"
  style={${buttonInlineStylePreview}}
>
  ${buttonText || "Button"}
</button>`;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyCodeStatus("복사됨! ✅");
      setTimeout(() => setCopyCodeStatus("복사하기"), 2000);
    } catch {
      console.error("복사 실패");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 font-sans text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8 lg:flex-row lg:gap-8">
        <section className="w-full space-y-6 lg:w-1/2" aria-label="Token Controllers">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Design Token Handoff Studio
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Design Token Studio
            </h1>
            <p className="text-sm text-slate-500">
              디자이너와 개발자 간 UI 컴포넌트 핸드오프 오차를 줄이는 단일 진실 공급원(SSOT) 툴입니다.
            </p>
          </header>

          <div className="space-y-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-600">Button Label</div>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Primary Button"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-900"
              />
            </div>

            {/* 둥글기 컨트롤러 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>둥글기 (Radius)</span>
                <span>{radius}px</span>
              </div>
              <input
                type="range" min={0} max={32} value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                aria-label="Border Radius"
              />
            </div>

            {/* 가로 여백 컨트롤러 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>가로 여백 (Padding X)</span>
                <span>{paddingX}px</span>
              </div>
              <input
                type="range" min={8} max={48} value={paddingX}
                onChange={(e) => setPaddingX(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                aria-label="Padding Horizontal"
              />
            </div>

            {/* 세로 여백 컨트롤러 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>세로 여백 (Padding Y)</span>
                <span>{paddingY}px</span>
              </div>
              <input
                type="range" min={4} max={24} value={paddingY}
                onChange={(e) => setPaddingY(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                aria-label="Padding Vertical"
              />
            </div>

            {/* 폰트 선택 */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">Font Family</div>
              <div className="flex gap-2">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamilyId(font.id as any)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium ${fontFamilyId === font.id ? "bg-slate-900 text-white" : "bg-white"}`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 컬러 팔레트 */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">Color Palette</div>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setColorId(color.id)}
                    className={`h-8 w-8 rounded-full border-2 ${color.className.split(" ")[0]} ${colorId === color.id ? "border-slate-900 ring-2 ring-offset-2" : "border-slate-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* AI 네이밍 버튼 */}
            <div className="mt-6 border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-600">✨ AI Naming Assistant</p>
              <button
                onClick={handleGenerateName}
                disabled={isGeneratingName}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs text-white disabled:opacity-50"
              >
                {isGeneratingName ? "생성 중..." : "AI 추천 받기"}
              </button>
            </div>
          </div>
        </section>

        {/* 프리뷰 섹션 */}
        <section className="w-full space-y-6 lg:w-1/2" aria-label="Live Preview">
          <div className="flex flex-col items-center justify-center gap-8 rounded-xl bg-slate-50 p-10 ring-1 ring-slate-200">
            <button
              style={{
                borderRadius: `${radius}px`,
                padding: `${paddingY}px ${paddingX}px`,
                fontSize: `${fontSize}px`,
              }}
              className={`${buttonClasses} ${selectedBg.className} ${selectedTextColor.className} ${selectedFont.className}`}
            >
              {buttonText || "Button"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Export Code</p>
              <button
                onClick={handleCopy}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs text-white hover:bg-slate-800 transition-all"
              >
                {copyCodeStatus}
              </button>
            </div>

            {aiSuggestedName && (
              <button
                onClick={handleCopySuggestedName}
                className="flex w-full items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase">AI Suggested Name</span>
                  <span className="font-mono text-sm font-bold">{aiSuggestedName}</span>
                </div>
                <span className="text-[10px] opacity-70">{copyNameStatus}</span>
              </button>
            )}

            <div className="rounded-lg bg-slate-900 p-4 text-xs text-slate-300 font-mono overflow-x-auto shadow-inner">
              <pre>
{`<button
  className="${tailwindPreview}"
  style={{
    borderRadius: "${radius}px",
    padding: "${paddingY}px ${paddingX}px",
    fontSize: "${fontSize}px"
  }}
>
  ${buttonText || "Button"}
</button>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}