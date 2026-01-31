const fs = require('fs');
const path = require('path');
const { app } = require('electron');

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
            // Keep only last 50 messages to prevent bloat
            const truncated = newHistory.slice(-50);
            fs.writeFileSync(this.historyPath, JSON.stringify(truncated, null, 2));
            this.history = truncated;
        } catch (e) {
            console.error("MEMORY: Failed to save history", e);
        }
    }
}

module.exports = { MemoryStore };
