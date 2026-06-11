import React, { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'

export function FindReplace() {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const findInputRef = useRef<HTMLInputElement>(null)
  const { setShowFindReplace, activeTabId, tabs, updateTabContent } = useEditorStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  useEffect(() => {
    findInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFindReplace(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setShowFindReplace])

  const handleFind = () => {
    if (!findText || !activeTab) return
    // 简单的文本查找 - 高亮第一个匹配
    const content = activeTab.content
    const idx = content.indexOf(findText)
    if (idx !== -1) {
      // 可以扩展为滚动到位置
    }
  }

  const handleReplace = () => {
    if (!findText || !activeTab) return
    const content = activeTab.content
    const newContent = content.replace(findText, replaceText)
    if (newContent !== content) {
      updateTabContent(activeTab.id, newContent)
    }
  }

  const handleReplaceAll = () => {
    if (!findText || !activeTab) return
    const content = activeTab.content
    const newContent = content.split(findText).join(replaceText)
    if (newContent !== content) {
      updateTabContent(activeTab.id, newContent)
    }
  }

  return (
    <div className="find-replace-panel">
      <div className="find-replace-row">
        <input
          ref={findInputRef}
          type="text"
          placeholder="查找..."
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFind()}
          className="find-input"
        />
        <button onClick={handleFind} className="find-btn" title="查找下一个">🔍</button>
      </div>
      <div className="find-replace-row">
        <input
          type="text"
          placeholder="替换为..."
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleReplace()}
          className="find-input"
        />
        <button onClick={handleReplace} className="find-btn" title="替换">替换</button>
        <button onClick={handleReplaceAll} className="find-btn" title="全部替换">全部</button>
      </div>
      <button className="find-close" onClick={() => setShowFindReplace(false)}>×</button>
    </div>
  )
}
