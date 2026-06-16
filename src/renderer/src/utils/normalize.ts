/**
 * 文档格式整理 (Normalize Document)
 * — 去除每行行尾空白、折叠 3+ 连续空行为 2 行、确保文件末尾单一换行
 * — 灵感来自 VS Code 的 trim trailing whitespace + final newline
 */

export function normalizeDocument(md: string): string {
  // 去除行尾空白（保留行首缩进）
  let lines = md.split('\n').map(l => l.replace(/\s+$/, ''))
  // 折叠 3+ 连续空行为最多 2 行（即一个段落空隙）
  const out: string[] = []
  let blankRun = 0
  for (const l of lines) {
    if (l.trim() === '') {
      blankRun++
      if (blankRun <= 2) out.push('')
    } else {
      blankRun = 0
      out.push(l)
    }
  }
  // 去除开头多余空行
  while (out.length && out[0] === '') out.shift()
  // 确保末尾单一换行
  while (out.length && out[out.length - 1] === '') out.pop()
  return out.join('\n') + '\n'
}
