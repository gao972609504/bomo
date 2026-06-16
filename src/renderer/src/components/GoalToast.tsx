/**
 * 写作目标达成庆祝 toast
 * — 字数达到 wordGoal 时弹出一轮庆祝提示，每轮仅触发一次
 */
import { countWords } from '../utils/text'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'

export function GoalToast() {
  const { tabs, activeTabId, wordGoal } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const [msg, setMsg] = useState<string | null>(null)
  const reachedRef = useRef(false)

  const words = useMemo(() => countWords(activeTab?.content || ''), [activeTab?.content])

  useEffect(() => {
    if (wordGoal <= 0) { reachedRef.current = false; return }
    if (words >= wordGoal) {
      if (!reachedRef.current) {
        reachedRef.current = true
        setMsg(`🎉 达成写作目标 ${wordGoal.toLocaleString()} 字！`)
        const t = setTimeout(() => setMsg(null), 4500)
        return () => clearTimeout(t)
      }
    } else {
      reachedRef.current = false
    }
  }, [words, wordGoal])

  // 切换文档/目标重置
  useEffect(() => { reachedRef.current = false }, [activeTabId, wordGoal])

  if (!msg) return null
  return (
    <div className="goal-toast">
      <div className="goal-toast-inner">{msg}</div>
    </div>
  )
}
