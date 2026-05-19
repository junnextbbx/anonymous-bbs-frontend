// ============================================================
// SettingsPage.jsx
// ユーザー設定ページ（表示名の登録・変更）
// ============================================================

import { useState } from "react";
import { getDisplayName, setDisplayName } from "../services/rateLimiter";

export default function SettingsPage() {
  const [name, setName] = useState(() => getDisplayName());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setDisplayName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Settings</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">ユーザー設定</h2>
        <p className="text-sm text-zinc-500 mt-1">
          このデバイス・ブラウザでの表示名を設定します
        </p>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6 backdrop-blur">
        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
          表示名
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          placeholder="匿名さん（未設定時のデフォルト）"
          maxLength={64}
          className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-base outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-150"
        />
        <p className="text-xs text-zinc-600 mt-2">
          未設定または空欄の場合は「匿名さん」として投稿されます
        </p>

        <div className="flex items-center justify-between mt-5">
          {saved ? (
            <span className="text-sm text-cyan-400 font-mono">保存しました</span>
          ) : (
            <span />
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 text-base rounded-lg bg-cyan-500 text-zinc-950 font-semibold hover:bg-cyan-400 transition-colors"
          >
            保存
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-2">Note</p>
        <ul className="text-sm text-zinc-500 space-y-1 list-disc list-inside">
          <li>表示名はこのブラウザにのみ保存されます</li>
          <li>同じ名前を使う他のユーザーがいる場合、表示名だけでは区別できませんが、「あなた」バッジはデバイス固有のIDで判定します</li>
          <li>名前を変えても過去の投稿の表示名は変わりません</li>
        </ul>
      </div>
    </div>
  );
}
