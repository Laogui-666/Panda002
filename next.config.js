/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC === 'true';

const nextConfig = {
  reactStrictMode: true,
  
  // 静态导出模式（用于本地CDN部署）
  ...(isStaticExport && {
    output: 'export',
  }),
  
  // 静态文件配置 - 确保public目录的文件可访问
  async rewrites() {
    return [
      // 所有 /uploads/ 路径直接返回 public 目录的文件
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*'
      }
    ];
  },
  
  // 允许从 /uploads 目录提供静态文件
  staticPageGenerationTimeout: 60,
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
