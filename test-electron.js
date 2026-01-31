const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600
    })

    win.loadURL('data:text/html,<h1>ELECTRON WORKS!</h1>')
}

app.whenReady().then(createWindow)
