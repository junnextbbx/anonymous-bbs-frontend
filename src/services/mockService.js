// ============================================================
// mockService.js
// 疑似APIレイヤー。後からfetch/axiosに置き換えるだけでOK。
// ============================================================

let threads = [
  {
    id: "1",
    title: "Reactの学習ロードマップを教えて",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    postCount: 3,
  },
  {
    id: "2",
    title: "おすすめのダークテーマエディタは？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    postCount: 2,
  },
  {
    id: "3",
    title: "Tailwind CSS vs CSS Modules どっちが好き？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    postCount: 1,
  },
];

let posts = {
  "1": [
    { id: "p1", threadId: "1", body: "公式ドキュメントから始めるのが一番だと思います。あとはReact公式チュートリアルが充実してます！", createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    { id: "p2", threadId: "1", body: "個人的にはFreeCodeCampの動画が分かりやすかった。hooks中心に学ぶと良いよ", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: "p3", threadId: "1", body: "状態管理（useState→useReducer→Zustand）の順で理解すると良いかも", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  ],
  "2": [
    { id: "p4", threadId: "2", body: "VS CodeのOne Dark Proがシンプルで目に優しくて好きです", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
    { id: "p5", threadId: "2", body: "Tokyonight系のテーマ使ってる。Neovimと統一できて最高", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  ],
  "3": [
    { id: "p6", threadId: "3", body: "小規模ならCSS Modules、大規模プロジェクトはTailwindが便利だと感じます", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  ],
};

// 疑似遅延（API感を出すため）
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const mockService = {
  // スレッド一覧取得
  async getThreads() {
    await delay();
    return [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // スレッド新規作成
  async createThread(title, createdBy) {
    await delay();
    const newThread = {
      id: String(Date.now()),
      title,
      createdAt: new Date().toISOString(),
      postCount: 0,
      createdBy,
    };
    threads = [newThread, ...threads];
    posts[newThread.id] = [];
    return newThread;
  },

  // 投稿一覧取得
  async getPosts(threadId) {
    await delay();
    return posts[threadId] ? [...posts[threadId]] : [];
  },

  // 投稿作成
  async createPost(threadId, body, createdBy) {
    await delay();
    const newPost = {
      id: `p${Date.now()}`,
      threadId,
      body,
      createdAt: new Date().toISOString(),
      createdBy,
    };
    if (!posts[threadId]) posts[threadId] = [];
    posts[threadId] = [...posts[threadId], newPost];
    threads = threads.map((t) =>
      t.id === threadId ? { ...t, postCount: t.postCount + 1 } : t
    );
    return newPost;
  },
};
