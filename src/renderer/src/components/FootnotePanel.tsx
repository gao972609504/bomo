/**
 * 脚注管理面板 (Footnote Manager)
 * — 扫描全文脚注定义 [^id]: 与引用 [^id]，集中浏览、跳转、孤儿检测
 * — 灵感来自 Pandoc / 学术写作工具的脚注管理
 */
import { useMemo } from 'react'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '../store/editorStore'
import { getEditorView } from '../plugins/widgets'

interface Footnote {
  id: string
  text: string
  defLine: number
  refCount: number
  refLines: number[]
  orphan: 'ok' | 'unreferenced' | 'undefined'
}

export function FootnotePanel() {
  const { tabs, activeTabId, showFootnotePanel, setShowFootnotePanel } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)

  const footnotes = useMemo<Footnote[]>(() => {
    if (!activeTab?.content) return []
    const lines = activeTab.content.split('\n')
    const defs = new Map<string, { text: string; line: number }>()
    const refs = new Map<string, number[]>()

    lines.forEach((text, i) => {
      const def = text.match(/^\[\^([^\]]+)\]:\s?(.*)$/)
      if (def) {
        if (!defs.has(def[1])) defs.set(def[1], { text: def[2].trim(), line: i })
        return
      }
      const refRe = /\[\^([^\]]+)\]/g
      let m: RegExpExecArray | null
      while ((m = refRe.exec(text))) {
        const arr = refs.get(m[1]) || []
        arr.push(i)
        refs.set(m[1], arr)
      }
    })

    const result: Footnote[] = []
    const allIds = new Set<string>([...defs.keys(), ...refs.keys()])
    allIds.forEach(id => {
      const def = defs.get(id)
      const refLines = refs.get(id) || []
      result.push({
        id,
        text: def?.text || '',
        defLine: def?.line ?? -1,
        refCount: refLines.length,
        refLines,
        orphan: !def ? 'undefined' : refLines.length === 0 ? 'unreferenced' : 'ok',
      })
    })
    return result.sort((a, b) => (a.defLine >= 0 ? a.defLine : 1e9) - (b.defLine >= 0 ? b.defLine : 1e9))
  }, [activeTab?.content])

  if (!showFootnotePanel) return null

  const jumpTo = (line: number) => {
    const el = document.querySelector('.cm-editor')
    const view = el ? getEditorView(el as HTMLElement) : null
    if (!view) return
    const info = view.state.doc.line(line + 1)
    view.dispatch({ selection: { anchor: info.from }, effects: EditorView.scrollIntoView(info.from) })
    view.focus()
  }

  const orphanLabel = { ok: '', unreferenced: '未被引用', undefined: '未定义' }
  const orphanClass = { ok: '', unreferenced: 'warn', undefined: 'err' }

  return (
    <div className="footnote-panel">
      <div className="footnote-header">
        <span>ⁱ 脚注管理 <small>{footnotes.length}</small></span>
        <button className="footnote-close" onClick={() => setShowFootnotePanel(false)}>×</button>
      </div>
      <div className="footnote-list">
        {footnotes.length === 0 ? (
          <div className="footnote-empty">暂无脚注<br /><small>使用 [^1]: 定义脚注</small></div>
        ) : (
          footnotes.map((fn, idx) => (
            <div key={idx} className={`footnote-row ${orphanClass[fn.orphan]}`} onClick={() => fn.defLine >= 0 && jumpTo(fn.defLine)}>
              <span className="footnote-id">[^{fn.id}]</span>
              <span className="footnote-text" title={fn.text}>{fn.text || <em>(空定义)</em>}</span>
              <span className="footnote-refcount" title="引用次数">×{fn.refCount}</span>
              {fn.orphan !== 'ok' && <span className={`footnote-tag ${orphanClass[fn.orphan]}`}>{orphanLabel[fn.orphan]}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
