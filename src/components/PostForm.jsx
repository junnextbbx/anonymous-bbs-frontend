// ============================================================
// PostForm.jsx
// 投稿フォームコンポーネント
// ============================================================

import { useState, useEffect, useRef } from "react";
import { getDisplayName } from "../services/rateLimiter";

export default function PostForm({ onSubmit, mention, onMentionConsumed }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // メンション挿入: mention が渡されたら本文末尾に追記してフォーカス
  useEffect(() => {
    if (!mention) return;
    setBody((prev) => {
      const prefix = prev && !prev.endsWith(" ") ? prev + " " : prev;
      return prefix + mention;
    });
    textareaRef.current?.focus();
    onMentionConsumed?.();
  }, [mention]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(trimmed);
      setBody("");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayName = getDisplayName();

  return (
    <div className="border border-zinc-700 rounded-xl bg-zinc-900/80 p-5 backdrop-blur">
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Reply</p>
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        placeholder="返信を入力... (Cmd/Ctrl + Enter で投稿)"
        rows={3}
        className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-base outline-none focus:ring-1 focus:ring-cyan-500 resize-none transition-all duration-150"
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-zinc-400">
          {displayName ? `${displayName} として投稿` : "匿名さんとして投稿"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className="px-5 py-2 text-base rounded-lg bg-cyan-500 text-zinc-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
