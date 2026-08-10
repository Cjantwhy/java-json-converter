# SEO 内容设计说明

> 文案权威源在 `scripts/seo-content.mjs`（结构化数据，被构建脚本注入 HTML）。本文件只记录设计决策与关键词策略，便于审阅与后续迭代。

## 目标关键词

| 语言 | 主词 | 长尾 |
|---|---|---|
| 中文 | Java 实体类转 JSON | Java POJO 转 JSON、Java class 生成 JSON、@JsonProperty JSON 示例 |
| 英文 | Java entity to JSON converter | Java POJO to JSON online、generate JSON from Java class |

## 设计决策

1. **静态内容真实可见**：SEO 文案放在 React `#root` 之后的 `<section>`，用内联 `<style>` 独立样式（不依赖 Tailwind 按需生成的类），用户滚动到底部可见，爬虫直接抓到。**不使用 `sr-only` 隐藏**，避免灰帽风险。
2. **双 URL 双 HTML**：`/zh` 与 `/en` 是构建产物里的真实文件，各自携带独立的 `<title>`/`description`/`canonical`/`hreflang`/`og:*`/JSON-LD，不靠 JS 区分。
3. **文案严格对齐真实能力**：所有"功能特性"条目对应 `src/core/parser.ts`、`src/core/typeDefaults.ts`、`src/core/converter.ts` 的实际行为，不虚构。深度上限 5、跳过 `serialVersionUID`、`import` 解析、`@JsonProperty`/`@SerializedName`/`@JSONField` 三种注解等均来自代码与 `AGENTS.md`。
4. **JSON-LD**：使用 `WebApplication` schema，含 `offers.price = 0`，帮助 Google 识别为免费在线工具并可能出 rich snippet。
5. **域名**：`https://java2json.cjantwhy.com`（Cloudflare Workers 自定义子域，部署前需在 Dashboard 绑定）。

## 注入位置（构建脚本 `scripts/generate-seo-html.mjs` 负责）

- `<head>`：替换 `<title>`，注入 description/keywords/canonical/hreflang/og:*/twitter:*/JSON-LD
- `<body>`：在 `<div id="root"></div>` 之后追加 `<section id="seo-content">…</section>`
- 输出：`dist/zh/index.html`、`dist/en/index.html`；`dist/index.html` 改为根据浏览器语言重定向到 `/zh` 或 `/en`

## 验证要点

- `curl /zh` 不执行 JS 也能看到 H1、特性列表、FAQ 文本
- `<link rel="canonical">` 与 `<link rel="alternate" hreflang>` 正确互指
- `npm run build` 通过（TS strict + 构建脚本无错）
