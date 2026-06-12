/**
 * CodeMirror 编辑器主题
 * — Typora-Inspired: Clean, minimal, writing-focused
 */
import { EditorView } from '@codemirror/view'

export const monoFont = '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Consolas, monospace'

export function createEditorTheme(isDark: boolean, fontSize: number = 15.5, fontFamily: string = '') {
  const editorFont = fontFamily ? `"${fontFamily}", ${monoFont}` : monoFont
  const c = {
    // ── Typora White / Typora Dark ──
    bg: isDark ? '#1e1e1e' : '#ffffff',
    bg2: isDark ? '#252526' : '#f8f8f8',
    bg3: isDark ? '#2d2d2d' : '#f0f0f0',
    text: isDark ? '#d4d4d4' : '#1a1a1a',
    text2: isDark ? '#999999' : '#555555',
    textMuted: isDark ? '#666666' : '#999999',
    border: isDark ? '#3e3e3e' : '#e0e0e0',
    accent: isDark ? '#4eb0d6' : '#4183c4',
    accentHover: isDark ? '#6fc3e0' : '#3468a0',
    cursor: isDark ? '#aeafad' : '#526eff',
    sel: isDark ? 'rgba(78, 176, 214, 0.18)' : 'rgba(65, 131, 196, 0.14)',
    heading: isDark ? '#d4d4d4' : '#1a1a1a',
    headingBorder: isDark ? '#333333' : '#eaecef',
    quoteBg: 'transparent',
    codeBg: isDark ? 'rgba(200, 200, 200, 0.08)' : 'rgba(27, 31, 35, 0.06)',
    codeBlockBg: isDark ? '#282c34' : '#f6f8fa',
    hr: isDark ? '#3e3e3e' : '#e0e0e0',
    gutter: isDark ? '#1e1e1e' : '#ffffff',
    gutterColor: isDark ? '#555555' : '#bbbbbb',
    activeGutterBg: isDark ? '#252526' : '#f8f8f8',
    activeGutterColor: isDark ? '#999999' : '#555555',
    // 语法高亮 — GitHub style (same as Typora)
    codeKeyword: isDark ? '#ff7b72' : '#d73a49',
    codeString: isDark ? '#a5d6ff' : '#032f62',
    codeNumber: isDark ? '#79c0ff' : '#005cc5',
    codeComment: isDark ? '#8b949e' : '#6a737d',
    codeFunction: isDark ? '#d2a8ff' : '#6f42c1',
    codeVariable: isDark ? '#ffa657' : '#e36209',
    codeType: isDark ? '#ffa657' : '#e36209',
    codeOperator: isDark ? '#ff7b72' : '#d73a49',
    codePunct: isDark ? '#8b949e' : '#24292e',
  }

  return EditorView.theme({
    '&': { backgroundColor: c.bg, color: c.text, height: '100%' },
    '.cm-scroller': {
      scrollBehavior: 'smooth',
      fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
    },
    '.cm-scroller::-webkit-scrollbar': { width: '5px', height: '5px' },
    '.cm-scroller::-webkit-scrollbar-track': { background: 'transparent' },
    '.cm-scroller::-webkit-scrollbar-thumb': { background: 'transparent', borderRadius: '3px', transition: 'background 0.15s' },
    '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: c.textMuted },
    '.cm-scroller::-webkit-scrollbar-corner': { background: 'transparent' },
    '.cm-content': {
      fontFamily: '"Source Serif 4", "LXGW WenKai", "Noto Serif SC", "Songti SC", "STSong", Georgia, "Times New Roman", serif',
      fontSize: `${fontSize}px`,
      lineHeight: '1.85',
      padding: '32px 0 64px',
      letterSpacing: '0.005em',
      caretColor: c.cursor,
      position: 'relative',
      fontVariantLigatures: 'common-ligatures contextual',
      fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "onum" 1, "pnum" 0',
      fontOpticalSizing: 'auto',
      textRendering: 'optimizeLegibility',
      // Tabular 数字 — 字符数/行号对齐更整齐
      fontVariantNumeric: 'oldstyle-nums proportional-nums',
      hangingPunctuation: 'first last',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
    },
    '.cm-content::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: `calc(24px + 80ch + 24px)`,
      borderLeft: `1px dashed ${isDark ? '#333333' : '#e8e8e8'}`,
      pointerEvents: 'none',
      zIndex: '1',
    },
    '.cm-content::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: `calc(24px + 120ch + 24px)`,
      borderLeft: `1px dotted ${isDark ? '#2a2a2a' : '#eeeeee'}`,
      pointerEvents: 'none',
      zIndex: '1',
    },
    '.cm-line': { padding: '3px 24px' },
    '.cm-paragraph-gap': { height: '10px' },
    // 段落首行缩进 2 字符（中文杂志排版传统）— 通过 ::first-line 不行，改用空行后第一段
    // 这里用视觉节奏替代：段落间距自然断落
    '.cm-content[contenteditable="true"] .cm-line:only-child:empty::before': {
      content: '"开始写作吧… (Ctrl+N 新建文件)"',
      color: c.textMuted,
      fontStyle: 'italic',
      pointerEvents: 'none',
      fontFamily: '"Source Serif 4", Georgia, serif',
      letterSpacing: '0.01em',
    },
    '.cm-gutters': {
      backgroundColor: c.gutter,
      color: c.gutterColor,
      border: 'none',
      minWidth: '50px',
      width: 'auto',
      fontSize: '12px',
      lineHeight: '1.75',
      fontFamily: 'inherit',
    },
    '.cm-gutter': { lineHeight: '1.75' },
    '.cm-gutter.cm-lineNumbers .cm-gutterElement': {
      lineHeight: '1.75',
      padding: '0 8px 0 12px',
      minHeight: `${fontSize * 1.75}px`,
    },
    '.cm-activeLineGutter': {
      backgroundColor: c.activeGutterBg,
      color: c.activeGutterColor,
    },
    '.cm-activeLine': {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    },
    '.cm-cursor': {
      borderLeftWidth: '2px',
      borderLeftColor: c.cursor,
      animation: 'cm-blink 1.2s step-end infinite',
    },
    '@keyframes cm-blink': {
      '0%, 100%': { borderLeftColor: c.cursor },
      '50%': { borderLeftColor: 'transparent' },
    },
    '.cm-selectionBackground': { backgroundColor: `${c.sel} !important` },
    '&.cm-focused .cm-selectionBackground': { backgroundColor: `${c.sel} !important` },
    '.cm-focused .cm-cursor': { borderLeftColor: c.cursor },
    '.cm-focused .cm-activeLine': {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
    },

    // 标题 — Display 字体（无衬线），形成与正文的对比
    '.cm-heading': {
      marginTop: '24px',
      marginBottom: '10px',
      fontFamily: '"Inter", -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontFeatureSettings: '"ss01" 1, "cv11" 1, "kern" 1',
      letterSpacing: '-0.02em',
    },
    '.cm-heading-1': {
      fontSize: '32px', fontWeight: '700', lineHeight: '1.2',
      color: c.heading, letterSpacing: '-0.035em',
      borderBottom: `1px solid ${c.headingBorder}`, paddingBottom: '10px',
    },
    '.cm-heading-2': {
      fontSize: '25px', fontWeight: '650', lineHeight: '1.25',
      color: c.heading, letterSpacing: '-0.025em',
    },
    '.cm-heading-3': {
      fontSize: '20px', fontWeight: '600', lineHeight: '1.3',
      color: c.heading, letterSpacing: '-0.015em',
    },
    '.cm-heading-4': {
      fontSize: '17px', fontWeight: '600', lineHeight: '1.4',
      color: isDark ? '#a8a8a8' : '#4a4a4a',
    },
    '.cm-heading-5': {
      fontSize: '14.5px', fontWeight: '600', lineHeight: '1.45',
      color: c.text2, textTransform: 'uppercase', letterSpacing: '0.04em',
    },
    '.cm-heading-6': {
      fontSize: '13px', fontWeight: '600', lineHeight: '1.45',
      color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
    },

    // 行内格式
    '.cm-bold-rendered': { fontWeight: '700', color: c.text },
    '.cm-italic-rendered': { fontStyle: 'italic', color: c.text2, fontFamily: '"Source Serif 4", "LXGW WenKai", Georgia, serif' },
    '.cm-strike-rendered': { textDecoration: 'line-through', opacity: '0.5', color: c.textMuted },
    '.cm-inline-code': {
      background: c.codeBg,
      borderRadius: '3px',
      padding: '0.15em 0.45em',
      fontFamily: editorFont,
      fontSize: '0.875em',
      fontFeatureSettings: '"calt" 0, "liga" 0',
      // 衬线字体包裹时显得更紧凑
      letterSpacing: '-0.01em',
    },
    // 链接 — 杂志风：底部细线 + 悬停加深
    '.cm-link-rendered': {
      color: c.accent,
      cursor: 'pointer',
      textDecoration: 'none',
      borderBottom: `1px solid ${isDark ? 'rgba(78, 176, 214, 0.35)' : 'rgba(65, 131, 196, 0.30)'}`,
      paddingBottom: '1px',
      transition: 'all 0.15s ease',
    },
    '.cm-link-rendered:hover': {
      color: c.accentHover,
      borderBottomColor: c.accentHover,
      background: isDark ? 'rgba(78, 176, 214, 0.08)' : 'rgba(65, 131, 196, 0.06)',
    },

    // 引用块 — 衬线斜体，杂志风
    '.cm-blockquote': {
      borderLeft: `3px solid ${isDark ? '#555555' : '#d0d7de'}`,
      paddingLeft: '18px',
      paddingRight: '12px',
      paddingTop: '2px',
      paddingBottom: '2px',
      color: c.text2,
      fontStyle: 'italic',
      fontFamily: '"Source Serif 4", "LXGW WenKai", "Noto Serif SC", Georgia, serif',
      fontSize: '0.97em',
    },

    // 分割线
    '.cm-hr-line': { display: 'block', border: 'none', padding: '16px 0' },

    // 代码块 — Typora 无左边框，纯背景色
    '.cm-code-block-line': {
      background: `${c.codeBlockBg} !important`,
      fontFamily: editorFont,
      fontSize: '13.5px', lineHeight: '1.65', padding: '1px 16px',
      borderLeft: 'none',
    },
    '.cm-code-block-first': { borderRadius: '6px 6px 0 0', paddingTop: '10px !important' },
    '.cm-code-block-last': { borderRadius: '0 0 6px 6px', paddingBottom: '10px !important' },

    // 任务列表
    '.cm-task-checked': { textDecoration: 'line-through', opacity: '0.5', color: c.textMuted },

    // 列表 marker
    '.cm-list-mark': { color: c.textMuted, fontWeight: '600' },

    // 语法隐藏/显示
    '.cm-mark-hidden': {
      display: 'inline', color: 'transparent', fontSize: '1px', lineHeight: '0', letterSpacing: '-1px', overflow: 'hidden',
      caretColor: c.text,
    },
    '.cm-activeLine .cm-mark-hidden': {
      color: isDark ? '#555555' : '#bbbbbb', fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 'normal', overflow: 'visible',
    },

    // 图片
    '.cm-inline-image': {
      maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', marginTop: '6px', marginBottom: '6px',
      display: 'block',
      border: `1px solid ${c.border}`,
    },

    // 复选框
    '.cm-checkbox-wrap': { display: 'inline-flex', alignItems: 'center', marginRight: '6px' },
    '.cm-checkbox-input': { width: '14px', height: '14px', cursor: 'pointer', accentColor: c.accent, borderRadius: '2px' },

    // Focus 模式
    '.cm-focus-dim': { opacity: '0.25', transition: 'opacity 0.3s ease' },
    '.cm-focus-dim.cm-activeLine': { opacity: '1' },

    // 搜索
    '.cm-searchMatch': {
      backgroundColor: isDark ? 'rgba(218, 165, 32, 0.25)' : 'rgba(255, 248, 197, 0.85)',
      borderRadius: '2px',
      outline: `1px solid ${isDark ? 'rgba(218, 165, 32, 0.4)' : 'rgba(218, 165, 32, 0.4)'}`,
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: isDark ? 'rgba(218, 165, 32, 0.45)' : 'rgba(255, 229, 143, 0.95)',
      outline: `1.5px solid ${isDark ? '#daa520' : '#b8860b'}`,
    },
  })
}
