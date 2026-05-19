// ============================================================
// apiService.js
// バックエンドAPIとの通信レイヤー
// mockService と同じインターフェースを持ち、順次差し替えていく
// ============================================================

const API_BASE = "http://localhost:8000/api";

/** APIレスポンス(snake_case)をフロント形式(camelCase)に変換 */
function toThread(t) {
  return {
    id: t.id,
    title: t.title,
    createdBy: t.created_by,
    displayName: t.display_name ?? null,
    createdAt: t.created_at,
    postCount: t.post_count ?? 0,
  };
}

function toPost(p) {
  return {
    id: p.id,
    threadId: p.thread_id,
    body: p.body,
    createdBy: p.created_by,
    displayName: p.display_name ?? null,
    createdAt: p.created_at,
  };
}

export const apiService = {
  // スレッド一覧取得
  async getThreads() {
    const res = await fetch(`${API_BASE}/threads`);
    if (!res.ok) throw new Error(`スレッド一覧の取得に失敗しました (${res.status})`);
    const data = await res.json();
    return data.map(toThread);
  },

  // スレッド作成
  async createThread(title, createdBy, displayName) {
    if (!title?.trim()) throw new Error("タイトルを入力してください");
    const res = await fetch(`${API_BASE}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        created_by: createdBy?.trim() || "匿名",
        display_name: displayName?.trim() || null,
      }),
    });
    if (!res.ok) throw new Error(`スレッドの作成に失敗しました (${res.status})`);
    return toThread(await res.json());
  },

  // 投稿一覧取得
  async getPosts(threadId) {
    const res = await fetch(`${API_BASE}/threads/${threadId}/posts`);
    if (res.status === 404) throw new Error("スレッドが見つかりません");
    if (!res.ok) throw new Error(`投稿一覧の取得に失敗しました (${res.status})`);
    const data = await res.json();
    return data.map(toPost);
  },

  // 投稿作成
  async createPost(threadId, body, createdBy, displayName) {
    if (!body?.trim()) throw new Error("本文を入力してください");
    const res = await fetch(`${API_BASE}/threads/${threadId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: body.trim(),
        created_by: createdBy?.trim() || "匿名",
        display_name: displayName?.trim() || null,
      }),
    });
    if (res.status === 404) throw new Error("スレッドが見つかりません");
    if (!res.ok) throw new Error(`投稿に失敗しました (${res.status})`);
    return toPost(await res.json());
  },
};
