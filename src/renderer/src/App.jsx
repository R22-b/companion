import { LunaAvatar } from './components/Avatar/LunaAvatar'
import { MoodState } from './types'
import ChatBubble from './components/Interaction/ChatBubble'
import RadialMenu from './components/Interaction/RadialMenu'
import { useMoodStore } from './store/moodStore'
import { useState, useEffect, useMemo } from 'react'
import './index.css'

import { useVoiceControl } from './hooks/useVoiceControl'
import { useTTS } from './hooks/useTTS'
import { useWebcam } from './hooks/useWebcam'

function App() {
  const { mood, energyLevel, updateEnergy, updateMood } = useMoodStore()
  const [showMenu, setShowMenu] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [userInput, setUserInput] = useState('')

  const { speak, stop, isSpeaking } = useTTS();
  const { captureFrame } = useWebcam();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [volume, setVolume] = useState(0);

  // Mouse Position Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simple Volume Animation for Speaking
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        setVolume(Math.random() * 0.5 + 0.5); // Random volume between 0.5 and 1.0
      }, 100);
    } else {
      setVolume(0);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Mood Mapping for Luna
  const lunaMood = useMemo(() => {
    const mapping = {
      'happy': MoodState.HAPPY,
      'talk': MoodState.HAPPY,
      'shy': MoodState.CURIOUS,
      'annoyed': MoodState.THOUGHTFUL,
      'work': MoodState.THOUGHTFUL,
      'sleepy': MoodState.NEUTRAL,
      'idle': MoodState.NEUTRAL,
      'normal': MoodState.NEUTRAL
    };
    return mapping[mood] || MoodState.NEUTRAL;
  }, [mood]);

  // Centralized Mode Handler
  const handleModeSelect = async (mode) => {
    if (mode === 'vision' || mode === 'me_vision') {
      // Special Command: Vision
      setIsThinking(true);
      speak(mode === 'vision' ? "Checking your screen..." : "Looking at you...");
      try {
        let response;
        if (mode === 'vision') {
          response = await window.api.analyzeScreen("What is on the user's screen? Summarize it briefly.");
        } else {
          const frame = await captureFrame();
          // Send to general chat endpoint with image
          response = await window.api.sendChatMessage("The user is looking at you through their webcam. Describe them or say hello based on what you see.", frame);
        }
        setChatMessage(response);
        setShowChat(true);
        speak(response);
      } catch (e) {
        console.error(e);
        speak("I couldn't quite see that.");
      } finally {
        setIsThinking(false);
      }
      return;
    }

    if (mode.startsWith('open:')) {
      const appName = mode.split(':')[1];
      setIsThinking(true);
      try {
        const response = await window.api.openApp(appName);
        speak(response);
        setChatMessage(response);
        setShowChat(true);
      } catch (e) {
        speak("I failed to open that.");
      } finally {
        setIsThinking(false);
      }
      return;
    }

    updateMood(mode)
    setShowMenu(false)

    // Stop speaking if switching out of talk
    if (mode !== 'talk') stop();

    const responses = {
      'talk': "I'm listening.",
      'work': "I'll be quiet while you work.",
      'normal': "Atmosphere balanced.",
      'hide': "..."
    }

    // Announce mode change briefly
    if (mode === 'talk') speak(responses[mode]);
    if (mode === 'work') speak("Quiet mode active.");

    setChatMessage(responses[mode] || "...")
    setShowChat(true)
    setTimeout(() => {
      if (mode !== 'talk') setShowChat(false);
    }, 5000)
  }

  // Voice Control Integration
  const { isListening, lastTranscript } = useVoiceControl((command) => {
    console.log("Global Voice Command:", command);
    handleModeSelect(command);
  });

  useEffect(() => {
    // Time-based energy context
    const updateTimeContext = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 12) updateEnergy('alert')
      else if (hour >= 17 && hour < 21) updateEnergy('warm')
      else updateEnergy('slow')
    }

    updateTimeContext()
    const timer = setInterval(updateTimeContext, 60000)

    // Initial silent presence
    setChatMessage('...')
    setShowChat(true)
    const fadeTimer = setTimeout(() => setShowChat(false), 4000)

    return () => {
      clearInterval(timer)
      clearTimeout(fadeTimer)
    }
  }, [updateEnergy])

  useEffect(() => {
    // Proactive Check-in Logic
    const proactiveTimer = setInterval(() => {
      if (mood === 'normal' || mood === 'idle') {
        console.log("PROACTIVE: Checking in...");
        handleModeSelect('vision'); // Luna takes a peek at the screen
      }
    }, 1000 * 60 * 15); // Every 15 minutes

    // Listen for chunks
    const unsubscribe = window.api.onChatChunk((chunk) => {
      setChatMessage(prev => {
        // If it was the initial "..." clear it
        if (prev === '...') return chunk;
        return prev + chunk;
      });
      setShowChat(true);
    });

    return () => {
      clearInterval(proactiveTimer);
      // Preload needs a proper removeListener if available, but assuming single listener for now
    }
  }, [mood]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const msg = userInput;
    setUserInput('');

    stop();
    setIsThinking(true);
    setChatMessage(''); // Clear for streaming

    try {
      const response = await window.api.sendChatMessage(msg);
      // Final response is returned for sync, but chunk listener handles the UI
      // We still update setChatMessage to ensure it's exact
      setChatMessage(response);
      setShowChat(true);

      if (mood === 'talk') {
        speak(response);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setChatMessage("I'm feeling a bit quiet right now.");
      setShowChat(true);
    } finally {
      setIsThinking(false);
    }
  }

  useEffect(() => {
    // By default, ignore mouse events so the user can click through the transparent window to the desktop
    // { forward: true } keeps sending mouse move events to Luna but lets clicks pass through
    window.api.setIgnoreMouseEvents(true, { forward: true });
  }, []);

  const handleMouseEnter = () => {
    // When mouse reaches Luna's area, stop ignoring events so we can click her/menu
    window.api.setIgnoreMouseEvents(false);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // When mouse leaves Luna, resume click-through
    window.api.setIgnoreMouseEvents(true, { forward: true });
    setShowMenu(false);
  };

  return (
    <div
      className="container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: 'auto', background: 'transparent' }}
    >
      {/* Standard DOM Visual Layer - Guaranteed Persistence */}
      <div className="visual-stage">
        <LunaAvatar
          mood={lunaMood}
          isSpeaking={isSpeaking}
          volume={volume}
          mousePos={mousePos}
        />
      </div>

      {/* Subtle Floating Bubble - No text boxes */}
      <ChatBubble message={chatMessage} visible={showChat} />

      {/* Chat Input - Only visible in 'talk' mode or when interacting */}
      {mood === 'talk' && (
        <div className="chat-input-container">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type to chat..."
              autoFocus
            />
          </form>
        </div>
      )}

      <div className="interaction-region" style={{ pointerEvents: 'none' }}>
        <RadialMenu onSelect={handleModeSelect} visible={showMenu} />
      </div>
    </div>
  )
}

export default App




