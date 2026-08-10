// 构建后处理：把 dist/index.html 复制为 /zh/index.html 和 /en/index.html，
// 各自注入对应语言的 <title>/meta/JSON-LD/静态 SEO 内容；根 dist/index.html 改为重定向。
// 由 `npm run build` 末尾自动调用。
//
// 设计与设计决策见 .planning/seo-content.md；文案权威源在 ./seo-content.mjs。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { SEO_CONTENT, SITE } from './seo-content.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHeadInject(locale) {
  const c = SEO_CONTENT[locale]
  const url = `${SITE.domain}/${locale}`
  const ogImage = `${SITE.domain}${SITE.ogImage[locale]}`
  const zhUrl = `${SITE.domain}/zh`
  const enUrl = `${SITE.domain}/en`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: c.h1,
    url,
    description: c.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: c.features.items.map(([title]) => title),
  }

  return [
    `<meta name="description" content="${esc(c.description)}">`,
    `<meta name="keywords" content="${esc(c.keywords)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<link rel="alternate" hreflang="zh" href="${esc(zhUrl)}">`,
    `<link rel="alternate" hreflang="en" href="${esc(enUrl)}">`,
    `<link rel="alternate" hreflang="x-default" href="${esc(zhUrl)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(c.title)}">`,
    `<meta property="og:description" content="${esc(c.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(ogImage)}">`,
    `<meta property="og:locale" content="${locale === 'zh' ? 'zh_CN' : 'en_US'}">`,
    `<meta property="og:site_name" content="${esc(c.h1)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(c.title)}">`,
    `<meta name="twitter:description" content="${esc(c.description)}">`,
    `<meta name="twitter:image" content="${esc(ogImage)}">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}

function buildSeoSection(locale) {
  const c = SEO_CONTENT[locale]

  const style = `
  <style>
    #seo-content{max-width:780px;margin:0 auto;padding:40px 16px 64px;color:#d1d5db;font-size:15px;line-height:1.7;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif}
    #root:empty ~ #seo-content{position:absolute !important;left:-10000px !important;top:auto !important;width:1px !important;height:1px !important;overflow:hidden !important;clip:rect(0,0,0,0) !important;white-space:nowrap !important}
    #seo-content h2{color:#f3f4f6;font-size:20px;font-weight:600;margin:32px 0 12px;padding-bottom:8px;border-bottom:1px solid #374151}
    #seo-content h1.seo-h1{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
    #seo-content p.intro{color:#9ca3af;margin:8px 0 0}
    #seo-content ul{list-style:none;padding:0;margin:0}
    #seo-content ul.features li{padding:8px 0;border-bottom:1px solid #1f2937}
    #seo-content ul.features li:last-child{border-bottom:0}
    #seo-content ul.features strong{color:#e5e7eb;display:block;margin-bottom:2px}
    #seo-content ul.features span{color:#9ca3af}
    #seo-content ol.steps{padding-left:20px;margin:0}
    #seo-content ol.steps li{padding:4px 0;color:#9ca3af}
    #seo-content .faq-item{padding:10px 0;border-bottom:1px solid #1f2937}
    #seo-content .faq-item:last-child{border-bottom:0}
    #seo-content .faq-q{color:#e5e7eb;font-weight:500;display:block;margin-bottom:4px}
    #seo-content .faq-a{color:#9ca3af}
    #seo-content .about{color:#9ca3af;background:#111827;border:1px solid #1f2937;border-radius:8px;padding:16px;margin-top:16px}
  </style>`

  const featuresHtml = c.features.items
    .map(
      ([title, desc]) =>
        `<li><strong>${esc(title)}</strong><span>${esc(desc)}</span></li>`
    )
    .join('\n      ')

  const stepsHtml = c.steps.items.map(step => `<li>${esc(step)}</li>`).join('\n      ')

  const faqHtml = c.faq.items
    .map(
      item =>
        `<div class="faq-item"><span class="faq-q">${esc(item.q)}</span><span class="faq-a">${esc(item.a)}</span></div>`
    )
    .join('\n      ')

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return `${style}
  <section id="seo-content" aria-label="${esc(locale === 'zh' ? '工具说明' : 'About this tool')}">
    <h1 class="seo-h1">${esc(c.h1)}</h1>
    <p class="intro">${esc(c.intro)}</p>

    <h2>${esc(c.features.title)}</h2>
    <ul class="features">
      ${featuresHtml}
    </ul>

    <h2>${esc(c.steps.title)}</h2>
    <ol class="steps">
      ${stepsHtml}
    </ol>

    <h2>${esc(c.faq.title)}</h2>
    ${faqHtml}

    <h2>${esc(c.aboutTitle)}</h2>
    <p class="about">${esc(c.about)}</p>

    <script type="application/ld+json">${JSON.stringify(faqLd).replace(/</g, '\\u003c')}</script>
  </section>`
}

function buildLocalizedHtml(locale) {
  const c = SEO_CONTENT[locale]
  let html = readFileSync(join(distDir, 'index.html'), 'utf8')

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${esc(c.lang)}"`)

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(c.title)}</title>`
  )

  const headInject = buildHeadInject(locale)
  if (html.includes('</head>')) {
    html = html.replace('</head>', `    ${headInject}\n  </head>`)
  } else {
    throw new Error('dist/index.html: </head> not found')
  }

  const section = buildSeoSection(locale)
  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  ${section}`)
  } else {
    throw new Error('dist/index.html: <div id="root"></div> not found')
  }

  return html
}

function buildRedirectHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <title>Java Entity to JSON Converter</title>
    <script>
      (function () {
        var lang = (navigator.language || 'en').toLowerCase();
        var target = lang.indexOf('en') === 0 ? '/en' : '/zh';
        window.location.replace(target);
      })();
    </script>
  </head>
  <body>
    <noscript>
      <p>Redirecting to <a href="/zh">/zh</a> (Chinese) or <a href="/en">/en</a> (English).</p>
    </noscript>
  </body>
</html>
`
}

if (!existsSync(distDir)) {
  console.error('[seo] dist/ not found. Run "vite build" first.')
  process.exit(1)
}

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('[seo] dist/index.html not found. Run "vite build" first.')
  process.exit(1)
}

mkdirSync(join(distDir, 'zh'), { recursive: true })
mkdirSync(join(distDir, 'en'), { recursive: true })

const zhHtml = buildLocalizedHtml('zh')
const enHtml = buildLocalizedHtml('en')

writeFileSync(join(distDir, 'zh', 'index.html'), zhHtml)
writeFileSync(join(distDir, 'en', 'index.html'), enHtml)
writeFileSync(join(distDir, 'index.html'), buildRedirectHtml())

console.log('[seo] Generated /zh/index.html and /en/index.html; root index.html now redirects.')
console.log(`[seo] zh: ${zhHtml.length} bytes, en: ${enHtml.length} bytes`)
