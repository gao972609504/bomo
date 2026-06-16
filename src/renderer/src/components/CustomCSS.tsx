/**
 * 自定义 CSS 注入 (Custom CSS)
 * — 用户输入任意 CSS 实时应用到整个应用，持久化到 localStorage
 * — 灵感来自 Obsidian 的 CSS snippets 主题定制
 */
import { useState } from 'react'
import { useEditorStore } from '../store/editorStore'

const STORAGE_KEY = 'markflow-custom-css'
const STYLE_ID = 'markflow-custom-style'

export function applyCustomCSS(css: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = css
}

export function loadCustomCSS(): string {
  try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
}

export function CustomCSSDialog() {
  const { showCustomCSS, setShowCustomCSS } = useEditorStore()
  const [css, setCss] = useState(() => loadCustomCSS())

  if (!showCustomCSS) return null

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, css) } catch { /* noop */ }
    applyCustomCSS(css)
    setShowCustomCSS(false)
  }

  const reset = () => {
    setCss('')
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
    applyCustomCSS('')
  }

  return (
    <div className="customcss-overlay" onClick={() => setShowCustomCSS(false)}>
      <div className="customcss-modal" onClick={e => e.stopPropagation()}>
        <div className="customcss-header">
          <span>🎨 自定义 CSS</span>
          <button className="customcss-close" onClick={() => setShowCustomCSS(false)}>×</button>
        </div>
        <p className="customcss-hint">输入 CSS 覆盖默认样式，例如：<code>--accent-color: #e91e63;</code> 或 <code>.cm-content {'{ font-size: 18px; }'}</code></p>
        <textarea
          className="customcss-textarea"
          value={css}
          onChange={e => setCss(e.target.value)}
          placeholder={'/* 在此输入自定义 CSS */\n:root {\n  --accent-color: #e91e63;\n}\n.cm-content {\n  font-size: 18px;\n}'}
          spellCheck={false}
        />
        <div className="customcss-actions">
          <button className="customcss-btn" onClick={reset}>清空</button>
          <button className="customcss-btn primary" onClick={save}>保存并应用</button>
        </div>
      </div>
    </div>
  )
}
