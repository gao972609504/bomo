# MarkFlow 迭代日志

**项目**: MarkFlow — 轻量美观的 Markdown 编辑器
**技术栈**: Electron + React + CodeMirror 6 + Zustand + TypeScript
**启动日期**: 2026-06-11
**当前进度**: 1/100

---

## 迭代记录

### Iteration 1/100 — 文档大纲面板
- **特性**: 实时解析当前文档标题层级，生成可点击导航树
- **核心改动**:
  - 新增 `OutlinePanel.tsx` 组件
  - Store 新增 `outlineVisible` / `toggleOutline()` 状态
  - 主进程菜单增加「切换大纲」项 (Ctrl+Shift+O)
  - Preload 新增 `onMenuToggleOutline` API
- **技术点**: useMemo 解析标题、通过 cmView.view 滚动定位
