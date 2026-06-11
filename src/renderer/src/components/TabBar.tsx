import React from 'react'
import { useEditorStore } from '../store/editorStore'
import { useTabContextMenu } from './TabContextMenu'

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()
  const { show: showContextMenu, Menu } = useTabContextMenu()

  if (tabs.length === 0) return null

  return (
    <>
      <div className="tab-bar">
        <div className="tab-list">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`tab-item ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              onContextMenu={(e) => showContextMenu(e, tab.id, index, tab.filePath, tab.title)}
            >
              <span className="tab-title">
                {tab.isModified && <span className="tab-modified">●</span>}
                {tab.title}
              </span>
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      {Menu}
    </>
  )
}
