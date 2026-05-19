// ============================================================
// useBoardData.js
// データ取得・操作ロジックを集約したカスタムフック
// mockService を差し替えるだけでAPI連携可能
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiService } from "../services/apiService";
import { checkAndRecordPost, checkAndRecordThread, getAnonId, getDisplayName } from "../services/rateLimiter";

// ----- スレッド一覧用 -----
export function useThreads() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const anonymousId = useMemo(() => getAnonId(), []);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getThreads();
      setThreads(data);
    } catch (e) {
      console.error(e);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = useCallback(async (title) => {
    const result = checkAndRecordThread();
    if (!result.ok) throw new Error(result.message);
    const displayName = getDisplayName()?.trim() || null;
    const newThread = await apiService.createThread(title, anonymousId, displayName);
    setThreads((prev) => [newThread, ...prev]);
    return newThread;
  }, [anonymousId]);

  return { threads, loading, createThread, refetch: fetchThreads, anonymousId };
}

// ----- 投稿一覧用 -----
export function usePosts(threadId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const anonymousId = useMemo(() => getAnonId(), []);

  const fetchPosts = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    try {
      const data = await apiService.getPosts(threadId);
      setPosts(data);
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (body) => {
    const result = checkAndRecordPost();
    if (!result.ok) throw new Error(result.message);
    const displayName = getDisplayName()?.trim() || null;
    const newPost = await apiService.createPost(threadId, body, anonymousId, displayName);
    setPosts((prev) => [...prev, newPost]);
    return newPost;
  }, [threadId, anonymousId]);

  return { posts, loading, createPost };
}
