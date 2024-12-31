# nesxtjs入门

- ssr
    - getServerSideProps
    - getInitialProps
- ssg
    - getStaticPaths
    - getStaticProps


## 三种渲染模式

- ssr
    - 用户每次进行请求都都会重新生成
        - 实时性高的应用 大多数应用都是这样的

- isr(ssg增强版本 不会每次进入都会重新生成)
    - 用户手机进入后构建成静态页面 fallback
    - 在没有超时的情况下不会重新构建静态页面 revalidate 单位是秒

- ssg
    - 在应用构建的时候就生成完毕了 用户直接使用就可以

- csr
    - 渲染都在客户端
    - 服务端只负责下发js文件和html骨架 渲染在客户端进行