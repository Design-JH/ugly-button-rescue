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
    if (isGeneratingName) return;
    setIsGeneratingName(true);
    setAiSuggestedName(null);

    try {
      const response = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          radius, paddingX, paddingY, fontSize,
          colorId, textColorId, fontFamilyId, buttonText,
        }),
      });

      if (!response.ok) {
        console.error("AI 네이밍 추천 실패");
        return;
      }

      const data = (await response.json()) as { name?: string };
      if (data.name) {
        setAiSuggestedName(data.name);
      }
    } catch (err) {
      console.error("AI API 호출 중 에러 발생:", err);
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