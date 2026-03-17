"use client";

import { useMemo, useState, useEffect } from "react";

export default function Home() {
  const [buttonText, setButtonText] = useState("Primary Button");
  const [radius, setRadius] = useState(8);
  const [paddingX, setPaddingX] = useState(20);
  const [paddingY, setPaddingY] = useState(10);
  const [fontSize, setFontSize] = useState(16);
  const [colorId, setColorId] = useState("blue");
  
  // UX 개선: Toast 알림 상태
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: "", visible: false });

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  };

  const handleCopy = async () => {
    const copyText = `<button className="bg-${colorId}-500" style={{ borderRadius: '${radius}px' }}>${buttonText}</button>`;
    try {
      await navigator.clipboard.writeText(copyText);
      showToast("코드가 클립보드에 복사되었습니다! ✅");
    } catch {
      console.error("복사 실패");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      {/* Toast UI: 심사평의 '세련된 피드백' 대응 */}
      {toast.visible && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce z-50">
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Medical Token Studio</h1>
          <p className="text-slate-500">Beyond EMR, Toward Medical OS</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 컨트롤러 섹션 */}
          <section className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">Border Radius: {radius}px</label>
              <input type="range" min="0" max="32" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
            {/* ... 다른 슬라이더들 동일 구조 ... */}
            <button onClick={handleCopy} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
              Copy Config Code
            </button>
          </section>

          {/* 프리뷰 섹션 */}
          <section className="flex items-center justify-center bg-slate-100 rounded-2xl p-10 border-2 border-dashed border-slate-300">
            <button 
              style={{ borderRadius: `${radius}px`, padding: `${paddingY}px ${paddingX}px`, fontSize: `${fontSize}px` }}
              className="bg-blue-600 text-white shadow-lg transition-all"
            >
              {buttonText}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}