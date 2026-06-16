/**
 * 剪贴板历史 (Clipboard Ring)
 * — 监听复制，保留最近 12 条文本，面板可插入到光标或重新复制
 */
import { useEffect, useState } from 'react'
import { useEditorStore } from '../store/editorStore'
import { getEditorView } from '../plugins/widgets'

const RING_KEY = 'markflow-clipboard-ring'
const MAX = 12

function loadRing(): string[] {
  try { return JSON.parse(localStorage.getItem(RING_KEY) || '[]') } catch { return [] }
}
function saveRing(items: string[]) {
  try { localStorage.setItem(RING_KEY, JSON.stringify(items)) } catch { /* noop */ }
}

export function ClipboardHistory() {
  const { showClipboardHistory, setShowClipboardHistory } = useEditorStore()
  const [items, setItems] = useState<string[]>(() => loadRing())

  useEffect(() => {
    const handler = () => {
      const text = window.getSelection()?.toString() || ''
      if (!text || text.length > 5000) return
      setItems(prev => {
        if (prev[0] === text) return prev
        const next = [text, ...prev.filter(x => x !== text)].slice(0, MAX)
        saveRing(next)
        return next
      })
    }
    document.addEventListener('copy', handler, true)
    return () => document.removeEventListener('copy', handler, true)
  }, [])

  useEffect(() => { if (showClipboardHistory) setItems(loadRing()) }, [showClipboardHistory])

  if (!showClipboardHistory) return null

  const insert = (text: string) => {
    const el = document.querySelector('.cm-editor')
    const view = el ? getEditorView(el as HTMLElement) : null
    if (view) {
      const sel = view.state.selection.main
      view.dispatch({ changes: { from: sel.from, to: sel.to, insert: text }, selection: { anchor: sel.from + text.length } })
      view.focus()
    }
    setShowClipboardHistory(false)
  }
  const recopy = async (text: string) => { try { await navigator.clipboard.writeText(text) } catch { /* noop */ } }

  return (
    <div className="clip-overlay" onClick={() => setShowClipboardHistory(false)}>
      <div className="clip-modal" onClick={e => e.stopPropagation()}>
        <div className="clip-header">
          <span>📋 剪贴板历史 <small>{items.length}</small></span>
          <button className="clip-close" onClick={() => setShowClipboardHistory(false)}>×</button>
        </div>
        <div className="clip-list">
          {items.length === 0 ? (
            <div className="clip-empty">暂无记录（复制文本后会自动收集）</div>
          ) : (
            items.map((text, i) => (
              <div key={i} className="clip-row">
                <span className="clip-text" title={text}>{text.replace(/\n/g, ' ⏎ ').slice(0, 100)}</span>
                <button className="clip-act" title="插入到光标" onClick={() => insert(text)}>↧ 插入</button>
                <button className="clip-act" title="复制" onClick={() => recopy(text)}>⧉</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
