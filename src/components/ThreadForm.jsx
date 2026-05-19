// ============================================================
// ThreadForm.jsx
// スレッド新規作成フォーム
// ============================================================

import { useState } from "react";

export default function ThreadForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setError("");
    try {
      await onCreate(trimmed);
      setTitle("");
      setOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-zinc-600 text-zinc-300 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200 text-base font-medium group"
        >
          <span className="text-lg group-hover:rotate-90 transition-transform duration-200">+</span>
          新しいスレッドを立てる
        </button>
      ) : (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-5 shadow-xl backdrop-blur animate-fade-in">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-mono">New Thread</p>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder="スレッドのタイトルを入力..."
            rows={2}
            autoFocus
            className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-base outline-none focus:ring-1 focus:ring-cyan-500 resize-none transition-all duration-150"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => { setOpen(false); setTitle(""); setError(""); }}
              className="px-4 py-2 text-base rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || submitting}
              className="px-5 py-2 text-base rounded-lg bg-cyan-500 text-zinc-950 font-semibold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "作成中..." : "作成"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
