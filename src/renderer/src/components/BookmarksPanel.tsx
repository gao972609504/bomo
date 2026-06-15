/**
 * 书签面板 (Bookmarks Panel)
 * — 跨所有打开文档列出书签，点击跳转到对应标签 + 行
 * — 支持删除单个书签、清空当前文档书签
 * — 复用 editorStore 中已有的 bookmarks 数据（toggleBookmark / nextBookmark 产生的数据源）
 */
import { useMemo } from 'react'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '../store/editorStore'
import { getEditorView } from '../plugins/widgets'

export function BookmarksPanel() {
  const { bookmarksVisible, setShowBookmarks, bookmarks, tabs, activeTabId } = useEditorStore()

  // 构建按标签分组的书签列表
  const grouped = useMemo(() => {
    const list: { tabId: string; tabTitle: string; isActive: boolean; items: { line: number; label: string }[] }[] = []
    for (const tab of tabs) {
      const bm = bookmarks[tab.id]
      if (bm && bm.length > 0) {
        list.push({
          tabId: tab.id,
          tabTitle: tab.title,
          isActive: tab.id === activeTabId,
          items: [...bm].sort((a, b) => a.line - b.line),
        })
      }
    }
    return list
  }, [bookmarks, tabs, activeTabId])

  const totalCount = grouped.reduce((sum, g) => sum + g.items.length, 0)

  if (!bookmarksVisible) return null

  /** 跳转到书签：先激活标签，延迟一帧后滚动到目标行 */
  const jumpTo = (tabId: string, line: number) => {
    const store = useEditorStore.getState()
    const wasActive = store.activeTabId === tabId
    store.setActiveTab(tabId)
    const doScroll = () => {
      const editorEl = document.querySelector('.cm-editor')
      const view = editorEl ? getEditorView(editorEl as HTMLElement) : undefined
      if (!view) return
      const targetLine = view.state.doc.line(Math.min(line, view.state.doc.lines))
      view.dispatch({
        selection: { anchor: targetLine.from },
        effects: EditorView.scrollIntoView(targetLine.from, { y: 'center' }),
      })
    }
    // 切换标签后需等待编辑器重建
    if (wasActive) doScroll()
    else setTimeout(doScroll, 60)
  }

  const removeOne = (tabId: string, line: number) => {
    useEditorStore.getState().removeBookmark(tabId, line)
  }

  const clearTab = (tabId: string) => {
    const store = useEditorStore.getState()
    const bm = store.getBookmarks(tabId)
    for (const b of bm) store.removeBookmark(tabId, b.line)
  }

  return (
    <div className="bookmarks-panel">
      <div className="bookmarks-header">
        <div className="bookmarks-title">
          <span className="bookmarks-icon" aria-hidden="true">🔖</span>
          <span>书签</span>
          <span className="bookmarks-count">{totalCount}</span>
        </div>
        <button className="outline-close-btn" onClick={() => setShowBookmarks(false)} title="关闭">×</button>
      </div>

      <div className="bookmarks-content">
        {totalCount === 0 ? (
          <div className="bookmarks-empty">
            <div className="bookmarks-empty-icon">🔖</div>
            <p>暂无书签</p>
            <span className="bookmarks-empty-hint">
              在编辑器中将光标置于某行，<br />
              使用书签快捷键（如 F2 / Alt+F2）<br />
              即可添加书签
            </span>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.tabId} className="bookmarks-group">
              <div className="bookmarks-group-header">
                <span className={`bookmarks-group-title ${group.isActive ? 'active' : ''}`}>
                  {group.isActive && <span className="bookmarks-active-dot" />}
                  {group.tabTitle}
                </span>
                <button
                  className="bookmarks-clear-btn"
                  onClick={() => clearTab(group.tabId)}
                  title="清空此文档的书签"
                >清空</button>
              </div>
              {group.items.map(item => (
                <div
                  key={`${group.tabId}-${item.line}`}
                  className="bookmarks-item"
                  onClick={() => jumpTo(group.tabId, item.line)}
                >
                  <span className="bookmarks-item-line">{item.line}</span>
                  <span className="bookmarks-item-label" title={item.label}>{item.label}</span>
                  <button
                    className="bookmarks-item-del"
                    onClick={(e) => { e.stopPropagation(); removeOne(group.tabId, item.line) }}
                    title="删除此书签"
                  >×</button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
