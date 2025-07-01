"use client";

import { useState, useEffect } from 'react';

export default function WakaTimeDisplay() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/wakatime');
          const result = await response.json();
          setData(result);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [hasMounted]);

  return (
    <div className="wakatime-display bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">编码时间统计</h2>
      {!hasMounted || loading ? (
        <div className="text-gray-500">加载中...</div>
      ) : error ? (
        <div className="text-red-500 text-sm mb-3 p-3 bg-red-50 rounded border border-red-200">
          ⚠️ {error}
        </div>
      ) : data ? (
        <div>
          <div className="text-3xl font-mono text-indigo-600">
            {data.total_seconds ? `${Math.floor(data.total_seconds / 3600)}h ${Math.floor((data.total_seconds % 3600) / 60)}m` : '0h 0m'}
          </div>
          <p className="text-gray-500 text-sm mt-2">基于WakaTime数据</p>
        </div>
      ) : (
        <div>暂无数据</div>
      )}
    </div>
  );
}