/**
 * ==高亮== 语法渲染
 * — 为 ==文本== 内部文字加高亮背景（Obsidian/Marktext 流行扩展语法）
 * — 仅扫描可视区，标记内部文字，保留 == 标记可见
 */
import { ViewPlugin, ViewUpdate, EditorView, Decoration, DecorationSet } from '@codemirror/view'

const HL_RE = /==([^=\n]{1,200})==/g

export function highlightMark() {
  return ViewPlugin.fromClass(
    class {
      deco: DecorationSet
      constructor(view: EditorView) { this.deco = this.build(view) }
      update(u: ViewUpdate) {
        if (u.docChanged || u.viewportChanged) this.deco = this.build(u.view)
      }
      build(view: EditorView): DecorationSet {
        const deco: { from: number; to: number; value: Decoration }[] = []
        const doc = view.state.doc
        const startLine = doc.lineAt(view.viewport.from).number
        const endLine = doc.lineAt(view.viewport.to).number
        for (let i = startLine; i <= endLine; i++) {
          const line = doc.line(i)
          let m: RegExpExecArray | null
          HL_RE.lastIndex = 0
          while ((m = HL_RE.exec(line.text))) {
            const innerFrom = line.from + m.index + 2
            const innerTo = innerFrom + m[1].length
            deco.push({ from: innerFrom, to: innerTo, value: Decoration.mark({ class: 'cm-highlight-mark' }) })
          }
        }
        return deco.length ? Decoration.set(deco.map(x => x.value.range(x.from, x.to)), true) : Decoration.none
      }
    },
    { decorations: v => v.deco }
  )
}
