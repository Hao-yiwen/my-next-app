/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // 主页路由
      {
        source: '/',
        destination: '/todo/list',
      },
      // 待办事项列表
      {
        source: '/todos',
        destination: '/todo/list',
      },
      // 待办事项详情
      {
        source: '/todo/:id',
        destination: '/todo/:id',
      },
    ];
  },
};

export default nextConfig;
