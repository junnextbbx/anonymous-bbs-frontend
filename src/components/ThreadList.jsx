// ============================================================
// ThreadList.jsx
// スレッド一覧画面
// ============================================================

import ThreadForm from "./ThreadForm";

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

export default function ThreadList({ threads, loading, onCreate, onSelect }) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Anonymous Board</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
          掲示板
        </h1>
        <p className="text-sm text-zinc-500 mt-1">ログイン不要・匿名で投稿できる掲示板です</p>
      </div>

      {/* スレッド作成フォーム */}
      <ThreadForm onCreate={onCreate} />

      {/* スレッド一覧 */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 text-sm">
          スレッドはまだありません。最初のスレッドを立ててみましょう！
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((thread, i) => (
            <li
              key={thread.id}
              onClick={() => onSelect(thread)}
              className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 cursor-pointer hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all duration-150"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 font-mono text-xs text-zinc-600 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="text-zinc-100 text-sm font-medium group-hover:text-cyan-300 transition-colors truncate">
                    {thread.title}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(thread.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-zinc-500 font-mono">{thread.postCount}<span className="ml-1 text-zinc-700">res</span></span>
                <span className="text-zinc-700 group-hover:text-cyan-500 transition-colors text-lg">›</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
