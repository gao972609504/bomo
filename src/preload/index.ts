import { contextBridge, ipcRenderer } from 'electron'

export interface FileTreeNode {
  name: string
  path: string
  isDirectory: boolean
  children?: FileTreeNode[]
}

const api = {
  // 文件操作
  readFile: (filePath: string): Promise<string> =>
    ipcRenderer.invoke('file:read', filePath),

  writeFile: (filePath: string, content: string): Promise<boolean> =>
    ipcRenderer.invoke('file:write', filePath, content),

  saveFileAs: (content: string): Promise<string | null> =>
    ipcRenderer.invoke('file:save-as', content),

  // 导出
  exportHTML: (html: string): Promise<string | null> =>
    ipcRenderer.invoke('export:html', html),

  exportPDF: (): Promise<string | null> =>
    ipcRenderer.invoke('export:pdf'),

  // 文件系统
  openFolder: (): Promise<string | null> =>
    ipcRenderer.invoke('dialog:openFolder'),

  readdir: (dirPath: string): Promise<FileTreeNode[]> =>
    ipcRenderer.invoke('fs:readdir', dirPath),

  getDefaultPath: (): Promise<string> =>
    ipcRenderer.invoke('app:getDefaultPath'),

  // 菜单事件监听
  onMenuNewFile: (callback: () => void) => {
    ipcRenderer.on('menu:new-file', callback)
    return () => ipcRenderer.removeListener('menu:new-file', callback)
  },
  onMenuSave: (callback: () => void) => {
    ipcRenderer.on('menu:save', callback)
    return () => ipcRenderer.removeListener('menu:save', callback)
  },
  onMenuSaveAs: (callback: () => void) => {
    ipcRenderer.on('menu:save-as', callback)
    return () => ipcRenderer.removeListener('menu:save-as', callback)
  },
  onMenuExport: (callback: (format: string) => void) => {
    const handler = (_event: any, format: string) => callback(format)
    ipcRenderer.on('menu:export', handler)
    return () => ipcRenderer.removeListener('menu:export', handler)
  },
  onMenuToggleMode: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-mode', callback)
    return () => ipcRenderer.removeListener('menu:toggle-mode', callback)
  },
  onMenuToggleSidebar: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-sidebar', callback)
    return () => ipcRenderer.removeListener('menu:toggle-sidebar', callback)
  },
  onMenuToggleTheme: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-theme', callback)
    return () => ipcRenderer.removeListener('menu:toggle-theme', callback)
  },
  onMenuToggleOutline: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-outline', callback)
    return () => ipcRenderer.removeListener('menu:toggle-outline', callback)
  },
  onMenuFindReplace: (callback: () => void) => {
    ipcRenderer.on('menu:find-replace', callback)
    return () => ipcRenderer.removeListener('menu:find-replace', callback)
  },
  onFileOpened: (callback: (data: { filePath: string; content: string }) => void) => {
    const handler = (_event: any, data: { filePath: string; content: string }) => callback(data)
    ipcRenderer.on('file:opened', handler)
    return () => ipcRenderer.removeListener('file:opened', handler)
  },
  onFolderOpened: (callback: (data: { folderPath: string; tree: FileTreeNode[] }) => void) => {
    const handler = (_event: any, data: { folderPath: string; tree: FileTreeNode[] }) => callback(data)
    ipcRenderer.on('folder:opened', handler)
    return () => ipcRenderer.removeListener('folder:opened', handler)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
