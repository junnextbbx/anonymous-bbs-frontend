// ============================================================
// rateLimiter.js
// localStorageを使った匿名ユーザ識別 + 投稿レート制限
//
// localStorage キー:
//   anon_bbs_id          … 匿名ユーザID（初回生成、以降固定）
//   anon_bbs_rate_post   … 投稿用カウンタ { date, count, lastAt }
//   anon_bbs_rate_thread … スレッド作成用カウンタ { date, count, lastAt }
// ============================================================

const ANON_ID_KEY = "anon_bbs_id";

// ---- 匿名ID ------------------------------------------------

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** localStorageから匿名IDを取得。未存在なら生成して保存する。 */
export function getAnonId() {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

// ---- 汎用チェッカー ----------------------------------------

function getToday() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function loadRate(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? {};
  } catch {
    return {};
  }
}

/**
 * 汎用レート制限チェッカーを生成する。
 * @param {{ storageKey: string, dailyLimit: number, cooldownMs: number }} config
 * @returns {() => { ok: true } | { ok: false, message: string }}
 */
function makeChecker({ storageKey, dailyLimit, cooldownMs }) {
  return function checkAndRecord() {
    getAnonId(); // IDが未生成なら初期化

    const today = getToday();
    const rate  = loadRate(storageKey);

    // 日付が変わっていたらリセット
    if (rate.date !== today) {
      rate.date  = today;
      rate.count = 0;
      delete rate.lastAt;
    }

    const now = Date.now();

    // クールダウンチェック
    if (rate.lastAt != null && now - rate.lastAt < cooldownMs) {
      const wait = Math.ceil((cooldownMs - (now - rate.lastAt)) / 1000);
      return { ok: false, message: `連続投稿はできません。あと ${wait} 秒お待ちください。` };
    }

    // 日次上限チェック
    if ((rate.count ?? 0) >= dailyLimit) {
      return { ok: false, message: `本日の上限（${dailyLimit}件）に達しました。また明日どうぞ。` };
    }

    // 記録して OK を返す
    rate.count = (rate.count ?? 0) + 1;
    rate.lastAt = now;
    localStorage.setItem(storageKey, JSON.stringify(rate));

    return { ok: true };
  };
}

// ---- 公開チェッカー ----------------------------------------

/** 投稿用: 1日50件まで、10秒クールダウン */
export const checkAndRecordPost = makeChecker({
  storageKey: "anon_bbs_rate_post",
  dailyLimit: 50,
  cooldownMs: 10_000,
});

/** スレッド作成用: 1日5件まで、60秒クールダウン */
export const checkAndRecordThread = makeChecker({
  storageKey: "anon_bbs_rate_thread",
  dailyLimit: 5,
  cooldownMs: 60_000,
});
