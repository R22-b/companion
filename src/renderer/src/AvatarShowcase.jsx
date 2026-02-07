/**
 * AvatarShowcase.jsx
 * Demo page showing ALL avatar approaches:
 * 1. CSS Enhanced Avatar (LunaAvatarEnhanced)
 * 2. Live2D (HiyoriLive2D) 
 * 3. VRM 3D (VRMAvatar)
 */

import { useState, lazy, Suspense } from 'react';
import LunaAvatarEnhanced from './components/Avatar/LunaAvatarEnhanced';
import './AvatarShowcase.css';

// Lazy load heavy components to prevent crashes
const HiyoriLive2D = lazy(() => import('./components/Avatar/HiyoriLive2D'));
const VRMAvatar = lazy(() => import('./components/Avatar/VRMAvatar'));

const AVATAR_TYPES = {
    CSS: 'css',
    LIVE2D: 'live2d',
    VRM: 'vrm'
};

function LoadingSpinner() {
    return (
        <div className="avatar-loading">
            <div className="spinner"></div>
            <span>Loading...</span>
        </div>
    );
}

export default function AvatarShowcase() {
    const [activeType, setActiveType] = useState(AVATAR_TYPES.CSS);
    const [state, setState] = useState('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const states = ['idle', 'talking', 'happy', 'sleepy', 'thinking', 'listening', 'waving'];

    const renderAvatar = () => {
        switch (activeType) {
            case AVATAR_TYPES.CSS:
                return (
                    <LunaAvatarEnhanced
                        state={state}
                        isSpeaking={isSpeaking}
                        enableMouseTracking={true}
                        enableBlinking={true}
                        enableBreathing={true}
                    />
                );

            case AVATAR_TYPES.LIVE2D:
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <HiyoriLive2D
                            width={380}
                            height={520}
                            enableMouseTracking={true}
                            autoPlay={true}
                        />
                    </Suspense>
                );

            case AVATAR_TYPES.VRM:
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <VRMAvatar
                            width={380}
                            height={520}
                            enableMouseTracking={true}
                        />
                    </Suspense>
                );

            default:
                return null;
        }
    };

    return (
        <div className="avatar-showcase">
            <header className="showcase-header">
                <h1>🌸 Luna Avatar Showcase 🌸</h1>
                <p>Explore three different avatar technologies</p>
            </header>

            <main className="showcase-main">
                {/* Avatar Type Selector */}
                <nav className="type-selector">
                    <button
                        className={`type-btn ${activeType === AVATAR_TYPES.CSS ? 'active' : ''}`}
                        onClick={() => setActiveType(AVATAR_TYPES.CSS)}
                    >
                        <span className="type-icon">✨</span>
                        <span className="type-name">CSS Enhanced</span>
                        <span className="type-tag working">Working</span>
                    </button>

                    <button
                        className={`type-btn ${activeType === AVATAR_TYPES.LIVE2D ? 'active' : ''}`}
                        onClick={() => setActiveType(AVATAR_TYPES.LIVE2D)}
                    >
                        <span className="type-icon">🎭</span>
                        <span className="type-name">Live2D</span>
                        <span className="type-tag experimental">Beta</span>
                    </button>

                    <button
                        className={`type-btn ${activeType === AVATAR_TYPES.VRM ? 'active' : ''}`}
                        onClick={() => setActiveType(AVATAR_TYPES.VRM)}
                    >
                        <span className="type-icon">🎮</span>
                        <span className="type-name">VRM 3D</span>
                        <span className="type-tag new">New</span>
                    </button>
                </nav>

                {/* Avatar Display */}
                <div className="avatar-display">
                    <div className="avatar-container">
                        {renderAvatar()}
                    </div>

                    {/* Type Info */}
                    <div className="type-info">
                        {activeType === AVATAR_TYPES.CSS && (
                            <>
                                <h3>CSS Enhanced Avatar</h3>
                                <p>Uses sprite images with CSS animations for:</p>
                                <ul>
                                    <li>🔵 Natural eye blinking</li>
                                    <li>🔵 Breathing animation</li>
                                    <li>🔵 Mouse tracking glow</li>
                                    <li>🔵 Mouth movement for speech</li>
                                    <li>🔵 Multiple emotion states</li>
                                </ul>
                                <p className="status-good">✅ Fully Working</p>
                            </>
                        )}

                        {activeType === AVATAR_TYPES.LIVE2D && (
                            <>
                                <h3>Live2D Avatar (Hiyori)</h3>
                                <p>Uses official Live2D Cubism SDK for:</p>
                                <ul>
                                    <li>🟡 Complex mesh deformation</li>
                                    <li>🟡 Physics simulation</li>
                                    <li>🟡 Multiple motions</li>
                                    <li>🟡 Eye tracking</li>
                                </ul>
                                <p className="status-warn">⚠️ Model loads but visibility being debugged</p>
                            </>
                        )}

                        {activeType === AVATAR_TYPES.VRM && (
                            <>
                                <h3>VRM 3D Avatar</h3>
                                <p>Uses Three.js for 3D rendering:</p>
                                <ul>
                                    <li>🟢 Full 3D character</li>
                                    <li>🟢 Easy model availability</li>
                                    <li>🟢 React Three Fiber integration</li>
                                    <li>🟢 VTuber-ready format</li>
                                </ul>
                                <p className="status-good">✅ Basic Demo Working</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Controls (for CSS avatar) */}
                {activeType === AVATAR_TYPES.CSS && (
                    <div className="controls-panel">
                        <div className="control-group">
                            <label>State:</label>
                            <div className="state-buttons">
                                {states.map(s => (
                                    <button
                                        key={s}
                                        className={state === s ? 'active' : ''}
                                        onClick={() => setState(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
                            onClick={() => setIsSpeaking(!isSpeaking)}
                        >
                            {isSpeaking ? '🔊 Speaking...' : '🔇 Start Speaking'}
                        </button>
                    </div>
                )}
            </main>

            <footer className="showcase-footer">
                <p>Luna Desktop Companion • Avatar Technology Demo</p>
            </footer>
        </div>
    );
}
