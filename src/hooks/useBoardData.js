// ============================================================
// useBoardData.js
// データ取得・操作ロジックを集約したカスタムフック
// mockService を差し替えるだけでAPI連携可能
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { mockService } from "../services/mockService";
import { checkAndRecordPost, checkAndRecordThread } from "../services/rateLimiter";

// ----- スレッド一覧用 -----
export function useThreads() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    const data = await mockService.getThreads();
    setThreads(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = useCallback(async (title) => {
    const result = checkAndRecordThread();
    if (!result.ok) throw new Error(result.message);
    const newThread = await mockService.createThread(title);
    setThreads((prev) => [newThread, ...prev]);
    return newThread;
  }, []);

  return { threads, loading, createThread, refetch: fetchThreads };
}

// ----- 投稿一覧用 -----
export function usePosts(threadId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    const data = await mockService.getPosts(threadId);
    setPosts(data);
    setLoading(false);
  }, [threadId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (body) => {
    const result = checkAndRecordPost();
    if (!result.ok) throw new Error(result.message);
    const newPost = await mockService.createPost(threadId, body);
    setPosts((prev) => [...prev, newPost]);
    return newPost;
  }, [threadId]);

  return { posts, loading, createPost };
}
