/**
 * 词频分析面板 (Word Frequency Analysis)
 * — 统计当前文档或全部打开文档的高频词，帮助写作者发现过度使用的词汇
 * — 类似 Hemingway Editor / ProWritingAid 的词汇重复检测
 * — 支持中英文混合分词，点击词项可触发查找
 */
import { useState, useEffect, useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'

// ── 英文停用词（冠词、介词、连词、代词等高频虚词）──
const EN_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'on', 'at', 'by',
  'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'just', 'now', 'this', 'that', 'these', 'those', 'it',
  'its', 'they', 'them', 'their', 'we', 'you', 'your', 'he', 'she', 'his', 'her',
  'i', 'me', 'my', 'us', 'our', 'if', 'as', 'also', 'get', 'got', 'one', 'two',
])

// ── 中文停用词（虚词、语气词、代词等）──
const CN_STOPWORDS = new Set([
  '的', '了', '是', '在', '我', '你', '他', '她', '它', '们', '和', '与', '或',
  '也', '都', '就', '还', '又', '才', '只', '要', '会', '能', '可', '一', '这',
  '那', '个', '上', '下', '里', '外', '中', '内', '前', '后', '左', '右', '为',
  '以', '及', '并', '且', '着', '过', '吗', '呢', '吧', '啊', '哦', '嗯', '嘛',
  '把', '被', '让', '使', '给', '对', '向', '从', '到', '于', '由', '所', '而',
  '则', '即', '便', '再', '已', '正', '将', '应', '须', '需', '去', '来', '看',
  '说', '做', '有', '没', '不', '很', '太', '更', '最', '真', '好', '多', '少',
])

interface FreqEntry {
  word: string
  count: number
  isCJK: boolean
}

/** 分析文本，返回词频列表 */
function analyzeText(text: string, includeStopwords: boolean): { entries: FreqEntry[]; totalTokens: number } {
  const freq = new Map<string, { count: number; isCJK: boolean }>()
  let totalTokens = 0

  // 英文单词（长度 >= 3，避免过滤掉 is/at 等噪声）
  const enRe = /[a-zA-Z][a-zA-Z'-]*/g
  let m: RegExpExecArray | null
  while ((m = enRe.exec(text))) {
    const raw = m[0].toLowerCase().replace(/^['-]+|['-]+$/g, '')
    if (raw.length < 3) continue
    totalTokens++
    if (!includeStopwords && EN_STOPWORDS.has(raw)) continue
    const entry = freq.get(raw)
    if (entry) entry.count++
    else freq.set(raw, { count: 1, isCJK: false })
  }

  // 中文字符（逐字统计字频，排除标点）
  const cnRe = /[一-鿿]/g
  while ((m = cnRe.exec(text))) {
    const ch = m[0]
    totalTokens++
    if (!includeStopwords && CN_STOPWORDS.has(ch)) continue
    const entry = freq.get(ch)
    if (entry) entry.count++
    else freq.set(ch, { count: 1, isCJK: true })
  }

  const entries: FreqEntry[] = Array.from(freq.entries())
    .map(([word, v]) => ({ word, count: v.count, isCJK: v.isCJK }))
    .filter(e => e.count >= 2) // 只显示出现 2 次以上的词
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))

  return { entries, totalTokens }
}

export function WordFrequency() {
  const { wordFreqVisible, setShowWordFreq, tabs, activeTabId, setShowFindReplace } = useEditorStore()
  const [scope, setScope] = useState<'current' | 'all'>('current')
  const [includeStop, setIncludeStop] = useState(false)
  const [topN, setTopN] = useState(25)

  // 获取待分析文本
  const text = useMemo(() => {
    if (scope === 'all') return tabs.map(t => t.content).join('\n\n')
    const active = tabs.find(t => t.id === activeTabId)
    return active?.content ?? ''
  }, [scope, tabs, activeTabId])

  // 防抖分析
  const [analysis, setAnalysis] = useState<{ entries: FreqEntry[]; totalTokens: number }>({ entries: [], totalTokens: 0 })
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysis(analyzeText(text, includeStop))
    }, 400)
    return () => clearTimeout(timer)
  }, [text, includeStop])

  const maxCount = analysis.entries[0]?.count ?? 1
  const shown = analysis.entries.slice(0, topN)
  const uniqueCount = analysis.entries.length

  if (!wordFreqVisible) return null

  /** 点击词项 → 触发查找替换面板 */
  const searchWord = (word: string) => {
    // 通过全局查找触发：写入剪贴板并打开查找面板
    const store = useEditorStore.getState()
    store.setShowFindReplace(true)
    // 通过自定义事件把搜索词传给 FindReplace
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('markflow:find-prefill', { detail: word }))
    }, 50)
  }

  return (
    <div className="wordfreq-panel">
      <div className="wordfreq-header">
        <div className="wordfreq-title">
          <span className="wordfreq-icon" aria-hidden="true">📊</span>
          <span>词频分析</span>
        </div>
        <button className="outline-close-btn" onClick={() => setShowWordFreq(false)} title="关闭">×</button>
      </div>

      <div className="wordfreq-controls">
        <div className="wordfreq-toggle-group">
          <button
            className={`wordfreq-toggle ${scope === 'current' ? 'active' : ''}`}
            onClick={() => setScope('current')}
          >当前文档</button>
          <button
            className={`wordfreq-toggle ${scope === 'all' ? 'active' : ''}`}
            onClick={() => setScope('all')}
          >全部打开</button>
        </div>
        <button
          className={`wordfreq-check ${includeStop ? 'active' : ''}`}
          onClick={() => setIncludeStop(!includeStop)}
          title="是否包含停用词（the、的、了 等）"
        >{includeStop ? '☑' : '☐'} 停用词</button>
      </div>

      <div className="wordfreq-summary">
        <span>共 <strong>{analysis.totalTokens.toLocaleString()}</strong> 词</span>
        <span>不重复 <strong>{uniqueCount.toLocaleString()}</strong></span>
      </div>

      <div className="wordfreq-list">
        {shown.length === 0 ? (
          <div className="wordfreq-empty">
            {analysis.totalTokens === 0 ? '暂无文本可分析' : '没有重复出现的词汇'}
          </div>
        ) : (
          shown.map((e, idx) => (
            <div
              key={e.word}
              className={`wordfreq-item ${e.isCJK ? 'wordfreq-item-cjk' : ''}`}
              onClick={() => searchWord(e.word)}
              title={`点击查找「${e.word}」的所有出现位置`}
            >
              <span className="wordfreq-rank">{idx + 1}</span>
              <span className="wordfreq-word">{e.word}</span>
              <span className="wordfreq-bar-track">
                <span
                  className={`wordfreq-bar-fill ${e.count >= 5 ? 'hot' : e.count >= 3 ? 'warm' : ''}`}
                  style={{ width: `${(e.count / maxCount) * 100}%` }}
                />
              </span>
              <span className="wordfreq-count">{e.count}</span>
            </div>
          ))
        )}
      </div>

      {uniqueCount > topN && (
        <div className="wordfreq-footer">
          <button className="wordfreq-more-btn" onClick={() => setTopN(topN + 25)}>
            显示更多（{topN} / {uniqueCount}）
          </button>
        </div>
      )}
    </div>
  )
}
