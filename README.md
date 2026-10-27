# 罗技 · 灵感种草工作台

React + Vite 罗技鼠标种草网页，通过服务端调用 Dify 工作流。

## 运行

Node.js 20.19+ 或 22.12+，安装依赖后：

```sh
pnpm install
pnpm dev
```

默认 http://127.0.0.1:5173，构建 `pnpm build`。

## 基础版范围

四款产品切换、创作 brief、生成范围选择、视频镜头输入、三个渠道的文案标签切换、复制与 JSON 导出。点击生成会调用 Dify 工作流；生成前的图片与动态画面为预览示意。

## DSL 输入对应

| 字段 | 要求 |
| --- | --- |
| product | Pebble M350s 白色 / LIFT 玫瑰粉 / MX Master 3S 石墨灰 / POP Mouse Blast 黄黑 |
| campaign | 必填，最多 20 字 |
| audience | 必填，最多 60 字 |
| want | 只要文案 / 文案 + 配图 / 文案 + 配图 + 视频 |
| shot | 选填，最多 500 字 |

服务端解析 `data.outputs.result`（JSON 字符串），读取 `xhs.title/body/tags`、`douyin.script`、`detail.headline/points/price`，并接入 `image_url`、`video_url`、`verdict`、`reason`、`error`。图片/视频为空时保留独立状态与错误提示。媒体生成耗时较长，正式集成应使用流式工作流执行并显示阶段进度。

原始 DSL 含服务密钥，未复制到本项目。密钥不得放到 React、VITE_ 环境变量、静态资源或 Git 中。服务端通过环境变量保存应用级 Dify 密钥。

## AeroShards 背景

已集成用户提供的 React Bits AeroShards JavaScript + CSS 组件，锁定 `vgpu@0.5.0`（该源码使用原始 WGSL，不能直接使用要求 ShaderSource v2 的 0.6 版本）。背景固定于视口底层，降低速度、亮度及设备像素比；不拦截表单点击。不支持 WebGPU 时回退到 CSS 碎片背景，并遵循减少动态效果偏好。

## 本机试运行与 Vercel

在项目目录先执行 `npm run build`，再执行 `node dev-server.js`，打开 http://localhost:3002。服务启动时读取同目录的 `local.env`；请自行填写 Dify API 密钥，切勿提交该文件。Vercel 部署使用根目录 `index.html`、构建产物 `dist` 与 `api/generate.js`，请在 Vercel 项目环境变量中配置 `DIFY_API_BASE` 和 `DIFY_API_KEY`。网页只调用自己的 `/api/generate`，由服务端调用 Dify 的工作流接口。工作流使用阻塞模式，长时间运行可能超时，图片和视频需由工作流返回可访问的链接。

## Cloudflare Workers 部署

将仓库连接到 Cloudflare Workers Builds，Worker 名称使用 `pick-assistant`。构建命令为 `npm run build`，部署命令为 `npx wrangler deploy`。在 Worker 的生产环境运行时变量中配置 `DIFY_API_BASE`，并以 Secret 类型配置 `DIFY_API_KEY`。Dify 云端使用其应用 API 页面提供的地址；`localhost` 指向 Worker 自身，不能用于访问个人电脑上的 Dify。配置后部署并测试真实工作流，图片及视频链接需可从访问者的浏览器访问。请自行设置访问控制或使用限制，公开网页可能产生模型调用费用。
