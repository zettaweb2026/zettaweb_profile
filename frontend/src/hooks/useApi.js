/**
 * hooks/useApi.js — Generic data-fetching hook.
 * Replaces boilerplate useState + useEffect + try/catch in every component.
 *
 * Usage:
 *   const { data, loading, error } = useApi(() => contentService.getProjects());
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * @param {() => Promise<any>} fetchFn  — A function that returns a Promise.
 * @param {any[]} deps                  — Dependency array (like useEffect).
 * @param {any} initialData             — Initial value for `data`.
 */
const useApi = (fetchFn, deps = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useApi;
