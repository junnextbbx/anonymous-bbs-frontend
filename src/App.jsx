// ============================================================
// App.jsx
// ルートコンポーネント。画面遷移を useState で管理。
// ============================================================

import { useState } from "react";
import { useThreads } from "./hooks/useBoardData";
import ThreadList from "./components/ThreadList";
import ThreadDetail from "./components/ThreadDetail";

export default function App() {
  const { threads, loading, createThread } = useThreads();
  const [selectedThread, setSelectedThread] = useState(null);

  return (
    // グローバルダークテーマ背景
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Mono', 'Space Mono', monospace" }}>
      {/* ノイズテクスチャ + グロー */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-900/10 rounded-full blur-3xl" />
      </div>

      {/* コンテンツ */}
      <main className="relative z-10 px-4 py-12">
        {selectedThread ? (
          <ThreadDetail
            thread={selectedThread}
            onBack={() => setSelectedThread(null)}
          />
        ) : (
          <ThreadList
            threads={threads}
            loading={loading}
            onCreate={createThread}
            onSelect={setSelectedThread}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="relative z-10 text-center pb-6 text-xs text-zinc-700 font-mono">
        anonymous board — no login required
      </footer>
    </div>
  );
}
