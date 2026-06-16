/**
 * 共享文本工具
 */

/** 中英混合词数：中文按字符，英文按词 */
export function countWords(text: string): number {
  const c = text.trim()
  const cn = (c.match(/[一-龥]/g) || []).length
  const en = (c.replace(/[一-龥]/g, ' ').trim().split(/\s+/).filter(Boolean)).length
  return cn + en
}
