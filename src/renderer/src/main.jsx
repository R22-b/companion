import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// VERIFICATION MOCK FOR BROWSER
if (!window.api) {
  console.log("Injecting Mock API for Browser Verification");
  window.api = {
    sendChatMessage: async (msg, image) => {
      console.log("MOCK IPC: chat-request", msg);
      return "Hello! I'm Luna, your desktop companion. This is a test response~";
    },
    analyzeScreen: async (prompt) => {
      console.log("MOCK IPC: analyze-screen", prompt);
      return "I can see you're testing me in the browser! Everything looks good~";
    },
    openApp: async (appName) => {
      console.log("MOCK IPC: open-app", appName);
      return `I would open ${appName} for you if I were in Electron!`;
    },
    setIgnoreMouseEvents: (ignore, options) => {
      console.log("MOCK: setIgnoreMouseEvents", ignore, options);
    },
    onChatChunk: (callback) => {
      console.log("MOCK: Registered chat chunk listener");
      return () => { }; // Return unsubscribe function
    },
    on: (channel, func) => { console.log(`MOCK LISTENER: ${channel}`); },
    send: (channel, data) => { console.log(`MOCK SEND: ${channel}`, data); }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

