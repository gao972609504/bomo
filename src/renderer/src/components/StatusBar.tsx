import React from 'react'
import { Tab, useEditorStore } from '../store/editorStore'

interface StatusBarProps { tab: Tab }

export function StatusBar({ tab }: StatusBarProps) {
  const { theme, toggleTheme, focusMode, toggleFocusMode, typewriterMode, toggleTypewriterMode } = useEditorStore()

  const lineCount = tab.content.split('\n').length
  const charCount = tab.content.length
  const wordCount = tab.content.trim() ? tab.content.trim().split(/\s+/).length : 0

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">{charCount} 字符</span>
        <span className="status-item">{lineCount} 行</span>
        <span className="status-item">{wordCount} 词</span>
      </div>
      <div className="status-right">
        <button
          className={`status-btn ${focusMode ? 'status-btn-active' : ''}`}
          onClick={toggleFocusMode}
          title="Focus 模式：只高亮当前段落"
        >
          🎯 Focus
        </button>
        <button
          className={`status-btn ${typewriterMode ? 'status-btn-active' : ''}`}
          onClick={toggleTypewriterMode}
          title="Typewriter 模式：光标行始终居中"
        >
          📜 打字机
        </button>
        <button className="status-btn" onClick={toggleTheme} title="切换主题">
          {theme === 'light' ? '🌙 暗色' : '☀️ 亮色'}
        </button>
        <span className="status-item">UTF-8</span>
        <span className="status-item">Markdown</span>
      </div>
    </div>
  )
}
