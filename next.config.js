/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 动态部署模式 - 启用服务器端渲染(SSR)和API路由
  // 已移除 output: 'export' 静态导出配置
  
  // 静态文件配置 - 确保public目录的文件可访问
  async rewrites() {
    return [
      // 所有 /uploads/ 路径直接返回 public 目录的文件
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*'
      }
    ]
  },

  // 启用图片优化（动态部署模式）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
