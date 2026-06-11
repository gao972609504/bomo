import React from 'react'
import { useEditorStore } from '../store/editorStore'

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()

  if (tabs.length === 0) return null

  return (
    <div className="tab-bar">
      <div className="tab-list">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
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
  )
}
