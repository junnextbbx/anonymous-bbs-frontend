// ============================================================
// App.jsx
// ルートコンポーネント。React Router でページを切り替える。
// ============================================================

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useThreads } from "./hooks/useBoardData";
import Nav from "./components/Nav";
import ThreadList from "./components/ThreadList";
import ThreadDetail from "./components/ThreadDetail";
import RulesPage from "./pages/RulesPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";

// 既存の掲示板ロジックをそのまま維持
function BoardPage() {
  const { threads, loading, createThread, anonymousId } = useThreads();
  const [selectedThread, setSelectedThread] = useState(null);

  return selectedThread ? (
    <ThreadDetail
      thread={selectedThread}
      onBack={() => setSelectedThread(null)}
      anonymousId={anonymousId}
    />
  ) : (
    <ThreadList
      threads={threads}
      loading={loading}
      onCreate={createThread}
      onSelect={setSelectedThread}
      anonymousId={anonymousId}
    />
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100 flex">

      {/* ハンバーガーボタン（モバイルのみ） */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
        onClick={() => setMenuOpen(true)}
        aria-label="メニューを開く"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect y="3"  width="20" height="2" rx="1" fill="currentColor"/>
          <rect y="9"  width="20" height="2" rx="1" fill="currentColor"/>
          <rect y="15" width="20" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>

      {/* オーバーレイ（モバイル・メニューオープン時） */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 左カラム: ナビ（PCは常時表示・モバイルはドロワー） */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[70%] max-w-xs md:w-[15%]
        border-r border-zinc-800 bg-zinc-950
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* 閉じるボタン（モバイルのみ） */}
        <button
          className="md:hidden absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
          onClick={() => setMenuOpen(false)}
          aria-label="メニューを閉じる"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <Nav onNavigate={() => setMenuOpen(false)} />
      </div>

      {/* 中央カラム: メイン + フッター */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <main className="relative z-10 flex-1 px-8 pt-20 pb-12 md:pt-12">
          <Routes>
            <Route path="/"         element={<BoardPage />} />
            <Route path="/rules"    element={<RulesPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <footer className="relative z-10 text-center pb-6 text-sm text-zinc-700 font-mono space-y-1">
          <p>anonymous board — no login required</p>
          <p>※ 「自分の投稿」はこのデバイス・ブラウザでのみ識別されます</p>
        </footer>
      </div>

      {/* 右カラム: 広告プレースホルダ（md以上で表示） */}
      <div className="hidden md:flex w-[15%] shrink-0 flex-col border-l border-zinc-800 px-4 py-10 gap-6 relative z-10">
        {/* 広告表示は現在オフ。再表示するには下のコメントを解除する */}
        {/* 広告スロット 1: 300×250 */}
        {/* <div>
          <p className="text-xs font-mono text-zinc-700 uppercase tracking-widest mb-2">広告</p>
          <div className="rounded-lg border border-dashed border-zinc-800 h-[250px] flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-mono text-zinc-800">300×250</span>
          </div>
        </div> */}
        {/* 広告スロット 2: 300×120 */}
        {/* <div>
          <div className="rounded-lg border border-dashed border-zinc-800 h-[120px] flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-mono text-zinc-800">300×120</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
