/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *', // 生产环境中应替换为QAnything的具体域名
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // 兼容旧浏览器
          },
        ],
      },
    ];
  },
};

export default nextConfig;
