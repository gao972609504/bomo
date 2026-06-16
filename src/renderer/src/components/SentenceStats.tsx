/**
 * 句子与段落结构分析 (Sentence & Paragraph Analyzer)
 * — 统计句子数、段落数、平均句长、最长句、阅读/朗读时长
 * — 与 Flesch 公式正交，关注文档结构而非难度
 */
import { useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'

function countWords(text: string): number {
  const c = text.trim()
  const cn = (c.match(/[一-龥]/g) || []).length
  const en = (c.replace(/[一-龥]/g, ' ').trim().split(/\s+/).filter(Boolean)).length
  return cn + en
}

function fmtDuration(min: number): string {
  if (min < 1) return `${Math.round(min * 60)} 秒`
  const m = Math.floor(min)
  const s = Math.round((min - m) * 60)
  return s > 0 ? `${m} 分 ${s} 秒` : `${m} 分`
}

export function SentenceStats() {
  const { tabs, activeTabId, showSentenceStats, setShowSentenceStats } = useEditorStore()
  const activeTab = tabs.find(t => t.id === activeTabId)

  const data = useMemo(() => {
    if (!activeTab?.content) return null
    const content = activeTab.content
    // 段落：空行分隔
    const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    // 句子：中英文句末标点
    const sentences = content
      .replace(/\n/g, ' ')
      .split(/(?<=[。！？!?…])\s*/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
    const sentenceWordCounts = sentences.map(countWords)
    const totalWords = countWords(content)
    const avgSentLen = sentences.length ? Math.round(totalWords / sentences.length) : 0
    const longest = sentenceWordCounts.length ? Math.max(...sentenceWordCounts) : 0
    const avgParaLen = paragraphs.length ? Math.round(sentences.length / paragraphs.length) : 0
    // 阅读时长：中文 ~400字/分，混合按词估
    const readMin = totalWords / 350
    const speakMin = totalWords / 200
    return {
      sentences: sentences.length, paragraphs: paragraphs.length,
      totalWords, avgSentLen, longest, avgParaLen,
      read: fmtDuration(readMin), speak: fmtDuration(speakMin),
    }
  }, [activeTab?.content])

  if (!showSentenceStats) return null

  const rows = data ? [
    { label: '句子数', value: String(data.sentences) },
    { label: '段落数', value: String(data.paragraphs) },
    { label: '总字数', value: data.totalWords.toLocaleString() },
    { label: '平均句长', value: `${data.avgSentLen} 字` },
    { label: '最长句', value: `${data.longest} 字` },
    { label: '平均段落', value: `${data.avgParaLen} 句` },
    { label: '预估阅读', value: data.read },
    { label: '预估朗读', value: data.speak },
  ] : []

  return (
    <div className="sentence-panel">
      <div className="sentence-header">
        <span>📐 结构分析</span>
        <button className="sentence-close" onClick={() => setShowSentenceStats(false)}>×</button>
      </div>
      <div className="sentence-body">
        {!data ? (
          <div className="sentence-empty">无内容</div>
        ) : (
          <table className="sentence-table">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="sentence-label">{r.label}</td>
                  <td className="sentence-value">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
