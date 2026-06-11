/**
 * CodeMirror Widget 类型
 * — 图片行内预览、任务列表复选框
 */
import { WidgetType, EditorView } from '@codemirror/view'

// ============ 图片行内预览 Widget ============

export class ImageWidget extends WidgetType {
  constructor(readonly src: string, readonly alt: string) { super() }
  toDOM() {
    const img = document.createElement('img')
    img.src = this.src
    img.alt = this.alt
    img.className = 'cm-inline-image'
    img.loading = 'lazy'
    img.onerror = () => { img.style.display = 'none' }
    return img
  }
  eq(other: ImageWidget) { return this.src === other.src && this.alt === other.alt }
}

// ============ 复选框 Widget ============

export class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean, readonly lineFrom: number) { super() }
  toDOM() {
    const wrap = document.createElement('span')
    wrap.className = 'cm-checkbox-wrap'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = this.checked
    cb.className = 'cm-checkbox-input'
    cb.addEventListener('click', (e) => {
      e.preventDefault()
      const view = getEditorView(e.target as HTMLElement)
      if (!view) return
      const line = view.state.doc.lineAt(this.lineFrom)
      const text = line.text
      const newChar = this.checked ? ' ' : 'x'
      const checkIdx = text.indexOf(this.checked ? '[x]' : '[ ]')
      if (checkIdx >= 0) {
        view.dispatch({
          changes: { from: line.from + checkIdx + 1, to: line.from + checkIdx + 2, insert: newChar }
        })
      }
    })
    wrap.appendChild(cb)
    return wrap
  }
  eq(other: CheckboxWidget) { return this.checked === other.checked && this.lineFrom === other.lineFrom }
}

// ============ 工具函数 ============

/** 从 DOM 元素向上查找最近的 EditorView */
export function getEditorView(el: HTMLElement): EditorView | undefined {
  return el.closest('.cm-editor')?.cmView?.view as EditorView | undefined
}
