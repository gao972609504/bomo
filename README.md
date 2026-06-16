<div align="center">

<img src="bomo_logo.png" alt="泊墨 Bomo" width="520" />

# 泊墨 · Bomo

**泊于墨香，宁静书写** — 一款轻量、精致、所见即所得的 Markdown 写作器

[![Electron](https://img.shields.io/badge/Electron-33-47848f?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![CodeMirror](https://img.shields.io/badge/CodeMirror-6-d22222?logo=codemirror&logoColor=white)](https://codemirror.net/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[特性](#-核心特性) · [快捷键](#️-快捷键) · [快速开始](#-快速开始) · [架构](#-架构) · [English](#-english)

</div>

---

## 关于泊墨

「泊」取停泊、淡泊之意；「墨」指笔墨、文墨。**泊墨** 寓意——**让思绪停泊于墨香之中，回归宁静纯粹的书写。**

泊墨摒弃传统的「源码 / 预览」分栏模式，基于 CodeMirror 6 的 Decoration 系统**直接在编辑器内渲染 Markdown**：光标所在行显示原始语法，其余区域无缝呈现富文本。写作，回归纯粹。

> 💡 从 [GitHub Releases](https://github.com/gao972609504/markflow/releases) 获取最新版本，或 [从源码构建](#-快速开始)。

## ✨ 核心特性

### 🖋 沉浸写作
- **所见即所得** — 光标行保留语法，其余实时渲染，Typora 式体验
- **Focus 模式** — 淡化非当前段落，专注当下
- **打字机模式** — 光标始终居中
- **番茄钟** — 25/5 专注-休息循环，SVG 进度环 + 提示音
- **朗读模式** — 浏览器原生语音逐段朗读，可调语速与音色
- **写作灵感** — 40 条双语写作提示，一键插入

### 📝 笔记增强
- **双链系统** — `[[WikiLink]]` 自动补全 + 反向链接面板 + 关系图谱
- **每日笔记** — 月历视图，点击创建当日笔记
- **任务清单** — 全文 `- [ ]` 聚合，勾选切换、跳转、进度统计
- **书签管理** — 跨文档书签，快速跳转
- **标签面板** — `#tag` 聚合浏览
- **资源管理** — 全文图片/链接/双链/脚注一栏速查

### 🎨 排版与渲染
- **Mermaid 图表** — 流程图、时序图、甘特图实时渲染
- **KaTeX 数学** — 行内与块级公式
- **代码高亮** — 按需加载 20+ 语言
- **表格能力** — 智能粘贴、格式化、按列排序、转置、单元格 `Tab` 导航
- **提示框 Callout** — `:::tip / info / warning / danger` 等风格化块
- **颜色色块** — `#hex` / `rgb()` / `hsl()` 旁显示真实色块

### 🔧 工程效率
- **命令面板** — `Ctrl+Shift+P` 全局命令
- **快速打开** — `Ctrl+P` 模糊搜索文件
- **全局搜索** — 跨文件查找替换
- **查找替换** — 正则、大小写、选中高亮
- **大纲导航** — 标题层级 + 折叠/展开
- **版本快照** — 文档历史，随时回溯

### 📊 分析与统计
- **写作统计** — 实时字数、WPM、连续天数
- **可读性分析** — Flesch 易读度、年级水平、音节统计
- **词频分析** — 双语分词、停用词过滤、点击定位
- **文档统计** — 字符 / 词 / 行 / 阅读时长

### 🎛 个性化
- **主题** — 亮 / 暗 + 5 套强调色预设（蓝/林/莓/琥珀/海洋/玫瑰）
- **自定义 CSS** — 任意覆盖样式，持久化保存
- **字体 / 字号 / 行距** — 自由调节
- **斜杠命令** — `/` 触发快速插入
- **Emoji 选择器** — `:` 触发，搜索 + 键盘导航
- **自定义片段** — 个人代码片段管理

## ⌨️ 快捷键

| 快捷键 | 功能 | 快捷键 | 功能 |
| --- | --- | --- | --- |
| `Ctrl+N` | 新建文件 | `Ctrl+P` | 快速打开 |
| `Ctrl+S` | 保存 | `Ctrl+Shift+P` | 命令面板 |
| `Ctrl+B` / `I` | 粗体 / 斜体 | `Ctrl+Shift+F` | 全局搜索 |
| `Ctrl+H` | 查找替换 | `Ctrl+Shift+O` | 大纲面板 |
| `Alt+↑/↓` | 上移 / 下移行 | `Ctrl+D` | 复制行 |
| `Ctrl+Shift+K` | 删除行 | `Ctrl+Shift+X` | 删除线 |
| `Alt+D/T/W` | 日期 / 时间 / 星期 | `Ctrl+Shift+L` | 选中所有匹配 |
| `Ctrl+1/2/3` | 按级别折叠 | `Ctrl+Shift+T` | 插入表格 |
| `Ctrl+Alt+S/R` | 排序 / 转置表格 | `Ctrl+Shift+Alt+F` | 整理文档格式 |
| `Ctrl+Shift+J` | 写作灵感 | `Ctrl+Shift+G` | 关系图谱 |
| `Ctrl+Shift+B` | 反向链接 | `Ctrl+Shift+D` | 每日笔记 |
| `Ctrl+Shift+M` | 书签面板 | `Ctrl+Shift+E` | 可读性分析 |
| `Ctrl+Shift+W` | 写作统计 | `Ctrl+Shift+]` / `[` | 标题降级 / 升级 |

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18
- npm ≥ 9

### 从源码构建

```bash
git clone https://github.com/gao972609504/markflow.git
cd markflow
npm install
npm run dev      # 开发模式
npm run build    # 生产构建
npm run dist     # 打包安装包（electron-builder）
```

### 构建产物
- `npm run build:win` — Windows NSIS 安装包
- `npm run build:mac` — macOS DMG
- `npm run build:linux` — Linux DEB

## 🏗️ 架构

泊墨的核心是一条**光标感知的实时渲染流水线**：

```
CodeMirror 6 编辑器
    ├── Decoration 装饰系统（实时渲染 Markdown）
    ├── ViewPlugin 插件层（折叠 / 段落间距 / 缩进线 / 拼写 / 色块 …）
    ├── markdown-it（导出 / 复制 HTML）
    ├── Mermaid + KaTeX（图表与公式）
    └── keymap（表格 / 列表 / 日期 / 书签 / 多光标 …）

React UI
    ├── Zustand 全局状态（编辑器 / 主题 / 面板 / 会话持久化）
    ├── 面板层（大纲 / 双链 / 图谱 / 任务 / 统计 …）
    └── 命令系统（命令面板 + 快捷键）

Electron 主进程
    └── 文件读写 / 图片保存 / 导出 / 窗口管理
```

## 🙏 致谢

泊墨的诞生离不开这些卓越的开源项目：

[CodeMirror 6](https://codemirror.net/) · [React](https://react.dev/) · [Electron](https://www.electronjs.org/) · [markdown-it](https://github.com/markdown-it/markdown-it) · [Mermaid](https://mermaid.js.org/) · [KaTeX](https://katex.org/) · [highlight.js](https://highlightjs.org/) · [Zustand](https://github.com/pmndrs/zustand) · [@markwhen/codemirror-tables](https://github.com/markwhen/codemirror-tables)

灵感来源于 [Typora](https://typora.io/)、[Obsidian](https://obsidian.md/)、[iA Writer](https://ia.net/writer) 等优秀写作工具。

---

## 🌏 English

**Bomo** — *Moored in ink, write in tranquility.* A lightweight, polished, WYSIWYG Markdown writing app.

Bomo ditches the traditional split-pane approach. Powered by CodeMirror 6's Decoration system, it renders Markdown **directly inside the editor** — the active line reveals raw syntax while everything else displays polished rich text. Writing, distilled to its essence.

### Highlights
- **Live WYSIWYG** editing with cursor-aware rendering
- **WikiLinks**, backlinks & **graph view** for connected notes
- **Daily notes**, **task aggregation**, **bookmarks**, **tag panel**
- **Mermaid** diagrams, **KaTeX** math, **callouts**, **color swatches**
- **Smart tables**: paste, format, sort, transpose, cell navigation
- **Focus mode**, **typewriter mode**, **pomodoro**, **read-aloud (TTS)**
- **Writing stats**, **readability**, **word frequency** analysis
- **Command palette**, **quick open**, **global search**
- **Themes**: light/dark + 5 accent presets, **custom CSS**
- **Slash commands**, **emoji picker**, **custom snippets**

### Quick Start
```bash
git clone https://github.com/gao972609504/markflow.git
cd markflow
npm install
npm run dev
```

---

<div align="center">

**泊墨** — 让 Markdown 写作回归宁静 ✦

Made with ♥ by [Bomo Contributors](https://github.com/gao972609504/markflow/graphs/contributors)

[⬆ 回到顶部](#泊墨--bomo)

</div>
