# calvinsfweb.top · Portfolio

纯静态个人作品集网站。部署在 Vercel，通过腾讯云域名 `calvinsfweb.top` 访问。

## 本地预览

```bash
npx http-server -p 5181 -c-1
# 浏览器打开 http://localhost:5181
```

## 修改内容

- 图片路径 / 个人信息：改 `content.js`
- 文字排版：改对应的 `*.html`
- 样式：改 `shared.css` / `journal.css` / `pages.css`
- 图片放到 `images/` 里（保持文件名和 `content.js` 里的路径一致）

详细说明见 `内容图片替换指南.md`。

## 部署到 Vercel

1. 改完代码后：
   ```bash
   git add .
   git commit -m "update content"
   git push
   ```
2. Vercel 会自动重新部署，1～2 分钟内生效。

## 技术栈

纯 HTML / CSS / JavaScript，无构建步骤，无框架。
