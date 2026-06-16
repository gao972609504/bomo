/**
 * Focus Mode 段落聚焦插件
 * — 淡化非当前光标所在段落的内容，仅突出正在写作的段落
 * — 灵感来自 iA Writer / Ulysses 的专注写作模式
 */
import { ViewPlugin, ViewUpdate, EditorView, Decoration, DecorationSet } from '@codemirror/view'
import { useEditorStore } from '../store/editorStore'

const dimLine = Decoration.line({ class: 'cm-focus-dim' })

/** 计算光标所在段落的行范围（以空行分隔） */
function currentParagraphRange(view: EditorView): { start: number; end: number } {
  const doc = view.state.doc
  const { head } = view.state.selection.main
  const cur = doc.lineAt(head).number
  let start = cur
  while (start > 1 && doc.line(start - 1).text.trim() !== '') start--
  let end = cur
  while (end < doc.lines && doc.line(end + 1).text.trim() !== '') end++
  return { start, end }
}

export function createFocusModePlugin() {
  return ViewPlugin.fromClass(
    class {
      deco: DecorationSet
      constructor(view: EditorView) { this.deco = this.build(view) }
      update(u: ViewUpdate) {
        if (u.selectionSet || u.docChanged || u.viewportChanged) {
          this.deco = this.build(u.view)
        }
      }
      build(view: EditorView): DecorationSet {
        if (!useEditorStore.getState().focusMode) return Decoration.none
        const doc = view.state.doc
        const { start, end } = currentParagraphRange(view)
        const deco: { from: number; to: number; value: Decoration }[] = []
        const visStart = doc.lineAt(view.viewport.from).number
        const visEnd = doc.lineAt(view.viewport.to).number
        for (let i = visStart; i <= visEnd; i++) {
          if (i < start || i > end) {
            const line = doc.line(i)
            deco.push({ from: line.from, to: line.from, value: dimLine })
          }
        }
        return deco.length ? Decoration.set(deco.map(d => d.value.range(d.from, d.to)), true) : Decoration.none
      }
    },
    { decorations: v => v.deco }
  )
}
