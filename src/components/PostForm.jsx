// ============================================================
// PostForm.jsx
// 投稿フォームコンポーネント
// ============================================================

import { useState } from "react";

export default function PostForm({ onSubmit }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    await onSubmit(trimmed);
    setBody("");
    setSubmitting(false);
  };

  return (
    <div className="border border-zinc-700 rounded-xl bg-zinc-900/80 p-5 backdrop-blur">
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Reply</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        placeholder="返信を入力... (Cmd/Ctrl + Enter で投稿)"
        rows={3}
        className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 resize-none transition-all duration-150"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-zinc-600">匿名投稿</span>
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className="px-5 py-2 text-sm rounded-lg bg-cyan-500 text-zinc-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
