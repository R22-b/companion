import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    dragWindow: (mouseX, mouseY) => ipcRenderer.send('drag-window', { mouseX, mouseY }),
    savePosition: () => ipcRenderer.send('save-position'),
    setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
    sendChatMessage: (message, image) => ipcRenderer.invoke('chat-request', message, image),
    analyzeScreen: (prompt) => ipcRenderer.invoke('analyze-screen', prompt),
    openApp: (appName) => ipcRenderer.invoke('open-app', appName),
    onChatChunk: (callback) => ipcRenderer.on('chat-chunk', (event, chunk) => callback(chunk))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if electron isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
}

