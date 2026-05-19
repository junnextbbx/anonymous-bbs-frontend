// ============================================================
// RulesPage.jsx
// 利用ルール静的ページ
// ============================================================

const rules = [
  { title: "匿名投稿", body: "このサービスはアカウント登録不要の匿名掲示板です。ログイン情報は一切保存されません。" },
  { title: "禁止事項", body: "他者への誹謗中傷・差別的発言・個人情報の投稿・スパム行為は禁止です。発見した場合は管理者が削除します。" },
  { title: "著作権", body: "他者の著作物を無断転載することは禁止です。引用する場合は出典を明記してください。" },
  { title: "免責事項", body: "投稿内容の正確性について管理者は一切保証しません。情報の利用は自己責任でお願いします。" },
  { title: "サービスの変更・停止", body: "予告なくサービス内容の変更や停止を行う場合があります。あらかじめご了承ください。" },
];

export default function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Rules</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          利用ルール
        </h1>
        <p className="text-base text-zinc-500 mt-1">このサービスを利用する前にお読みください</p>
      </div>

      <div className="space-y-4">
        {rules.map((rule, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
            <p className="text-xs font-mono text-cyan-600 mb-1">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-base font-semibold text-zinc-100 mb-1">{rule.title}</p>
            <p className="text-base text-zinc-400 leading-relaxed">{rule.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
