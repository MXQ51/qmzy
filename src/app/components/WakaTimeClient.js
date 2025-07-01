'use client';

import dynamic from 'next/dynamic';

// 动态导入WakaTimeDisplay组件并禁用SSR
const WakaTimeDisplay = dynamic(() => import('./WakaTimeDisplay'), { ssr: false });

export default function WakaTimeClient() {
  return <WakaTimeDisplay />;
}