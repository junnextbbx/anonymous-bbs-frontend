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
  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100 flex">
{/* 左カラム: ナビ（md以上で表示） */}
      <div className="hidden md:block w-[15%] shrink-0 border-r border-zinc-800">
        <Nav />
      </div>

      {/* 中央カラム: メイン + フッター */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <main className="relative z-10 flex-1 px-8 py-12">
          <Routes>
            <Route path="/"      element={<BoardPage />} />
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
