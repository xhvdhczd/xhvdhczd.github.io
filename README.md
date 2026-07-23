# 颜培志 · 个人博客

一个基于 **Vite + React 18 + React Router 6 + MUI v5 + Tailwind CSS v3** 的静态个人博客，
面向脉冲涡流无损检测（Pulsed Eddy Current NDT）方向的研究与分享。

## 技术栈

- **构建工具**：Vite 5
- **框架**：React 18
- **路由**：React Router 6
- **UI 组件库**：Material UI (MUI) v5
- **布局工具类**：Tailwind CSS v3（`preflight` 已关闭以避免与 MUI 冲突）
- **Markdown 渲染**：`react-markdown` + `remark-gfm` + `rehype-highlight`（代码高亮）
- **深色模式**：MUI `ThemeProvider`，`palette.mode` 在 `light/dark` 间切换，持久化到 `localStorage`

## 目录结构

```
personal-blog/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md
└── src/
    ├── main.jsx                 # 应用入口
    ├── App.jsx                  # 路由配置
    ├── index.css                # Tailwind 指令 + highlight.js 主题 + Markdown 样式
    ├── theme/ThemeModeProvider.jsx  # 深色模式 Context / Provider
    ├── components/
    │   ├── Layout.jsx           # 全局布局（导航 + 内容区）
    │   ├── NavBar.jsx           # 顶部导航栏
    │   ├── ThemeToggle.jsx      # 深色模式切换按钮
    │   ├── PostCard.jsx         # 文章卡片
    │   ├── TagChips.jsx         # 标签 chips
    │   └── MarkdownRenderer.jsx # Markdown 渲染组件
    ├── pages/
    │   ├── HomePage.jsx         # 首页文章列表
    │   ├── PostPage.jsx         # 文章详情
    │   ├── TagPage.jsx          # 按标签筛选
    │   └── AboutPage.jsx        # 关于页
    ├── hooks/
    │   └── usePosts.js          # 文章数据 hook（含派生数据）
    ├── utils/
    │   └── parseFrontmatter.js  # 轻量 frontmatter 解析
    └── content/
        └── post-*.md            # 示例 Markdown 文章
```

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 新增文章

在 `src/content/` 下新建 `xxx.md`，使用如下 frontmatter：

```markdown
---
title: 文章标题
date: 2026-07-21
tags: [脉冲涡流, 学术]
excerpt: 一句话摘要
slug: optional-custom-slug
---

正文（支持 Markdown 全语法 + 代码高亮）……
```

文章会在构建期通过 `import.meta.glob` 自动加载，无需手动注册。

## 深色模式

- 首次加载读取系统 `prefers-color-scheme`
- 手动切换后写入 `localStorage`（key: `blog-theme-mode`）
- 刷新后保留上次选择
