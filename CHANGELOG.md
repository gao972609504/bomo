# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
