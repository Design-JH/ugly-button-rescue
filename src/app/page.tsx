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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          radius,
          paddingX,
          paddingY,
          fontSize,
          colorId,
          textColorId,
          fontFamilyId,
          buttonText,
        }),
      });

      if (!response.ok) {
        // eslint-disable-next-line no-alert
        alert("AI 네이밍 추천에 실패했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      const data = (await response.json()) as { name?: string };
      if (data.name) {
        setAiSuggestedName(data.name);
      } else {
        // eslint-disable-next-line no-alert
        alert("AI가 유효한 이름을 반환하지 않았습니다.");
      }
    } catch {
      // eslint-disable-next-line no-alert
      alert("AI 네이밍 추천 중 오류가 발생했어요.");
    } finally {
      setIsGeneratingName(false);
    }
  };

  const handleCopySuggestedName = async () => {
    if (!aiSuggestedName) return;

    try {
      await navigator.clipboard.writeText(aiSuggestedName);
      // eslint-disable-next-line no-alert
      alert("추천된 컴포넌트 이름이 복사되었습니다.");
    } catch {
      // eslint-disable-next-line no-alert
      alert("이름 복사에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleCopy = async () => {
    const copyText = `<button
  className="${tailwindPreview}"
  style={${buttonInlineStylePreview}}
>
  ${buttonText}
</button>`;

    try {
      await navigator.clipboard.writeText(copyText);
      // eslint-disable-next-line no-alert
      alert("버튼 코드가 클립보드에 복사되었습니다.");
    } catch {
      // eslint-disable-next-line no-alert
      alert("복사에 실패했어요. 다시 시도해 주세요.");
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
              Design Token Handoff Studio
            </h1>
            <p className="text-sm text-slate-500">
              디자이너와 개발자 간 UI 컴포넌트 핸드오프(Handoff) 오차를 줄이고, 완벽한 단일 진실 공급원(SSOT)을 제공합니다.
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
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>둥글기</span>
                <span>{radius}px</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                />
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <input
                    type="number"
                    min={0}
                    max={32}
                    value={radius}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      const clamped = Math.min(32, Math.max(0, next));
                      setRadius(clamped);
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-1 py-0.5 text-right text-xs text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>가로 여백</span>
                <span>{paddingX}px</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={8}
                  max={48}
                  value={paddingX}
                  onChange={(e) => setPaddingX(Number(e.target.value))}
                  className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                />
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <input
                    type="number"
                    min={8}
                    max={48}
                    value={paddingX}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      const clamped = Math.min(48, Math.max(8, next));
                      setPaddingX(clamped);
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-1 py-0.5 text-right text-xs text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>세로 여백</span>
                <span>{paddingY}px</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={paddingY}
                  onChange={(e) => setPaddingY(Number(e.target.value))}
                  className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                />
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <input
                    type="number"
                    min={4}
                    max={24}
                    value={paddingY}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      const clamped = Math.min(24, Math.max(4, next));
                      setPaddingY(clamped);
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-1 py-0.5 text-right text-xs text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>폰트 크기</span>
                <span>{fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={12}
                  max={32}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                />
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <input
                    type="number"
                    min={12}
                    max={32}
                    value={fontSize}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      const clamped = Math.min(32, Math.max(12, next));
                      setFontSize(clamped);
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-1 py-0.5 text-right text-xs text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="text-xs font-medium text-slate-600">Font Family (타입 스케일)</div>
              <div className="flex gap-2">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontFamilyId(font.id as "sans" | "serif" | "mono")}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                      fontFamilyId === font.id
                        ? "border-slate-900 bg-slate-900 text-slate-50"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="text-xs font-medium text-slate-600">Background Color Palette</div>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setColorId(color.id)}
                    title={color.id}
                    className={[
                      "h-8 w-8 shrink-0 rounded-full border-2 transition-transform hover:scale-110",
                      color.className.split(" ")[0],
                      colorId === color.id ? "border-slate-900 ring-2 ring-slate-400 ring-offset-2" : "border-slate-300",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-slate-600">Text Color</div>
              <div className="flex gap-2">
                {TEXT_COLORS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTextColorId(t.id as "white" | "black")}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                      textColorId === t.id
                        ? "border-slate-900 bg-slate-900 text-slate-50"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">
                    ✨ AI Component Naming Assistant
                  </p>
                  <p className="text-[11px] text-slate-400">
                    현재 토큰 구성을 기반으로 컴포넌트 이름을 제안합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateName}
                  disabled={isGeneratingName}
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors",
                    isGeneratingName
                      ? "cursor-wait border-slate-300 bg-slate-100 text-slate-400"
                      : "border-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {isGeneratingName ? "생성 중..." : "AI 네이밍 추천"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full space-y-6 lg:w-1/2" aria-label="Live Component & Compiled Code">
          <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="w-full max-w-xs rounded border border-slate-500 bg-slate-200 px-4 py-2 shadow-[inset_-2px_-2px_0_rgba(255,255,255,0.9),inset_2px_2px_0_rgba(0,0,0,0.35)]">
              <button
                className="w-full border border-slate-700 bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-[inset_-2px_-2px_0_rgba(255,255,255,0.9),inset_2px_2px_0_rgba(0,0,0,0.35)]"
                aria-label="Baseline system default button"
              >
                Baseline Button
              </button>
            </div>

            <div className="text-2xl" aria-hidden="true">
              ⬇️
            </div>

            <button
              type="button"
              style={{
                borderRadius: `${radius}px`,
                padding: `${paddingY}px ${paddingX}px`,
                fontSize: `${fontSize}px`,
              }}
              className={[
                buttonClasses,
                selectedBg.className,
                selectedTextColor.className,
                selectedFont.className,
              ].join(" ")}
            >
              {buttonText || "Button"}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Live Component Code Export
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-50 shadow-sm transition-colors hover:bg-slate-800"
              >
                복사하기
              </button>
            </div>
            {aiSuggestedName && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCopySuggestedName}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm transition-colors hover:border-emerald-400 hover:bg-emerald-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="uppercase tracking-[0.16em] text-emerald-500">
                    AI SUGGESTED NAME
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-900">
                    {aiSuggestedName}
                  </span>
                  <span className="text-[10px] text-emerald-600">클릭해서 복사</span>
                </button>
              </div>
            )}
            <div className="overflow-hidden rounded-lg bg-slate-900 text-xs text-slate-50 ring-1 ring-slate-800">
              <button
                type="button"
                onClick={handleCopy}
                className="block w-full cursor-pointer bg-slate-950/40 px-4 py-3 text-left font-mono text-[11px] leading-relaxed text-slate-100 hover:bg-slate-950/60"
              >
                <pre className="whitespace-pre-wrap">
{`<button
  className="${tailwindPreview}"
  style=${buttonInlineStylePreview}
>
  ${buttonText || "Button"}
</button>`}
                </pre>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
