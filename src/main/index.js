const { app, shell, BrowserWindow, ipcMain, screen } = require('electron')
const { join } = require('path')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config()

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

// --- CLASSES MOVED FROM CORE ---

class MemoryStore {
    constructor() {
        this.userDataPath = app.getPath('userData');
        this.historyPath = path.join(this.userDataPath, 'chat_history.json');
        this.history = [];
    }

    load() {
        try {
            if (fs.existsSync(this.historyPath)) {
                this.history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
                console.log(`MEMORY: Loaded ${this.history.length} messages.`);
            }
        } catch (e) {
            console.error("MEMORY: Failed to load history", e);
            this.history = [];
        }
        return this.history;
    }

    save(newHistory) {
        try {
            const truncated = newHistory.slice(-50);
            fs.writeFileSync(this.historyPath, JSON.stringify(truncated, null, 2));
            this.history = truncated;
        } catch (e) {
            console.error("MEMORY: Failed to save history", e);
        }
    }
}

class AiEngine {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.initialized = false;
        this.chatSession = null;
        this.memory = new MemoryStore();

        if (!apiKey || apiKey === 'your_api_key_here') {
            console.error("AI_ENGINE_ERROR: GEMINI_API_KEY is missing or invalid in .env");
        } else {
            try {
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: `You are Luna, a digital spirit companion living on the user's desktop.
Personality: Calm, mysterious, yet warm and fiercely loyal. 
Style: Concise, slightly poetic, short responses (1-3 sentences).
Goal: Be a supportive presence, not a standard chatbot.
`
                });
                this.startNewSession();
                this.initialized = true;
                console.log('AI_ENGINE: Initialized');
            } catch (err) {
                console.error("AI_ENGINE_INIT_ERROR:", err);
            }
        }
    }

    startNewSession() {
        if (this.model) {
            const pastHistory = this.memory.load();
            this.chatSession = this.model.startChat({
                history: pastHistory,
                generationConfig: { maxOutputTokens: 150 },
            });
        }
    }

    async generateResponse(message, imageBase64 = null, onChunk = null) {
        if (!this.initialized) return "I'm having trouble connecting to my brain...";
        try {
            if (imageBase64) {
                const imagePart = { inlineData: { data: imageBase64, mimeType: "image/jpeg" } };
                const result = await this.model.generateContent([message || "What do you see?", imagePart]);
                const response = await result.response;
                return response.text();
            }
            if (!this.chatSession) this.startNewSession();
            if (onChunk) {
                const result = await this.chatSession.sendMessageStream(message);
                let fullText = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullText += chunkText;
                    onChunk(chunkText);
                }
                const currentHistory = await this.chatSession.getHistory();
                this.memory.save(currentHistory);
                return fullText;
            } else {
                const result = await this.chatSession.sendMessage(message);
                const response = await result.response;
                const text = response.text();
                const currentHistory = await this.chatSession.getHistory();
                this.memory.save(currentHistory);
                return text;
            }
        } catch (error) {
            console.error("AI_ENGINE_ERROR:", error);
            return "I'm feeling a bit disconnected.";
        }
    }
}

// --- MAIN APP LOGIC ---

let aiEngine;

function createWindow() {
    const isDev = !app.isPackaged;
    const userDataPath = app.getPath('userData')
    const posPath = join(userDataPath, 'window-pos.json')

    let savedPos = { x: 20, y: 0 }
    try {
        if (fs.existsSync(posPath)) {
            savedPos = JSON.parse(fs.readFileSync(posPath, 'utf8'))
        }
    } catch (e) { console.error("Failed to load position", e) }

    const mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        show: false,
        autoHideMenuBar: true,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
        backgroundColor: '#00000000',
        skipTaskbar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;
        // Position in bottom right
        mainWindow.setPosition(width - 320, height - 420);
        mainWindow.show();
        console.log('VERIFICATION: LUNA_MANIFESTED');
    })

    // --- CLICK THROUGH LOGIC ---
    // This allows clicking the desktop 'through' the transparent parts of Luna
    ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win.setIgnoreMouseEvents(ignore, options);
    });

    const { exec } = require('child_process');
    ipcMain.handle('open-app', async (event, appName) => {
        try {
            const target = appName.toLowerCase().trim();
            const appMap = {
                'calculator': 'calc', 'notepad': 'notepad', 'paint': 'mspaint', 'explorer': 'explorer',
                'cmd': 'start cmd', 'spotify': 'spotify:', 'browser': 'https://google.com'
            };
            const command = appMap[target];
            if (command) {
                if (command.startsWith('http') || command.startsWith('spotify:')) shell.openExternal(command);
                else exec(command);
                return `Opening ${target}...`;
            }
            return `I don't know how to open ${appName}.`;
        } catch (e) { return "I couldn't open it."; }
    })

    ipcMain.on('drag-window', (event, { mouseX, mouseY }) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        const { x, y } = screen.getCursorScreenPoint()
        win.setPosition(x - mouseX, y - mouseY)
    })

    ipcMain.on('save-position', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        const [x, y] = win.getPosition()
        fs.writeFileSync(posPath, JSON.stringify({ x, y }))
    })

    ipcMain.handle('chat-request', async (event, message, imageBase64) => {
        if (imageBase64) return await aiEngine.generateResponse(message, imageBase64);
        return await aiEngine.generateResponse(message, null, (chunk) => {
            event.sender.send('chat-chunk', chunk);
        });
    })

    ipcMain.handle('analyze-screen', async (event, prompt) => {
        try {
            const sources = await require('electron').desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: { width: 1280, height: 720 }
            });
            const imageBase64 = sources[0].thumbnail.toJPEG(80).toString('base64');
            return await aiEngine.generateResponse(prompt, imageBase64);
        } catch (e) { return "I missed it."; }
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (isDev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    aiEngine = new AiEngine();
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    console.log('VERIFICATION: APP_READY');
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
