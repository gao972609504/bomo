/**
 * 浮动字数徽标 (Floating Word Badge)
 * — 右下角常驻字数/目标进度，禅模式/全屏下状态栏隐藏时仍可见
 */
import { useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'

export function WordBadge() {
  const { tabs, activeTabId, showWordBadge, wordGoal, zenMode } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)

  const words = useMemo(() => {
    if (!activeTab?.content) return 0
    const c = activeTab.content.trim()
    return (c.match(/[一-龥]/g) || []).length + (c.replace(/[一-龥]/g, ' ').trim().split(/\s+/).filter(Boolean)).length
  }, [activeTab?.content])

  if (!showWordBadge) return null
  const pct = wordGoal > 0 ? Math.min(100, Math.round((words / wordGoal) * 100)) : null

  return (
    <div className={`word-badge${zenMode ? ' zen' : ''}`}>
      <span className="word-badge-num">{words.toLocaleString()}</span>
      <span className="word-badge-unit">字</span>
      {pct !== null && (
        <>
          <span className="word-badge-sep">/</span>
          <span className="word-badge-goal">{wordGoal.toLocaleString()}</span>
          <span className={`word-badge-pct${pct >= 100 ? ' done' : ''}`}>{pct}%</span>
        </>
      )}
    </div>
  )
}
