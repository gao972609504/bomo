/**
 * 相对行号 (Relative Line Numbers)
 * — 当前行显示绝对行号，其余行显示距光标的相对行数
 * — 灵感来自 Vim relativenumber / VS Code，便于配合 `5j`/`10k` 式跳转
 */
import { lineNumbers } from '@codemirror/view'

export function relativeLineNumbers() {
  return lineNumbers({
    formatNumber: (lineNo: number, state) => {
      const cur = state.doc.lineAt(state.selection.main.head).number
      return lineNo === cur ? String(lineNo) : String(Math.abs(lineNo - cur))
    },
  })
}
