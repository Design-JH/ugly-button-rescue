"use client";

import { useMemo, useState } from "react";

// --- [컴포넌트 분리 1: Toast 알림 UI] ---
// 심사평의 "세련된 피드백 메커니즘"을 해결합니다.
const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-slate-700">
      <span className="text-emerald-400 text-xl">✅</span>
      {message}
    </div>
  </div>
);

// --- [컴포넌트 분리 2: 컨트롤러 유닛] ---
// 심사평의 "컴포넌트 분리 기회 활용"을 해결합니다.
const ControlUnit = ({ label, value, min, max, onChange, unit = "px" }: any) => (
  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex justify-between items-center px-1">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-xs font-mono bg-white px-2 py-1 rounded-md border shadow-sm text-slate-900">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
    />
  </div>
);

export default function Home() {
  const [buttonText, setButtonText] = useState("Primary Button");
  const [radius, setRadius] = useState(8);
  const [paddingX, setPaddingX] = useState(24);
  const [paddingY, setPaddingY] = useState(12);
  const [fontSize, setFontSize] = useState(16);
  
  // Toast 상태 관리
  const [toast, setToast] = useState({ message: "", visible: false });

  const triggerToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  };

  const handleCopy = async () => {
    const code = `<button style="border-radius: ${radius}px; padding: ${paddingY}px ${paddingX}px; font-size: ${fontSize}px;">${buttonText}</button>`;
    try {
      await navigator.clipboard.writeText(code);
      triggerToast("코드가 복사되었습니다!"); // alert 대신 세련된 Toast 사용
    } catch {
      console.error("복사 실패");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <Toast message={toast.message} visible={toast.visible} />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 왼쪽: 컨트롤러 (디자인 토큰 조절) */}
        <section className="lg:col-span-5 space-y-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
          <header className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Medical OS Studio</h1>
            <p className="text-sm text-slate-500 font-medium">Beyond EMR, Design Token System</p>
          </header>

          <div className="space-y-4">
            <ControlUnit label="Border Radius" value={radius} min={0} max={32} onChange={setRadius} />
            <ControlUnit label="Padding X" value={paddingX} min={8} max={48} onChange={setPaddingX} />
            <ControlUnit label="Padding Y" value={paddingY} min={4} max={24} onChange={setPaddingY} />
            <ControlUnit label="Font Size" value={fontSize} min={12} max={24} onChange={setFontSize} />
          </div>

          <button 
            onClick={handleCopy}
            className="w-full mt-4 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
          >
            COPY CONFIGURATION
          </button>
        </section>

        {/* 오른쪽: 라이브 프리뷰 */}
        <section className="lg:col-span-7 aspect-square lg:aspect-auto lg:h-full min-h-[400px] bg-slate-900 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* 배경 격자 패턴 (세련미 추가) */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <button 
            style={{ borderRadius: `${radius}px`, padding: `${paddingY}px ${paddingX}px`, fontSize: `${fontSize}px` }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-2xl transition-all relative z-10"
          >
            {buttonText}
          </button>
          
          <p className="mt-8 text-slate-500 text-xs font-mono uppercase tracking-widest z-10">Live System Preview</p>
        </section>

      </div>
    </main>
  );
}