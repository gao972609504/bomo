/**
 * 工作区任务日程 (Task Schedule)
 * — 聚合所有打开标签的任务项，提取日期，按截止日期排序，跨文件跳转
 */
import { useMemo } from 'react'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '../store/editorStore'
import { getActiveEditorView } from '../plugins/widgets'

interface SchedTask { tabId: string; tabTitle: string; line: number; text: string; checked: boolean; date: string | null; ts: number }

const TASK_RE = /^(\s*)([-*+]|\d+\.)\s\[([ xX])\]\s(.*)$/
const DATE_RE = /(?:@|📅\s*)(\d{4})-(\d{1,2})-(\d{1,2})/

export function TaskSchedule() {
  const { tabs, showTaskSchedule, setShowTaskSchedule, setActiveTab } = useEditorStore()

  const tasks = useMemo<SchedTask[]>(() => {
    const out: SchedTask[] = []
    for (const tab of tabs) {
      const lines = tab.content.split('\n')
      lines.forEach((text, i) => {
        const m = text.match(TASK_RE)
        if (!m) return
        const dm = text.match(DATE_RE)
        let date: string | null = null, ts = Infinity
        if (dm) {
          date = `${dm[1]}-${dm[2].padStart(2, '0')}-${dm[3].padStart(2, '0')}`
          const d = new Date(+dm[1], +dm[2] - 1, +dm[3]); if (!isNaN(d.getTime())) ts = d.getTime()
        }
        out.push({ tabId: tab.id, tabTitle: tab.title, line: i, text: m[4].trim(), checked: m[3].toLowerCase() === 'x', date, ts })
      })
    }
    return out.sort((a, b) => a.ts - b.ts)
  }, [tabs])

  if (!showTaskSchedule) return null

  const jumpTo = (tabId: string, line: number) => {
    setActiveTab(tabId)
    setTimeout(() => {
      const view = getActiveEditorView()
      if (view) {
        const info = view.state.doc.line(line + 1)
        view.dispatch({ selection: { anchor: info.from }, effects: EditorView.scrollIntoView(info.from) })
        view.focus()
      }
    }, 160)
  }

  return (
    <div className="sched-overlay" onClick={() => setShowTaskSchedule(false)}>
      <div className="sched-modal" onClick={e => e.stopPropagation()}>
        <div className="sched-header">
          <span>📅 任务日程 <small>{tasks.length} 项</small></span>
          <button className="sched-close" onClick={() => setShowTaskSchedule(false)}>×</button>
        </div>
        <div className="sched-list">
          {tasks.length === 0 ? (
            <div className="sched-empty">暂无任务</div>
          ) : (
            tasks.map((t, i) => {
              const overdue = t.date && t.ts < new Date().setHours(0, 0, 0, 0) && !t.checked
              return (
                <div key={i} className={`sched-row${t.checked ? ' done' : ''}${overdue ? ' overdue' : ''}`} onClick={() => jumpTo(t.tabId, t.line)}>
                  {t.date ? <span className={`sched-date${overdue ? ' overdue' : ''}`}>{t.date}</span> : <span className="sched-date none">无日期</span>}
                  <span className={`sched-check ${t.checked ? 'on' : ''}`}>{t.checked ? '✓' : '○'}</span>
                  <span className="sched-text">{t.text || '(空)'}</span>
                  <span className="sched-file">{t.tabTitle}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
