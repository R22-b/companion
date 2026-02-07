/**
 * Luna Avatar Demo Page
 * Preview all avatar variants and effects
 */

import { useState, useEffect, useCallback } from 'react';
import './LunaDemo.css';

// Import all avatar variants
import LunaAvatar, { LunaStates } from './components/Avatar/LunaAvatar';
import LunaAvatarEnhanced from './components/Avatar/LunaAvatarEnhanced';

const STATES = ['idle', 'talking', 'happy', 'sleepy', 'thinking', 'listening', 'walking'];

export default function LunaDemo() {
    const [currentState, setCurrentState] = useState('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeVariant, setActiveVariant] = useState('enhanced');
    const [mouseTracking, setMouseTracking] = useState(true);
    const [blinking, setBlinking] = useState(true);
    const [breathing, setBreathing] = useState(true);
    const [autoDemo, setAutoDemo] = useState(false);

    // Auto demo mode - cycles through states
    useEffect(() => {
        if (!autoDemo) return;

        let stateIndex = 0;
        const interval = setInterval(() => {
            stateIndex = (stateIndex + 1) % STATES.length;
            setCurrentState(STATES[stateIndex]);

            // Randomly toggle speaking
            if (STATES[stateIndex] === 'talking') {
                setIsSpeaking(true);
                setTimeout(() => setIsSpeaking(false), 2000);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [autoDemo]);

    // Simulate speaking
    const simulateSpeaking = useCallback(() => {
        setIsSpeaking(true);
        setCurrentState('talking');

        setTimeout(() => {
            setIsSpeaking(false);
            setCurrentState('idle');
        }, 3000);
    }, []);

    return (
        <div className="luna-demo-container">
            {/* Header */}
            <header className="demo-header">
                <h1 className="demo-title">
                    <span className="title-icon">✨</span>
                    Luna Avatar Demo
                    <span className="title-icon">✨</span>
                </h1>
                <p className="demo-subtitle">Preview all avatar effects and animations</p>
            </header>

            <div className="demo-content">
                {/* Left Panel - Controls */}
                <aside className="demo-controls">
                    <section className="control-section">
                        <h3>Avatar Variant</h3>
                        <div className="variant-buttons">
                            <button
                                className={`variant-btn ${activeVariant === 'original' ? 'active' : ''}`}
                                onClick={() => setActiveVariant('original')}
                            >
                                Original
                            </button>
                            <button
                                className={`variant-btn ${activeVariant === 'enhanced' ? 'active' : ''}`}
                                onClick={() => setActiveVariant('enhanced')}
                            >
                                Enhanced ✨
                            </button>
                        </div>
                    </section>

                    <section className="control-section">
                        <h3>Current State</h3>
                        <div className="state-buttons">
                            {STATES.map(state => (
                                <button
                                    key={state}
                                    className={`state-btn ${currentState === state ? 'active' : ''}`}
                                    onClick={() => setCurrentState(state)}
                                >
                                    {state.charAt(0).toUpperCase() + state.slice(1)}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="control-section">
                        <h3>Actions</h3>
                        <div className="action-buttons">
                            <button
                                className={`action-btn ${isSpeaking ? 'speaking' : ''}`}
                                onClick={simulateSpeaking}
                            >
                                🎤 Simulate Speaking
                            </button>
                            <button
                                className={`action-btn ${autoDemo ? 'active' : ''}`}
                                onClick={() => setAutoDemo(!autoDemo)}
                            >
                                🔄 {autoDemo ? 'Stop' : 'Start'} Auto Demo
                            </button>
                        </div>
                    </section>

                    {activeVariant === 'enhanced' && (
                        <section className="control-section">
                            <h3>Enhanced Features</h3>
                            <div className="toggle-list">
                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={mouseTracking}
                                        onChange={(e) => setMouseTracking(e.target.checked)}
                                    />
                                    <span className="toggle-label">👀 Mouse Tracking</span>
                                </label>
                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={blinking}
                                        onChange={(e) => setBlinking(e.target.checked)}
                                    />
                                    <span className="toggle-label">👁️ Natural Blinking</span>
                                </label>
                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={breathing}
                                        onChange={(e) => setBreathing(e.target.checked)}
                                    />
                                    <span className="toggle-label">🌬️ Breathing Animation</span>
                                </label>
                            </div>
                        </section>
                    )}

                    <section className="control-section info-section">
                        <h3>ℹ️ Info</h3>
                        <div className="info-content">
                            <p><strong>Current:</strong> {currentState}</p>
                            <p><strong>Speaking:</strong> {isSpeaking ? 'Yes' : 'No'}</p>
                            <p><strong>Variant:</strong> {activeVariant}</p>
                        </div>
                    </section>
                </aside>

                {/* Center - Avatar Display */}
                <main className="demo-stage">
                    <div className="stage-backdrop">
                        <div className="backdrop-grid"></div>
                    </div>

                    <div className="avatar-container">
                        {activeVariant === 'original' ? (
                            <LunaAvatar
                                state={currentState}
                                isSpeaking={isSpeaking}
                            />
                        ) : (
                            <LunaAvatarEnhanced
                                state={currentState}
                                isSpeaking={isSpeaking}
                                enableMouseTracking={mouseTracking}
                                enableBlinking={blinking}
                                enableBreathing={breathing}
                            />
                        )}
                    </div>

                    <div className="stage-label">
                        <span className="label-variant">{activeVariant.toUpperCase()}</span>
                        <span className="label-state">{currentState.toUpperCase()}</span>
                    </div>
                </main>

                {/* Right Panel - Features List */}
                <aside className="demo-features">
                    <section className="feature-section">
                        <h3>🌟 Enhanced Features</h3>
                        <ul className="feature-list">
                            <li className={mouseTracking ? 'active' : ''}>
                                <span className="feature-icon">👀</span>
                                <span className="feature-text">Mouse Tracking - Luna follows your cursor</span>
                            </li>
                            <li className={blinking ? 'active' : ''}>
                                <span className="feature-icon">👁️</span>
                                <span className="feature-text">Natural Blinking - Random 2-6s intervals</span>
                            </li>
                            <li className={breathing ? 'active' : ''}>
                                <span className="feature-icon">🌬️</span>
                                <span className="feature-text">Breathing Animation - Subtle life-like motion</span>
                            </li>
                            <li className="active">
                                <span className="feature-icon">💬</span>
                                <span className="feature-text">Mouth Animation - Synced with speaking</span>
                            </li>
                            <li className="active">
                                <span className="feature-icon">✨</span>
                                <span className="feature-text">20 Floating Particles - More magical effect</span>
                            </li>
                            <li className="active">
                                <span className="feature-icon">⭐</span>
                                <span className="feature-text">12 Star Sparkles - Twinkling stars</span>
                            </li>
                            <li className="active">
                                <span className="feature-icon">🌈</span>
                                <span className="feature-text">3-Layer Holographic Aura</span>
                            </li>
                            <li className="active">
                                <span className="feature-icon">💫</span>
                                <span className="feature-text">Light Rays - Ambient glow effect</span>
                            </li>
                        </ul>
                    </section>

                    <section className="feature-section">
                        <h3>🎭 State-Specific Effects</h3>
                        <ul className="state-effects">
                            <li><strong>Idle:</strong> Gentle floating animation</li>
                            <li><strong>Talking:</strong> Pulsing glow, mouth movement</li>
                            <li><strong>Happy:</strong> Bouncy energy, bright colors</li>
                            <li><strong>Sleepy:</strong> Slow drift, dimmed glow</li>
                            <li><strong>Thinking:</strong> Shimmer effect, hue shift</li>
                            <li><strong>Listening:</strong> Attentive pulse</li>
                            <li><strong>Walking:</strong> Step bounce animation</li>
                        </ul>
                    </section>

                    <section className="feature-section live2d-section">
                        <h3>🔮 Coming Soon: Live2D</h3>
                        <p>Full Live2D model with:</p>
                        <ul>
                            <li>Smooth expression transitions</li>
                            <li>Real lip sync</li>
                            <li>Hair physics</li>
                            <li>Dress movement</li>
                        </ul>
                        <p className="live2d-note">See LUNA_MODEL_GUIDE.md for details</p>
                    </section>
                </aside>
            </div>

            {/* Footer */}
            <footer className="demo-footer">
                <p>Luna AI Companion • Enhanced Avatar System • Move your mouse to see tracking effect ✨</p>
            </footer>
        </div>
    );
}
