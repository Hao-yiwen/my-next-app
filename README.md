# Next.js 入门练习

学习记录：用一个小型示例对照 Next.js 的 Pages Router 与 App Router，以及 SSR、SSG / ISR、CSR 和 `getInitialProps`。数据层是内存里的 Todo 接口，文章和用户列表来自 [JSONPlaceholder](https://jsonplaceholder.typicode.com)。

![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)
![React](https://img.shields.io/badge/React-19.0.0-149ECA)
![Node](https://img.shields.io/badge/Node-%3E%3D18.18-339933)

## 路由与内容

| 路径 | 实现 | 数据从哪来 | 页面在做什么 |
| --- | --- | --- | --- |
| `/` | `pages/index.js` | 无 | 客户端挂载后 `router.replace('/todos')` |
| `/todos` | `next.config.mjs` 重写到 `pages/todo/list.js` | `GET /api/todos`（`getInitialProps`） | 类组件 Todo 列表：新增、勾选、删除，并用 `react-hot-toast` 提示 |
| `/todo/[id]` | `pages/todo/[id].js` | `getStaticPaths` + `getStaticProps`（`revalidate: 10`） | 详情页骨架。当前详情接口拿不到列表数据，见下方「现状」 |
| `/posts` | `pages/posts.js` | `getServerSideProps` 请求 JSONPlaceholder | 服务端先渲染 10 篇文章，按钮在客户端继续翻页 |
| `/users` | `app/users/page.js`（`'use client'`） | 浏览器里 `fetch` JSONPlaceholder | App Router 客户端列表示例。首屏 HTML 只有加载状态 |
| `/test` | `pages/test.js` | `getServerSideProps` 请求 `/api/test` | 源码注释为「水合报错探索」：服务端渲染接口返回的 `count`，挂载后 `useEffect` 把数字改成 `10` |
| `/api/hello` | `pages/api/hello.js` | 无 | 返回 `{ "name": "John Doe" }` |
| `/api/test` | `pages/api/test.js` | 无 | 返回 `{ "count": 2 }` |
| `/api/todos` | `pages/api/todos.js` | 模块内数组 | `GET` / `POST` / `PUT` / `DELETE`。进程重启后数据清空 |
| `/api/todos/[id]` | `pages/api/todos/[id].js` | 试图读取上面的数组 | 见「现状」：具名导入在源码里不成立 |

`middleware.js` 会挡住全部 `/api/*`：请求头 `x-api-key` 必须等于环境变量 `NEXT_PUBLIC_API_KEY`，否则返回 `401`。页面路由不校验这个头，但会打访问日志，并加上 `x-request-time`、`x-powered-by` 和 CORS 头。

## 技术栈

版本取自 `package.json` 与 `package-lock.json` 中已锁定的安装结果。

| 包 | 锁定版本 | 在本仓库中的用途 |
| --- | --- | --- |
| `next` | 15.1.3 | 框架。`reactStrictMode: true` |
| `react` / `react-dom` | 19.0.0 | UI |
| `react-hot-toast` | 2.4.1 | Todo 操作提示，挂在 `pages/_app.js` |
| `tailwindcss` | 3.4.17 | `styles/globals.css` 与页面上的 class |
| `postcss` / `autoprefixer` | 8.4.49 / 10.4.20 | Tailwind 构建链 |
| `eslint` / `eslint-config-next` | 9.17.0 / 15.1.3 | `npm run lint` |
| `sass` | 1.83.0 | 依赖已安装；业务代码里没有 `.scss` 文件 |
| `mongodb` / `mongoose` | 6.12.0 / 8.9.3 | 依赖已安装；`lib/mongodb.js`、`models/Todo.js` 是空文件，接口没有连接数据库 |

样式相关还有 `css-loader`、`style-loader`、`sass-loader`，由 `next.config.mjs` 的自定义 webpack 规则引用。

## 目录

```text
.
├── app/
│   ├── layout.js              # App Router 根布局（未引入 globals.css）
│   └── users/page.js          # /users
├── pages/
│   ├── _app.js                # 引入 Tailwind 入口样式和 Toaster
│   ├── _document.js
│   ├── index.js               # /
│   ├── posts.js               # /posts
│   ├── test.js                # /test
│   ├── test.css
│   ├── api/                   # hello、test、todos
│   └── todo/                  # list.js、[id].js
├── components/Navigation.js   # 未被任何页面引用
├── constants/routes.js        # 列表页用到的路径
├── lib/cors.js                # API 路由里的 CORS
├── lib/mongodb.js             # 空文件
├── models/Todo.js             # 空文件
├── middleware.js
├── styles/globals.css
├── public/                    # create-next-app 留下的图标，页面代码未引用
├── next.config.mjs            # 重写规则与自定义 CSS loader
└── package.json
```

`jsconfig.json` 把 `@/*` 映射到仓库根目录。`.vscode/launch.json` 里的 Node 可执行文件指向作者本机的 nvm 路径，换机器后不能直接用来调试。

## 环境

- Node.js：`next@15.1.3` 要求 `^18.18.0 || ^19.8.0 || >= 20.0.0`
- npm
- `/posts`、`/users` 需要能访问 `jsonplaceholder.typicode.com`
- 环境变量 `NEXT_PUBLIC_API_KEY`

`pages/test.js` 和 `pages/todo/[id].js` 把请求头写成了字面量 `your-api-key`。本地要把环境变量设成同一个值，这两处服务端请求才能通过中间件。`pages/todo/list.js` 读取的是 `process.env.NEXT_PUBLIC_API_KEY`。

在项目根目录建立 `.env.local`（已被 `.gitignore` 忽略）：

```bash
NEXT_PUBLIC_API_KEY=your-api-key
```

开发环境下，中间件和 `lib/cors.js` 允许的跨域来源是 `http://localhost:3001`。页面本身跑在 `3000`，同源的 `/api` 请求不受这条来源限制。生产环境改读 `NEXT_PUBLIC_API_URL`，仓库里没有提供该变量的默认值。

## 安装与运行

`package-lock.json` 里的 tarball 地址指向 `artifactory.release.ctripcorp.com`。能访问该源时：

```bash
npm ci
```

然后：

```bash
npm run dev
```

浏览器打开 <http://localhost:3000>。首页脚本会转到 `/todos`。

常用脚本：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | `next dev`，开发服务器 |
| `npm run build` | `next build` |
| `npm start` | `next start`，需要先构建成功 |
| `npm run lint` | `next lint` |

带请求头调用 Todo 接口的例子：

```bash
curl -H "x-api-key: your-api-key" http://localhost:3000/api/todos

curl -X POST \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text":"学习 Next.js"}' \
  http://localhost:3000/api/todos
```

`POST` 写入的字段是 `text`。`PUT` 的 JSON 体是 `{ "id", "completed" }`。`DELETE` 使用查询参数 `?id=`。

## 本次核对过的结果

核对环境：Node.js v22.23.4、npm 10.9.9。当前环境访问不到锁文件里的内网源，因此把 tarball 地址临时改到 `registry.npmjs.org` 后执行了 `npm ci`（该改动没有提交），再设置 `NEXT_PUBLIC_API_KEY=your-api-key` 启动开发服务器。

开发服务器可以启动（Next.js 15.1.3，约 1 秒内 Ready）。随后用 HTTP 请求核对：

- `GET /` 返回 `pages/index.js` 的空页面，状态码 200。`next.config.mjs` 虽把 `/` 重写到 `/todo/list`，但 `pages/index.js` 已存在，这次请求命中的是页面文件。
- `GET /todos` 返回标题为 Todo List 的列表页，初始列表为空。
- `GET /posts` 返回 10 篇 JSONPlaceholder 文章（例如 *sunt aut facere...*）。
- `GET /users` 返回 Users List 和加载动画，HTML 中还没有用户姓名。
- `GET /test` 返回数字 `2`（接口 `{ "count": 2 }`）。
- `GET /api/hello` 不带头时 `401`，带上 `x-api-key: your-api-key` 时返回 `{ "name": "John Doe" }`。
- `POST`、`GET`、`DELETE /api/todos` 在带密钥时返回 201 / 200 / 200。
- `GET /todo/1` 返回 200，但文案是 `Detail page for todo: undefined`。

同一环境下：

- `npm run lint` 失败，信息为 `Cannot serialize key "parse" in parser: Function values are not supported.`
- `npm run build` 失败，停在 `Failed to collect page data for /todo/[id]`。构建期 `getStaticPaths` 请求 `http://localhost:3000/api/todos`，当时没有服务在听该端口（`ECONNREFUSED`）。编译阶段还有一条导入警告：`todos` 没有从 `pages/api/todos.js` 导出。
- `npm start` 依赖构建产物，这次没有跑起来。

开发服务器和构建都会打印：`Built-in CSS support is being disabled due to custom CSS configuration being detected.` 原因是 `next.config.mjs` 用 webpack 自行处理了 `css` / `scss`。返回的 HTML 带有 Tailwind 的 class 名，本次响应里没有注入对应样式表。

## 现状

这些行为都来自当前源码，阅读示例时需要一起看：

- Todo 只存在 `pages/api/todos.js` 的模块级变量里，刷新进程即丢失。`mongodb` / `mongoose` 没有接到任何路由。
- `pages/api/todos/[id].js` 写的是 `import { todos } from '../todos'`，而 `pages/api/todos.js` 没有导出 `todos`。详情接口因此返回 `{ "message": "Todo not found" }`。详情页把这份 JSON 当成了 todo 对象，所以标题是空的。
- `getStaticPaths` 在构建时访问本机 `3000` 端口。单独执行 `npm run build` 时该请求会失败，生产构建停在 `/todo/[id]`。
- `app/layout.js` 没有引入 `styles/globals.css`，这份样式只在 Pages Router 的 `_app.js` 里引用。
- `components/Navigation.js` 没有被引用，文件里也没有导入 `Link`。
- `next.config.mjs` 里 `/posts` → `/posts`、`/todo/:id` → `/todo/:id` 没有改变路径。`/users` → `/app/users` 与 App Router 的实际地址 `/users` 不一致；这次开发服务器上的 `/users` 是由 `app/users/page.js` 直接响应的。

## 参考

- [Next.js 文档：Pages Router 的数据获取](https://nextjs.org/docs/pages/building-your-application/data-fetching)（`getServerSideProps`、`getStaticProps`、`getStaticPaths`、`getInitialProps`）
- [Next.js 文档：App Router](https://nextjs.org/docs/app)
- [Next.js 文档：Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com)
