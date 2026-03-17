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

  const [copyCodeStatus, setCopyCodeStatus] = useState("복사하기");
  const [copyNameStatus, setCopyNameStatus] = useState("클릭해서 복사");

  const selectedBg = useMemo(() => BG_COLORS.find((c) => c.id === colorId) ?? BG_COLORS[0], [colorId]);
  const selectedTextColor = useMemo(() => TEXT_COLORS.find((t) => t.id === textColorId) ?? TEXT_COLORS[0], [textColorId]);
  const selectedFont = useMemo(() => FONT_FAMILIES.find((f) => f.id === fontFamilyId) ?? FONT_FAMILIES[0], [fontFamilyId]);

  const buttonClasses = "inline-flex items-center justify-center font-medium shadow-md transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white";

  const tailwindPreview = useMemo(() => [
    "inline-flex items-center justify-center", "font-medium", "shadow-md",
    selectedBg.className, selectedTextColor.className, selectedFont.className,
    "transition-all duration-200 ease-out",
  ].join(" "), [selectedBg.className, selectedTextColor.className, selectedFont.className]);

  const handleGenerateName = async () => {
    setIsGeneratingName(true);
    try {
      const response = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ radius, paddingX, paddingY, fontSize, colorId }),
      });
      const data = await response.json();
      setAiSuggestedName(data.name);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingName(false);
    }
  };

  const handleCopySuggestedName = async () => {
    if (!aiSuggestedName) return;
    await navigator.clipboard.writeText(aiSuggestedName);
    setCopyNameStatus("복사됨! ✅");
    setTimeout(() => setCopyNameStatus("클릭해서 복사"), 2000);
  };

  const handleCopy = async () => {
    const copyText = `<button className="${tailwindPreview}" style={{ borderRadius: "${radius}px", padding: "${paddingY}px ${paddingX}px", fontSize: "${fontSize}px" }}> ${buttonText || "Button"} </button>`;
    await navigator.clipboard.writeText(copyText);
    setCopyCodeStatus("복사됨! ✅");
    setTimeout(() => setCopyCodeStatus("복사하기"), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 font-sans text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8 lg:flex-row lg:gap-8">
        <section className="w-full space-y-6 lg:w-1/2">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Design Token Handoff Studio</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Design Token Studio</h1>
            <p className="text-sm text-slate-500">KRDS 가이드라인을 준수하는 버튼 핸드오프 시스템입니다.</p>
          </header>

          <div className="space-y-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="space-y-1 text-xs font-medium text-slate-600">Button Label
              <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900" />
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-600 flex flex-col">
              <div className="flex justify-between"><span>Radius</span><span>{radius}px</span></div>
              <input type="range" min={0} max={32} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="h-2 w-full appearance-none rounded-full bg-slate-200 accent-slate-900" />
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-600 flex flex-col">
              <div className="flex justify-between"><span>Padding X</span><span>{paddingX}px</span></div>
              <input type="range" min={8} max={48} value={paddingX} onChange={(e) => setPaddingX(Number(e.target.value))} className="h-2 w-full appearance-none rounded-full bg-slate-200 accent-slate-900" />
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-600 flex flex-col">
              <div className="flex justify-between"><span>Padding Y</span><span>{paddingY}px</span></div>
              <input type="range" min={4} max={24} value={paddingY} onChange={(e) => setPaddingY(Number(e.target.value))} className="h-2 w-full appearance-none rounded-full bg-slate-200 accent-slate-900" />
            </div>
            <div className="mt-6 border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-600">✨ AI Naming Assistant</p>
              <button onClick={handleGenerateName} disabled={isGeneratingName} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs text-white disabled:opacity-50">
                {isGeneratingName ? "생성 중..." : "AI 추천 받기"}
              </button>
            </div>
          </div>
        </section>

        <section className="w-full space-y-6 lg:w-1/2">
          <div className="flex flex-col items-center justify-center gap-8 rounded-xl bg-slate-50 p-10 ring-1 ring-slate-200">
            <button style={{ borderRadius: `${radius}px`, padding: `${paddingY}px ${paddingX}px`, fontSize: `${fontSize}px` }} className={`${buttonClasses} ${selectedBg.className} ${selectedTextColor.className} ${selectedFont.className}`}>
              {buttonText || "Button"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Export Code</p>
              <button onClick={handleCopy} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs text-white hover:bg-slate-800 transition-all">{copyCodeStatus}</button>
            </div>

            {/* AI Naming Spec UI */}
            {aiSuggestedName && (
              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <h3 className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">KRDS System Naming Spec</h3>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mb-5 shadow-sm">
                  <code className="text-blue-600 font-mono text-base font-bold truncate pr-2">{aiSuggestedName}</code>
                  <button onClick={handleCopySuggestedName} className="shrink-0 px-3 py-1.5 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    {copyNameStatus === "복사됨! ✅" ? "COPIED" : "COPY NAME"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Prefix', 'Function', 'Type', 'Shape', 'Size', 'State'].map((label, idx) => {
                    const parts = aiSuggestedName.split('-');
                    return (
                      <div key={label} className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tight">{label}</span>
                        <span className="text-xs font-bold text-slate-700 truncate">{parts[idx] || (idx === 0 ? 'btn' : '-')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-slate-900 p-4 text-xs text-slate-300 font-mono overflow-x-auto shadow-inner">
              <pre>{`<button className="${tailwindPreview}" style={{ borderRadius: "${radius}px", padding: "${paddingY}px ${paddingX}px", fontSize: "${fontSize}px" }}> ${buttonText || "Button"} </button>`}</pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}