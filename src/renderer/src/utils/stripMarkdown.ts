/**
 * Markdown 纯文本提取
 * — 去除 Markdown 标记，输出可读纯文本
 * — 用于复制到不支持 Markdown 的环境、朗读、统计
 */

/** 将 Markdown 文本剥离为纯文本 */
export function stripMarkdown(md: string): string {
  let s = md
  // 代码块 → 保留内容
  s = s.replace(/```[\s\S]*?```/g, (m) => m.replace(/^```\w*\n?/gm, '').replace(/```$/g, ''))
  // 行内代码 保留文字
  s = s.replace(/`([^`]+)`/g, '$1')
  // 图片 → 替换为 alt 文本
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  // 链接 → 保留链接文字
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  // WikiLink → target
  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, a, b) => (b || a).trim())
  // 脚注引用 → 删除
  s = s.replace(/\[\^[^\]]+\]/g, '')
  // 脚注定义行
  s = s.replace(/^\[\^[^\]]+\]:\s.*$/gm, '')
  // 标题井号
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, '')
  // 引用块 >
  s = s.replace(/^\s{0,3}>\s?/gm, '')
  // 列表标记
  s = s.replace(/^(\s*)([-*+]|\d+\.)\s+/gm, '$1')
  // 水平线
  s = s.replace(/^\s*([-*_]\s*){3,}\s*$/gm, '')
  // 粗体/斜体/删除线
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1')
  s = s.replace(/__([^_]+)__/g, '$1')
  s = s.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1')
  s = s.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1')
  s = s.replace(/~~([^~]+)~~/g, '$1')
  // 表格分隔行删除、管道变空格
  s = s.replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, '')
  s = s.replace(/\s*\|\s*/g, '  ')
  // HTML 标签
  s = s.replace(/<[^>]+>/g, '')
  // 折叠多余空行
  s = s.replace(/\n{3,}/g, '\n\n').trim()
  return s + '\n'
}
