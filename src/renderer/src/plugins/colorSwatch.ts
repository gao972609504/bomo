/**
 * 颜色色块装饰 (Color Swatch Decorator)
 * — 在文档中的 CSS 颜色值（#hex / rgb / rgba / hsl / hsla）旁显示真实色块
 * — 类似 VS Code 内置 color decorator 和 Obsidian 颜色插件
 * — ViewPlugin 装饰，仅扫描可视区域，性能友好
 */
import { ViewPlugin, ViewUpdate, Decoration, DecorationSet, WidgetType, EditorView } from '@codemirror/view'

class ColorSwatchWidget extends WidgetType {
  constructor(readonly color: string) { super() }
  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-color-swatch'
    span.style.background = this.color
    span.title = this.color
    return span
  }
  eq(other: ColorSwatchWidget) { return this.color === other.color }
  ignoreEvent() { return false }
}

// 颜色匹配：8/6/4/3 位 hex + rgb/rgba/hsl/hsla 函数
const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g
const FN_RE = /(?:rgba?|hsla?)\(\s*[^)]+\)/g

function buildColorSwatches(view: EditorView): DecorationSet {
  const decos: { at: number; value: Decoration }[] = []
  for (const { from, to } of view.visibleRanges) {
    // 跳过代码块内的颜色（避免干扰代码阅读）—— 简化：扫描整段可视文本
    const text = view.state.doc.sliceString(from, to)
    const collect = (re: RegExp) => {
      re.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(text))) {
        const color = m[0]
        const at = from + m.index + color.length
        decos.push({ at, value: Decoration.widget({ widget: new ColorSwatchWidget(color), side: 1 }) })
      }
    }
    collect(HEX_RE)
    collect(FN_RE)
  }
  decos.sort((a, b) => a.at - b.at)
  return Decoration.set(decos.map(d => d.value.range(d.at, d.at)), true)
}

export function colorSwatches() {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet
    constructor(view: EditorView) { this.decorations = buildColorSwatches(view) }
    update(u: ViewUpdate) {
      if (u.docChanged || u.viewportChanged) this.decorations = buildColorSwatches(u.view)
    }
  }, { decorations: v => v.decorations })
}
