import React, { useState } from 'react'
import { useEditorStore, FileTreeNode } from '../store/editorStore'

export function FileTree() {
  const { fileTree, folderPath, sidebarVisible } = useEditorStore()
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())

  if (!sidebarVisible) return null

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const openFile = async (node: FileTreeNode) => {
    if (node.isDirectory) {
      toggleDir(node.path)
      return
    }
    const store = useEditorStore.getState()
    const existing = store.tabs.find((t) => t.filePath === node.path)
    if (existing) {
      store.setActiveTab(existing.id)
    } else {
      if (!window.api) return
      const content = await window.api.readFile(node.path)
      store.createTab(node.path, content)
    }
  }

  const renderNode = (node: FileTreeNode, depth: number = 0) => {
    const isExpanded = expandedDirs.has(node.path)
    return (
      <div key={node.path}>
        <div
          className={`file-tree-item ${node.isDirectory ? 'directory' : 'file'}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => openFile(node)}
        >
          <span className="file-tree-icon">
            {node.isDirectory ? (isExpanded ? '📂' : '📁') : getFileIcon(node.name)}
          </span>
          <span className="file-tree-name">{node.name}</span>
        </div>
        {node.isDirectory && isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        {folderPath ? (
          <span title={folderPath}>{folderPath.split(/[/\\]/).pop()}</span>
        ) : (
          <span>资源管理器</span>
        )}
        <button
          className="file-tree-btn"
          title="打开文件夹"
          onClick={async () => {
            if (!window.api) return
            const path = await window.api.openFolder()
            if (path) {
              const tree = await window.api.readdir(path)
              useEditorStore.getState().setFileTree(tree, path)
            }
          }}
        >
          📂
        </button>
      </div>
      <div className="file-tree-content">
        {fileTree.length > 0 ? (
          fileTree.map((node) => renderNode(node))
        ) : (
          <div className="file-tree-empty">
            <p>没有打开的文件夹</p>
            <button onClick={async () => {
              if (!window.api) return
              const path = await window.api.openFolder()
              if (path) {
                const tree = await window.api.readdir(path)
                useEditorStore.getState().setFileTree(tree, path)
              }
            }}>
              打开文件夹
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function getFileIcon(name: string): string {
  if (/\.(md|markdown)$/i.test(name)) return '📝'
  if (/\.txt$/i.test(name)) return '📄'
  return '📄'
}
