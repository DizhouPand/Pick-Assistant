# 罗技 · 灵感种草工作台

React + Vite 本地基础预览版。与简历筛选项目独立，未修改原项目。

## 运行

Node.js 20.19+ 或 22.12+，安装依赖后：

```sh
pnpm install
pnpm dev
```

默认 http://127.0.0.1:5173，构建 `pnpm build`。

## 基础版范围

四款产品切换、创作 brief、生成范围选择、视频镜头输入、三个渠道的文案标签切换、复制与 JSON 导出。点击生成运行本地演示，不消耗模型或媒体额度。配图为 SVG 构图示意；短片为 CSS 动态示意，不是假称真实生成视频。

## DSL 输入对应

| 字段 | 要求 |
| --- | --- |
| product | Pebble M350s 白色 / LIFT 玫瑰粉 / MX Master 3S 石墨灰 / POP Mouse Blast 黄黑 |
| campaign | 必填，最多 20 字 |
| audience | 必填，最多 60 字 |
| want | 只要文案 / 文案 + 配图 / 文案 + 配图 + 视频 |
| shot | 选填，最多 500 字 |

后续接入服务端 Dify 代理时，解析 `data.outputs.result`（JSON 字符串），读取 `xhs.title/body/tags`、`douyin.script`、`detail.headline/points/price`，并接入 `image_url`、`video_url`、`verdict`、`reason`、`error`。图片/视频为空时保留独立状态与错误提示。媒体生成耗时较长，正式集成应使用流式工作流执行并显示阶段进度。

原始 DSL 含服务密钥，未复制到本项目。密钥不得放到 React、VITE_ 环境变量、静态资源或 Git 中。未来通过服务端环境变量保存应用级 Dify 密钥。当前版本无任何真实 API 调用。

## AeroShards 背景

已集成用户提供的 React Bits AeroShards JavaScript + CSS 组件，锁定 `vgpu@0.5.0`（该源码使用原始 WGSL，不能直接使用要求 ShaderSource v2 的 0.6 版本）。背景固定于视口底层，降低速度、亮度及设备像素比；不拦截表单点击。不支持 WebGPU 时回退到 CSS 碎片背景，并遵循减少动态效果偏好。
