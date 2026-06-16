/**
 * 写作热力图 (Writing Heatmap)
 * — GitHub 风格的贡献日历，记录并可视化过去一年每天的写作字数
 * — 灵感来自 GitHub contributions / Obsidian Activity Tracker
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from '../store/editorStore'
import { countWords } from '../utils/text'

const HEATMAP_KEY = 'markflow-writing-heatmap'

type HeatData = Record<string, number> // YYYY-MM-DD -> 当日累计字数

function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function loadData(): HeatData {
  try { return JSON.parse(localStorage.getItem(HEATMAP_KEY) || '{}') } catch { return {} }
}

function saveData(d: HeatData) {
  try { localStorage.setItem(HEATMAP_KEY, JSON.stringify(d)) } catch { /* noop */ }
}

/** 根据字数返回 0-4 级别 */
function levelOf(words: number): number {
  if (words <= 0) return 0
  if (words < 200) return 1
  if (words < 600) return 2
  if (words < 1500) return 3
  return 4
}

const LEVEL_COLOR = ['var(--border-subtle)', '#9be9a8', '#40c463', '#30a14e', '#216e39']

export function WritingHeatmap() {
  const { tabs, showHeatmap, setShowHeatmap } = useEditorStore()
  const [data, setData] = useState<HeatData>(() => loadData())
  const lastTotalRef = useRef<number | null>(null)
  const [hover, setHover] = useState<{ date: string; words: number; x: number; y: number } | null>(null)

  // 监听所有标签总字数变化，增量累加到今日
  useEffect(() => {
    const total = tabs.reduce((s, t) => s + countWords(t.content), 0)
    const prev = lastTotalRef.current
    if (prev !== null && total > prev) {
      const inc = total - prev
      const key = todayStr()
      setData(d => {
        const next = { ...d, [key]: (d[key] || 0) + inc }
        saveData(next)
        return next
      })
    }
    lastTotalRef.current = total
  }, [tabs])

  // 构建过去 53 周的日期网格（列=周，行=周一到周日）
  const weeks = useMemo(() => {
    const cols: { date: Date; key: string; words: number }[][] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // 从今天所在周的周日开始往前
    const end = new Date(today)
    end.setDate(today.getDate() + (6 - today.getDay()))
    const start = new Date(end)
    start.setDate(end.getDate() - 7 * 52 - 6)
    for (let w = 0; w < 53; w++) {
      const col: { date: Date; key: string; words: number }[] = []
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start)
        dt.setDate(start.getDate() + w * 7 + d)
        if (dt > today) { col.push({ date: dt, key: '', words: -1 }); continue }
        const key = todayStr(dt)
        col.push({ date: dt, key, words: data[key] || 0 })
      }
      cols.push(col)
    }
    return cols
  }, [data])

  const stats = useMemo(() => {
    const vals = Object.values(data).filter(v => v > 0)
    const days = vals.length
    const total = vals.reduce((s, v) => s + v, 0)
    // 本月
    const monthPrefix = todayStr().slice(0, 7)
    const monthTotal = Object.entries(data).filter(([k]) => k.startsWith(monthPrefix)).reduce((s, [, v]) => s + v, 0)
    return { days, total, monthTotal }
  }, [data])

  if (!showHeatmap) return null

  const WD = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <div className="heatmap-overlay" onClick={() => setShowHeatmap(false)}>
      <div className="heatmap-modal" onClick={e => e.stopPropagation()}>
        <div className="heatmap-header">
          <span>📊 写作热力图 · 过去一年</span>
          <button className="heatmap-close" onClick={() => setShowHeatmap(false)}>×</button>
        </div>
        <div className="heatmap-stats">
          <div><strong>{stats.days}</strong><small>写作天数</small></div>
          <div><strong>{stats.total.toLocaleString()}</strong><small>累计字数</small></div>
          <div><strong>{stats.monthTotal.toLocaleString()}</strong><small>本月字数</small></div>
        </div>
        <div className="heatmap-grid-wrap">
          <div className="heatmap-weekdays">
            {WD.map((w, i) => <div key={i} className="heatmap-wd">{i % 2 === 1 ? w : ''}</div>)}
          </div>
          <div className="heatmap-grid">
            {weeks.map((col, ci) => (
              <div key={ci} className="heatmap-col">
                {col.map((cell) => (
                  <div
                    key={cell.key || ci + '-' + cell.date.getDay()}
                    className="heatmap-cell"
                    style={{ background: cell.words < 0 ? 'transparent' : LEVEL_COLOR[levelOf(cell.words)] }}
                    onMouseEnter={(e) => cell.words >= 0 && setHover({ date: cell.key, words: cell.words, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="heatmap-legend">
          <span>少</span>
          {LEVEL_COLOR.map((c, i) => <span key={i} className="heatmap-cell" style={{ background: c, width: 12, height: 12 }} />)}
          <span>多</span>
        </div>
        {hover && (
          <div className="heatmap-tooltip" style={{ left: hover.x + 12, top: hover.y + 14 }}>
            {hover.date} · {hover.words.toLocaleString()} 字
          </div>
        )}
      </div>
    </div>
  )
}
