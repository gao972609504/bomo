# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-06-12

### Changed

- **状态栏精致化 (Inkstone 2.0)**
  - 移除全部 emoji，引入 25 个内联 SVG 线性图标（1.5 笔触、圆头端点）
  - 数字统一 monospace，激活态加 5px 圆点 + 发光
  - 任务进度 / 字数目标改用 inline bar（cubic-bezier 动效）
  - 番茄钟改用 0.4s 刻度感脉冲，红/绿主题色切换
  - 新增 1px 竖向分隔槽（`.status-divider`）划分信息组
  - 自动保存状态分三态：saving（旋转）/ saved（实心 ✓）/ idle
  - 朗读按钮在 `speechSynthesis.speaking` 时切换 stop 图标
  - 28px 高度，padding 12px，集成 `-webkit-app-region: drag` 拖动区

- **欢迎页重设计 (Inkstone 2.0)**
  - 大标题 48→56px，weight 300→200，letter-spacing -0.04em
  - 新增品牌帽（welcome-mark · 圆点 + 泊墨 字样）
  - 副标题改用 serif italic 衬线，营造杂志感
  - 模板卡片四段式：32px 线性 icon 块 + 标题 + serif 描述 + 右上箭头
    - 悬停：上浮 -2px、双层阴影、icon 微旋 3°、箭头平移
  - 快捷键面板升级为 macOS Tahoe 风格 kbd（线性渐变 + 底边 + 内阴影）
  - 快捷键布局改为 grid 2 列，标题行加渐变细线分隔
  - 径向高光背景（accent-softer 从顶部 0% → 60% 透明）
  - recent 文件图标用 SVG 替换 emoji，悬停文件名变 accent

### Technical

- `package.json` version 升 2.0.0 → 2.1.0
- 新增 CSS 设计 token：`--status-h` / `--status-icon` / `--status-gap` / `--status-divider`
- 引入 cubic-bezier(0.16, 1, 0.3, 1) 作为全局统一缓动函数
- 模板数据从 `icon: string` 改为 `icon: React.ReactNode`，支持任意 SVG

## [2.0.0] - 2024-06-10

### Changed

- 主题重构 — 设计 token 体系 + 主题文件拆分
- 编辑器 gutter 对齐修复，状态栏信息密度优化

## [1.0.0] - 2024-06-10

### Added

- **实时渲染 Markdown 编辑** — 类 Typora 无缝编辑体验，基于 CodeMirror 6 Decoration 系统
  - Headings (H1–H6) with scaled typography
  - **Bold**, *italic*, ~~strikethrough~~, `inline code`
  - Links with hover underline, images with inline preview
  - Syntax markers auto-hide on non-cursor lines
- **Interactive Tables** — Visual HTML table rendering via `@markwhen/codemirror-tables`
  - Click-to-edit cells with embedded CodeMirror editors
  - Floating toolbar: insert/delete rows & columns, alignment
  - Keyboard navigation: Tab / Shift+Tab / Enter / Arrow keys
- **Code Blocks** — 20+ language syntax highlighting via highlight.js (on-demand registration)
  - Language label badge, monospace font, colored left border
- **Math Formulas** — KaTeX integration for inline (`$...$`) and block-level (`$$...$$`) equations
- **Task Lists** — Checkbox widgets with click-to-toggle, auto-strikethrough for completed items
- **File Management**
  - Sidebar file tree with folder navigation
  - Multi-tab interface with unsaved change indicators (●)
  - Drag-and-drop `.md` file opening
- **Theme System** — Light/dark GitHub-style themes with system preference detection
- **Find & Replace** — `Ctrl+H` panel with single/replace-all support
- **Focus Mode** — Highlights only the 3 lines around the cursor
- **Typewriter Mode** — Keeps the cursor line centered in the viewport
- **Smart Continuation** — Auto-continue lists, task lists, and blockquotes on Enter
- **Keyboard Shortcuts** — `Ctrl+B/I/`/Shift+X/H/N/O/S + slash commands

### Technical

- Modular editor architecture (600+ line monolith → 4 focused modules)
- highlight.js selective language registration (36% bundle size reduction)
- Markdown preview LRU cache (50 entries)
- `@codemirror/language-data` for on-demand language detection
