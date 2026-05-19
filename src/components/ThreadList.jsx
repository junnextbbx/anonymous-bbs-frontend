// ============================================================
// ThreadList.jsx
// スレッド一覧画面
// ============================================================

import { useState, useMemo, useEffect } from "react";
import ThreadForm from "./ThreadForm";

// 1ページあたりの表示件数（ここを変えるだけで全体に反映）
const PAGE_SIZE = 10;

function formatDate(isoString) {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}（${hh}:${min}）`;
}

/** 表示するページ番号の配列を返す。6ページ以上は省略記号 null を含む */
function buildPageItems(current, total) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // 6ページ以上: 先頭・末尾・current±1 を表示し間は null（…）
  const show = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...show].sort((a, b) => a - b);
  const items = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) items.push(null);
    items.push(sorted[i]);
  }
  return items;
}

export default function ThreadList({ threads, loading, onCreate, onSelect, anonymousId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredThreads = useMemo(
    () => threads.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ),
    [threads, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredThreads.length / PAGE_SIZE));

  const pagedThreads = useMemo(
    () => filteredThreads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredThreads, page]
  );

  // 検索クエリ変更時は1ページ目に戻す
  useEffect(() => { setPage(1); }, [searchQuery]);

  // スレッド作成後に1ページ目へ戻す
  const handleCreate = async (title) => {
    await onCreate(title);
    setPage(1);
  };

  const pageItems = buildPageItems(page, totalPages);

  return (
    <div className="max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Anonymous Board</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">掲示板</h1>
        <p className="text-base text-zinc-500 mt-1">ログイン不要・匿名で投稿できる掲示板です</p>
      </div>

      {/* スレッド作成フォーム */}
      <ThreadForm onCreate={handleCreate} />

      {/* 検索フィルター */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="スレッドを検索..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-500/50 focus:bg-zinc-800/80 transition-all duration-150"
        />
      </div>

      {/* スレッド件数 */}
      {!loading && threads.length > 0 && (
        <p className="text-xs font-mono text-zinc-700 mb-2 text-right">
          {filteredThreads.length} / {threads.length} スレッド
        </p>
      )}

      {/* スレッド一覧 */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20 text-zinc-300 text-base">
          スレッドはまだありません。最初のスレッドを立ててみましょう！
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="text-center py-20 text-zinc-300 text-base">
          「{searchQuery.trim()}」に一致するスレッドが見つかりませんでした
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {pagedThreads.map((thread, i) => (
              <li
                key={thread.id}
                onClick={() => onSelect(thread)}
                className="group flex items-stretch rounded-xl border border-zinc-800 bg-zinc-900/60 cursor-pointer hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all duration-150 overflow-hidden"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* 投稿数バッジ（左） */}
                <div className="shrink-0 w-16 flex flex-col items-center justify-center bg-zinc-800/60 group-hover:bg-zinc-700/60 transition-colors px-2 py-4 border-r border-zinc-800/60">
                  <span className="text-xl font-bold text-zinc-200 leading-none tabular-nums">{thread.postCount}</span>
                  <span className="text-[12px] font-mono text-zinc-300 mt-1">res</span>
                </div>

                {/* タイトル + メタ情報 */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-zinc-100 text-base font-medium group-hover:text-cyan-300 transition-colors leading-snug flex items-center gap-2 flex-wrap">
                      <span className="truncate">{thread.title}</span>
                      {thread.createdBy === anonymousId && (
                        <span className="shrink-0 text-[10px] font-mono text-cyan-500 border border-cyan-500/40 rounded px-1 py-0.5 leading-none">自分</span>
                      )}
                    </p>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {thread.displayName ?? "匿名さん"} · {formatDate(thread.createdAt)}
                    </p>
                  </div>
                  <span className="text-zinc-700 group-hover:text-cyan-500 transition-colors text-xl shrink-0">›</span>
                </div>
              </li>
            ))}
          </ul>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              {/* 前へ */}
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                前へ
              </button>

              {/* ページ番号 */}
              {pageItems.map((item, i) =>
                item === null ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-zinc-600 select-none">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`min-w-[2rem] px-2 py-1.5 text-sm rounded-lg border transition-colors ${
                      item === page
                        ? "bg-cyan-500 border-cyan-500 text-zinc-950 font-semibold"
                        : "border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              {/* 次へ */}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
