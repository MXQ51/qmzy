"use client";

import dynamic from 'next/dynamic';

const WakaTimeDisplay = dynamic(() => import('./WakaTimeDisplay'), {
  ssr: false,
  loading: () => <div className="text-gray-500">加载中...</div>
});

export default WakaTimeDisplay;