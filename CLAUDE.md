# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 開発サーバー起動 (http://localhost:5173)
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

テストフレームワークは未導入。

## Architecture

React 18 + Vite + Tailwind CSS のシングルページアプリ。バックエンドは `http://localhost:8000/api` を想定している。

### データフロー

```
コンポーネント
  └─ useBoardData.js (カスタムフック)
       └─ apiService.js (fetch wrapper)
            └─ http://localhost:8000/api
```

`apiService.js` はバックエンドAPIとの通信を担い、snake_case → camelCase の変換も行う。切り替え用の `mockService.js`（インメモリ）も存在するが、現在は `useBoardData.js` が直接 `apiService` を import している。

### 匿名ユーザー識別

`rateLimiter.js` が localStorage を管理する：

| キー | 用途 |
|------|------|
| `anon_bbs_id` | 匿名ユーザーID（初回自動生成） |
| `anon_bbs_name` | 表示名（Settings ページで設定） |
| `anon_bbs_rate_post` | 投稿レート制限（1日50件・10秒クールダウン） |
| `anon_bbs_rate_thread` | スレッド作成レート制限（1日5件・60秒クールダウン） |

レート制限はクライアントサイドのみで、サーバー側には存在しない。

### ページ構成

`App.jsx` が React Router でルーティングを管理する。`BoardPage`（内部コンポーネント）が `selectedThread` の有無によって `ThreadList` と `ThreadDetail` を切り替える（URL ベースのルーティングではなく state で制御）。

| ルート | コンポーネント |
|--------|---------------|
| `/` | BoardPage → ThreadList / ThreadDetail |
| `/rules` | RulesPage |
| `/about` | AboutPage |
| `/settings` | SettingsPage |

### レイアウト

3カラム構成（左ナビ・中央メイン・右広告枠）。左右カラムは `md` ブレークポイント以上で表示。右カラムの広告スロットは現在コメントアウト済み。
