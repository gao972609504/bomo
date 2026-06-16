/**
 * 重复段落检测 (Duplicate Detection)
 * — 扫描全文段落(空行分隔)，找出完全相同或高相似的重复段，辅助去冗
 */
import { useMemo } from 'react'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '../store/editorStore'
import { getEditorView } from '../plugins/widgets'

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function DuplicatePanel() {
  const { tabs, activeTabId, showDuplicatePanel, setShowDuplicatePanel } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)

  const dupes = useMemo(() => {
    if (!activeTab?.content) return []
    const lines = activeTab.content.split('\n')
    const paras: { text: string; line: number }[] = []
    let cur: string[] = []; let start = 0
    lines.forEach((ln, i) => {
      if (ln.trim() === '') { if (cur.length) { paras.push({ text: cur.join('\n'), line: start }); cur = [] } }
      else { if (!cur.length) start = i; cur.push(ln) }
    })
    if (cur.length) paras.push({ text: cur.join('\n'), line: start })
    // 仅统计长度 >= 8 的实质段落
    const groups = new Map<string, { text: string; line: number; count: number }>()
    for (const p of paras) {
      if (normalize(p.text).length < 8) continue
      const key = normalize(p.text)
      const ex = groups.get(key)
      if (ex) ex.count++
      else groups.set(key, { text: p.text, line: p.line, count: 1 })
    }
    return [...groups.values()].filter(g => g.count > 1).sort((a, b) => b.count - a.count)
  }, [activeTab?.content])

  if (!showDuplicatePanel) return null

  const jumpTo = (line: number) => {
    const el = document.querySelector('.cm-editor')
    const view = el ? getEditorView(el as HTMLElement) : null
    if (!view) return
    const info = view.state.doc.line(line + 1)
    view.dispatch({ selection: { anchor: info.from }, effects: EditorView.scrollIntoView(info.from) })
    view.focus()
  }

  return (
    <div className="dupe-overlay" onClick={() => setShowDuplicatePanel(false)}>
      <div className="dupe-modal" onClick={e => e.stopPropagation()}>
        <div className="dupe-header">
          <span>🔁 重复段落检测 {dupes.length > 0 && <small>{dupes.length} 组</small>}</span>
          <button className="dupe-close" onClick={() => setShowDuplicatePanel(false)}>×</button>
        </div>
        <div className="dupe-list">
          {dupes.length === 0 ? (
            <div className="dupe-empty">✓ 未发现重复段落</div>
          ) : (
            dupes.map((d, i) => (
              <div key={i} className="dupe-row" onClick={() => jumpTo(d.line)}>
                <span className="dupe-count" title="出现次数">×{d.count}</span>
                <span className="dupe-text">{d.text.length > 80 ? d.text.slice(0, 80) + '…' : d.text}</span>
                <span className="dupe-line">L{d.line + 1}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
