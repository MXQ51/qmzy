//页脚将显示最近7天的编码时长统计，格式为 Xh Ym ，数据每7天自动更新。
//- 使用 useEffect 钩子在组件挂载时调用WakaTime API
//解析返回的JSON数据计算总编码时长（小时和分钟）
// 处理API请求错误并显示友好提示
// 应用基础样式确保页脚在页面底部居中显示
"use client";
import { useState, useEffect } from 'react';

export default function Footer() {
  const [codingTime, setCodingTime] = useState('');
  const [error, setError] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const fetchCodingTime = async () => {
      try {
        const response = await fetch('/api/wakatime');
        const data = await response.json();

        if (data.error) {
          setError(`获取编码时长失败: ${data.error}`);
          console.error('WakaTime API错误:', data.error);
        } else {
          const totalSeconds = data?.total_seconds || 0;
          // 计算小时和分钟
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          setCodingTime(`${hours}小时${minutes}分钟`);
        }
      } catch (err) {
        setError(`无法获取编码时长数据: ${err.message}`);
        console.error('获取WakaTime数据失败:', err);
      }
    };

    fetchCodingTime();
  }, []);

  return (
    <footer className="w-full py-6 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-500">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>最近7天编码时长: {hasMounted ? (codingTime || '0小时0分钟') : '加载中...'}</p>
        )}
        <p className="mt-2">© {new Date().getFullYear()} 个人网站. 保留所有权利.</p>
      </div>
    </footer>
  );
}