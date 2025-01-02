/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 启用 App Router
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      // 主页路由
      {
        source: "/",
        destination: "/todo/list",
      },
      // 待办事项列表
      {
        source: "/todos",
        destination: "/todo/list",
      },
      // 待办事项详情
      {
        source: "/todo/:id",
        destination: "/todo/:id",
      },
      {
        source: "/posts",
        destination: "/posts",
      },
      // 新增用户列表路由
      {
        source: "/users",
        destination: "/app/users",
      },
    ];
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(scss|css)$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    });
    return config;
  },
};

export default nextConfig;
