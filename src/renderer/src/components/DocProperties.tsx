/**
 * 文档属性 (Document Properties)
 * — 文件路径(可复制)、修改时间、字节大小、字符/词/行/标题统计
 */
import { useEffect, useState, useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'
import { countWords } from '../utils/text'

export function DocProperties() {
  const { tabs, activeTabId, showDocProperties, setShowDocProperties } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const [mtime, setMtime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!showDocProperties) return
    setMtime(null)
    if (activeTab?.filePath && window.api) {
      window.api.getFileModifiedTime(activeTab.filePath).then(setMtime).catch(() => setMtime(null))
    }
  }, [showDocProperties, activeTab?.filePath])

  const stats = useMemo(() => {
    const c = activeTab?.content || ''
    const chars = c.length
    const charsNoSpace = c.replace(/\s/g, '').length
    const words = countWords(c)
    const lines = c ? c.split('\n').length : 0
    const headings = (c.match(/^#{1,6}\s/gm) || []).length
    const bytes = new Blob([c]).size
    return { chars, charsNoSpace, words, lines, headings, bytes }
  }, [activeTab?.content])

  if (!showDocProperties) return null

  const copyPath = () => {
    if (!activeTab?.filePath) return
    navigator.clipboard?.writeText(activeTab.filePath).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => {})
  }
  const fmtMtime = (n: number) => {
    const d = new Date(n)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  }
  const fmtBytes = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`

  const rows = [
    ['字符数', stats.chars.toLocaleString()],
    ['字符(不含空白)', stats.charsNoSpace.toLocaleString()],
    ['词数', stats.words.toLocaleString()],
    ['行数', stats.lines.toLocaleString()],
    ['标题数', String(stats.headings)],
    ['字节大小', fmtBytes(stats.bytes)],
    ['修改时间', mtime ? fmtMtime(mtime) : '—'],
  ]

  return (
    <div className="docprop-overlay" onClick={() => setShowDocProperties(false)}>
      <div className="docprop-modal" onClick={e => e.stopPropagation()}>
        <div className="docprop-header">
          <span>📄 文档属性</span>
          <button className="docprop-close" onClick={() => setShowDocProperties(false)}>×</button>
        </div>
        <div className="docprop-path">
          <span className="docprop-path-text" title={activeTab?.filePath || ''}>{activeTab?.filePath || '（未保存）'}</span>
          {activeTab?.filePath && <button className="docprop-copy" onClick={copyPath}>{copied ? '✓' : '复制路径'}</button>}
        </div>
        <table className="docprop-table">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}><td className="docprop-k">{k}</td><td className="docprop-v">{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
