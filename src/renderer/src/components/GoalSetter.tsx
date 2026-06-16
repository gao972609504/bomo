/**
 * 写作目标设置 (Word Goal Setter)
 * — 预设目标 + 自定义输入，实时进度环，状态栏进度条的数据来源
 */
import { countWords } from '../utils/text'
import { useState } from 'react'
import { useEditorStore } from '../store/editorStore'

const PRESETS = [
  { label: '轻量', value: 300 },
  { label: '日常', value: 500 },
  { label: '专注', value: 1000 },
  { label: '深度', value: 1500 },
  { label: 'NaNo 日均', value: 1667 },
  { label: '冲刺', value: 3000 },
  { label: '挑战', value: 5000 },
]

export function GoalSetter() {
  const { showGoalSetter, setShowGoalSetter, wordGoal, setWordGoal, tabs, activeTabId } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const current = activeTab ? countWords(activeTab.content) : 0
  const [custom, setCustom] = useState(String(wordGoal || ''))

  if (!showGoalSetter) return null

  const pct = wordGoal > 0 ? Math.min(100, Math.round((current / wordGoal) * 100)) : 0
  const circ = 2 * Math.PI * 44
  const offset = circ * (1 - pct / 100)

  const apply = (v: number) => { setWordGoal(v); setShowGoalSetter(false) }
  const applyCustom = () => {
    const v = parseInt(custom, 10)
    if (!isNaN(v) && v >= 0) apply(v)
  }

  return (
    <div className="goal-overlay" onClick={() => setShowGoalSetter(false)}>
      <div className="goal-modal" onClick={e => e.stopPropagation()}>
        <div className="goal-header">
          <span>🎯 写作目标</span>
          <button className="goal-close" onClick={() => setShowGoalSetter(false)}>×</button>
        </div>

        {wordGoal > 0 && (
          <div className="goal-progress">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="44" fill="none" strokeWidth="8" className="goal-ring-bg" />
              <circle cx="60" cy="60" r="44" fill="none" strokeWidth="8" className="goal-ring-fg"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div className="goal-progress-center">
              <strong>{pct}%</strong>
              <small>{current.toLocaleString()} / {wordGoal.toLocaleString()}</small>
            </div>
          </div>
        )}

        <div className="goal-presets">
          {PRESETS.map(p => (
            <button key={p.value} className={`goal-preset${wordGoal === p.value ? ' active' : ''}`} onClick={() => apply(p.value)}>
              <span className="goal-preset-v">{p.value.toLocaleString()}</span>
              <span className="goal-preset-l">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="goal-custom">
          <input type="number" min="0" value={custom} onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyCustom()} placeholder="自定义目标字数" className="goal-input" />
          <button className="goal-btn primary" onClick={applyCustom}>设定</button>
          {wordGoal > 0 && <button className="goal-btn" onClick={() => apply(0)}>清除目标</button>}
        </div>
      </div>
    </div>
  )
}
