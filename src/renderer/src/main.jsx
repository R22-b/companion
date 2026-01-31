import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// VERIFICATION MOCK FOR BROWSER
if (!window.api) {
    console.log("Injecting Mock API for Browser Verification");
    window.api = {
        sendChatMessage: async (msg) => {
            console.log("MOCK IPC: chat-request", msg);
            return "This is a simulated AI response used for UI testing.";
        },
        on: (channel, func) => { console.log(`MOCK LISTENER: ${channel}`); },
        send: (channel, data) => { console.log(`MOCK SEND: ${channel}`, data); }
    };
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
