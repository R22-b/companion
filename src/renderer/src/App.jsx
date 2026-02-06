// Test Mode App - Tests all features without Luna UI
import { useState, useEffect, useCallback } from 'react';
import './index.css';

import { useVoiceControl } from './hooks/useVoiceControl';
import { useTTS } from './hooks/useTTS';

function App() {
  const [logs, setLogs] = useState([]);
  const [testStatus, setTestStatus] = useState({});

  // TTS Hook
  const { speak, stop, isSpeaking } = useTTS();

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-20), { timestamp, message, type }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  // Test AI Chat
  const testAI = async () => {
    addLog('Testing AI Chat...', 'test');
    try {
      const response = await window.api?.sendChatMessage?.("Hello Luna, say 'test successful' if you hear me.");
      if (response) {
        addLog(`AI Response: ${response}`, 'success');
        setTestStatus(prev => ({ ...prev, ai: true }));
        speak(response);
      } else {
        addLog('AI: No response received', 'error');
        setTestStatus(prev => ({ ...prev, ai: false }));
      }
    } catch (e) {
      addLog(`AI Error: ${e.message}`, 'error');
      setTestStatus(prev => ({ ...prev, ai: false }));
    }
  };

  // Test Screen Analysis
  const testScreenAnalysis = async () => {
    addLog('Testing Screen Analysis...', 'test');
    try {
      const response = await window.api?.analyzeScreen?.("Briefly describe what you see on screen.");
      if (response) {
        addLog(`Vision: ${response}`, 'success');
        setTestStatus(prev => ({ ...prev, vision: true }));
      } else {
        addLog('Vision: No response', 'error');
        setTestStatus(prev => ({ ...prev, vision: false }));
      }
    } catch (e) {
      addLog(`Vision Error: ${e.message}`, 'error');
      setTestStatus(prev => ({ ...prev, vision: false }));
    }
  };

  // Test App Opening
  const testAppOpen = async () => {
    addLog('Testing App Launch (Calculator)...', 'test');
    try {
      const response = await window.api?.openApp?.('calculator');
      if (response) {
        addLog(`App Launch: ${response}`, 'success');
        setTestStatus(prev => ({ ...prev, appLaunch: true }));
      }
    } catch (e) {
      addLog(`App Launch Error: ${e.message}`, 'error');
      setTestStatus(prev => ({ ...prev, appLaunch: false }));
    }
  };

  // Test TTS
  const testTTS = () => {
    addLog('Testing TTS...', 'test');
    speak("Hello! This is Luna speaking. Text to speech is working!");
    setTestStatus(prev => ({ ...prev, tts: true }));
    addLog('TTS: Speaking...', 'success');
  };

  // Handle voice commands
  const handleVoiceCommand = useCallback((command) => {
    addLog(`Voice Command: ${command}`, 'voice');
    setTestStatus(prev => ({ ...prev, voice: true }));

    if (command.startsWith('open:')) {
      const appName = command.split(':')[1];
      window.api?.openApp?.(appName);
    }
  }, [addLog]);

  // Voice control hook
  const { isListening } = useVoiceControl(handleVoiceCommand);

  // Run all tests on mount
  useEffect(() => {
    addLog('=== Luna Backend Test Mode ===', 'info');
    addLog('Checking API availability...', 'info');

    if (window.api) {
      addLog('✅ window.api is available', 'success');
      addLog('Available methods: ' + Object.keys(window.api).join(', '), 'info');
    } else {
      addLog('❌ window.api is NOT available (mock mode)', 'warning');
    }

    addLog(`Voice Recognition: ${isListening ? 'Active' : 'Starting...'}`, 'info');
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'Consolas, monospace',
      padding: '20px',
      overflow: 'auto'
    }}>
      <h1 style={{ color: '#00f5ff', textShadow: '0 0 20px #00f5ff' }}>
        🧪 Luna Backend Test Console
      </h1>

      {/* Status Panel */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <StatusBadge name="AI Chat" status={testStatus.ai} />
        <StatusBadge name="Vision" status={testStatus.vision} />
        <StatusBadge name="App Launch" status={testStatus.appLaunch} />
        <StatusBadge name="TTS" status={testStatus.tts} />
        <StatusBadge name="Voice" status={testStatus.voice} />
        <StatusBadge name="Listening" status={isListening} />
      </div>

      {/* Test Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <TestButton onClick={testAI}>Test AI Chat</TestButton>
        <TestButton onClick={testScreenAnalysis}>Test Screen Vision</TestButton>
        <TestButton onClick={testAppOpen}>Test Open App</TestButton>
        <TestButton onClick={testTTS}>Test TTS</TestButton>
        <TestButton onClick={() => addLog('Say "open calculator" or "look at screen"', 'info')}>
          Voice Commands Info
        </TestButton>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div style={{ color: '#ff6bff', marginBottom: '10px' }}>
          🗣️ Luna is speaking...
        </div>
      )}

      {/* Log Console */}
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '10px',
        padding: '15px',
        height: '300px',
        overflow: 'auto',
        border: '1px solid rgba(0,245,255,0.3)'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{
            color: log.type === 'error' ? '#ff6b6b' :
              log.type === 'success' ? '#6bff6b' :
                log.type === 'warning' ? '#ffb347' :
                  log.type === 'test' ? '#00f5ff' :
                    log.type === 'voice' ? '#ff6bff' : '#ccc',
            marginBottom: '5px',
            fontSize: '13px'
          }}>
            <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Components
function StatusBadge({ name, status }) {
  const color = status === undefined ? '#888' : status ? '#6bff6b' : '#ff6b6b';
  const icon = status === undefined ? '⏳' : status ? '✅' : '❌';
  return (
    <div style={{
      padding: '8px 15px',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '20px',
      border: `1px solid ${color}`,
      color: color,
      fontSize: '12px'
    }}>
      {icon} {name}
    </div>
  );
}

function TestButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #00f5ff 0%, #7c4dff 100%)',
        border: 'none',
        borderRadius: '25px',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0,245,255,0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  );
}

export default App;
