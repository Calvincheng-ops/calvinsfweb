# 上头阿豪 · The Ahao Journal

程志豪的个人作品与生活网站。沿用暖深色封面、米白纸张与杂志排版，使用原生 HTML / CSS / JavaScript，无构建依赖。

线上：https://www.calvinsfweb.top

## 本地预览

在仓库根目录运行：

```sh
python3 -m http.server 5181 --bind 127.0.0.1
```

浏览器打开 http://127.0.0.1:5181 。

## 页面与维护入口

| 页面 | 内容 |
| --- | --- |
| index.html | 首页、精选作品、实习摘要和生活入口 |
| about.html | 个人介绍、教育、能力与荣誉 |
| experience.html | 实习与实践 |
| projects.html | 九个项目、分类筛选、访问与源码链接 |
| life.html | 学生会、校园业务项目与纪念站 |
| gallery.html | 真实照片及键盘可操作的放大浏览 |
| thoughts.html | 从项目资料整理的实践手记 |
| contact.html | 邮件链接、复制邮箱、GitHub |

- 正文是各 HTML 内的静态内容；修改经历后同步首页摘要。
- `editorial.css` 是本版所有页面使用的样式。旧版 `shared.css`、`journal.css`、`pages.css` 保留作历史参考，不再加载。
- `pages.js` 管理手机导航、项目筛选、照片浏览和邮箱复制。
- `content.js` 是公开信息索引，不自动渲染正文；更新资料时一并同步。
- `images/` 放图片。更新图片请使用新文件名，避免一年 immutable 缓存仍展示旧图。
- `fonts/` 自托管 Cormorant Garamond 常规/斜体，附 SIL Open Font License；中文优先使用设备自带宋体，正文使用系统中文黑体。
- 更改页面地址时同步 `sitemap.xml`、导航和 canonical 链接。

## 发布

检查工作区及差异，本地预览桌面和手机页面，选择本次文件提交，然后推送 `main`。GitHub 关联的 Vercel 项目自动部署。发布后检查提交部署状态和线上内容。

## 2026-10-24 更新

新增经历、作品页；八页真实内容统一排版；替换模板身份、社交链接与模拟留言表单；支持键盘照片浏览、手机导航焦点管理、减少动态效果偏好和无 JavaScript 正文访问。

进博纪念站的原域名在本次核验时连接异常，GitHub 仓库匿名访问返回 404，因此项目页保留原站地址、不可用说明及联系入口。Self Change 需要登录，本站不提供账户或私人记录。
