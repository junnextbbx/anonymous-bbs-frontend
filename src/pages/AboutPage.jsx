// ============================================================
// AboutPage.jsx
// About 静的ページ
// ============================================================

const items = [
  { label: "サービス名", value: "anonymous board" },
  { label: "バージョン",  value: "0.1.0" },
  { label: "概要",       value: "ログイン不要・アカウント登録不要で誰でも匿名で書き込める掲示板です。" },
  { label: "技術スタック", value: "React / Vite / Tailwind CSS / FastAPI / SQLite" },
  { label: "お問い合わせ", value: "管理者への連絡手段は現在準備中です。" },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">About</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          このサービスについて
        </h1>
        <p className="text-base text-zinc-500 mt-1">anonymous board に関する情報</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800">
        {items.map(({ label, value }) => (
          <div key={label} className="px-5 py-4 flex flex-col gap-1 sm:flex-row sm:gap-6">
            <span className="text-sm text-zinc-500 w-32 shrink-0">{label}</span>
            <span className="text-base text-zinc-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
