// ============================================================
// ThreadDetail.jsx
// スレッド詳細・投稿一覧画面
// ============================================================

import { useEffect, useRef } from "react";
import { usePosts } from "../hooks/useBoardData";
import PostForm from "./PostForm";

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

export default function ThreadDetail({ thread, onBack }) {
  const { posts, loading, createPost } = usePosts(thread.id);
  const bottomRef = useRef(null);

  // 新しい投稿時に最下部へスクロール
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts.length, loading]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* 戻るボタン + スレッドタイトル */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-zinc-500 hover:text-cyan-400 text-sm mb-4 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">‹</span>
          スレッド一覧に戻る
        </button>
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Thread</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 leading-snug" style={{ fontFamily: "'Space Mono', monospace" }}>
          {thread.title}
        </h2>
        <p className="text-xs text-zinc-600 mt-1">{thread.postCount} 件のレス</p>
      </div>

      {/* 投稿一覧 */}
      <div className="mb-6 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-800/50 animate-pulse" />
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">
            まだ投稿がありません。最初のレスを付けましょう！
          </div>
        ) : (
          posts.map((post, i) => (
            <div
              key={post.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-cyan-600">Anonymous</span>
                <span className="text-xs text-zinc-700">#{i + 1}</span>
                <span className="text-xs text-zinc-700 ml-auto">{timeAgo(post.createdAt)}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{post.body}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* 投稿フォーム */}
      <PostForm onSubmit={createPost} />
    </div>
  );
}
