# 🎭 Open-LLM-VTuber Integration Guide

## What is Open-LLM-VTuber?

Open-LLM-VTuber is a complete **AI VTuber framework** that does everything you want:
- Live2D animated avatar
- Voice conversation (STT + TTS)
- Visual perception (camera + screen)
- Desktop pet mode (transparent background)
- Works offline with local LLMs

**GitHub**: https://github.com/Open-LLM-VTuber/Open-LLM-VTuber
**Documentation**: https://open-llm-vtuber.github.io/docs/quick-start

---

## Installation Options

### Option 1: Use Pre-built Desktop App (Easiest)

1. Go to: https://github.com/Open-LLM-VTuber/Open-LLM-VTuber/releases
2. Download `open-llm-vtuber-electron` for your OS
3. Run the Electron app
4. Connect to the backend server

### Option 2: Run from Source

```bash
# Clone the repository with submodules
git clone --recursive https://github.com/Open-LLM-VTuber/Open-LLM-VTuber.git
cd Open-LLM-VTuber

# Install Python dependencies (requires Python 3.10+)
pip install uv
uv pip install -r requirements.txt

# Configure your settings
# Edit conf.yaml to set up:
# - LLM backend (Ollama, OpenAI, etc.)
# - TTS engine
# - STT engine
# - Character persona

# Run the server
python server.py

# Access web UI or connect Electron client
# Web: http://localhost:8000
```

---

## Integrating with Your Luna Project

### Approach 1: Run Open-LLM-VTuber as Backend

Your current Luna project can use Open-LLM-VTuber as a backend service:

```
┌─────────────────────────────────────────────┐
│  Luna Companion (Your Electron App)         │
│  - Custom UI                                │
│  - Window management                        │
│  - Click-through mode                       │
└────────────────────┬────────────────────────┘
                     │ WebSocket
                     ▼
┌─────────────────────────────────────────────┐
│  Open-LLM-VTuber Server                     │
│  - LLM inference                            │
│  - TTS/STT                                  │
│  - Vision processing                        │
│  - Live2D state management                  │
└─────────────────────────────────────────────┘
```

### Approach 2: Embed Open-LLM-VTuber Frontend

You can embed Open-LLM-VTuber's web frontend in your Electron app:

```javascript
// In your Electron main process
const { BrowserWindow } = require('electron');

const mainWindow = new BrowserWindow({
  width: 400,
  height: 600,
  transparent: true,
  frame: false,
  alwaysOnTop: true,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true
  }
});

// Load Open-LLM-VTuber web client
mainWindow.loadURL('http://localhost:8000');
```

### Approach 3: Use Open-LLM-VTuber Components

Port specific components to your React app:

1. **Live2D Renderer** - Their Live2D implementation is production-ready
2. **WebSocket Client** - Connect to their backend for LLM, TTS, STT
3. **Expression Controller** - Map AI emotions to avatar expressions

---

## Key Configuration (conf.yaml)

```yaml
# Character persona
character:
  name: "Luna"
  persona: |
    You are Luna, a cute and caring AI desktop companion.
    You love helping your user and occasionally speak romantically.
    You're cheerful, playful, and sometimes shy.

# LLM settings (using Ollama)
llm:
  provider: "ollama"
  model: "llama3.1:8b"
  base_url: "http://localhost:11434"

# TTS settings
tts:
  provider: "edge_tts"  # or gpt_sovits, cosyvoice, etc.
  voice: "en-US-AriaNeural"  # Cute female voice

# STT settings
stt:
  provider: "faster_whisper"
  model: "base"

# Live2D model path
live2d:
  model_path: "./models/live2d/Luna/"
```

---

## Benefits of Using Open-LLM-VTuber

| Your Current Work | Open-LLM-VTuber Adds |
|-------------------|----------------------|
| AI chat via Gemini | Multiple LLM options (local!) |
| Basic TTS | Advanced voice cloning |
| Sprite avatar | Full Live2D with physics |
| Screen analysis | Live camera + screen perception |
| No STT | Full voice conversation |
| Click-through window | Already implemented! |

---

## Quick Test

1. Install and run Open-LLM-VTuber
2. Open http://localhost:8000
3. Allow microphone access
4. Start talking to your AI VTuber!

---

## Next Steps

1. **Clone Open-LLM-VTuber** alongside your Luna project
2. **Configure** it with your preferred LLM (Ollama for local, or your existing Gemini)
3. **Customize** the Live2D model path to use Luna's model
4. **Integrate** - Either embed their frontend or use their backend

---

## Resources

- **GitHub**: https://github.com/Open-LLM-VTuber/Open-LLM-VTuber
- **Docs**: https://open-llm-vtuber.github.io/docs/quick-start
- **Live2D Guide**: https://open-llm-vtuber.github.io/docs/user-guide/live2d
- **Discord**: https://discord.gg/3UDA8YFDXx

This is the most comprehensive solution for what you want to build! 🚀
