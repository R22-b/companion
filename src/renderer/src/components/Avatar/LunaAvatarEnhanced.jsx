/**
 * LunaAvatarEnhanced.jsx
 * Enhanced Sprite-Based Avatar with Live2D-like Effects
 * 
 * This component adds sophisticated CSS animations to simulate
 * Live2D-like effects like:
 * - Natural eye blinking
 * - Breathing animation
 * - Hair sway physics
 * - Mouth movement during speech
 * - Mouse tracking (looking at cursor)
 */

import { useEffect, useState, useRef, useCallback } from "react";
import "./LunaAvatarEnhanced.css";

// Import Luna sprites
import lunaIdle from "../../assets/images/luna_idle.png";
import lunaTalking from "../../assets/images/luna_talking.png";
import lunaHappy from "../../assets/images/luna_happy.png";
import lunaSleepy from "../../assets/images/luna_sleepy.png";
import lunaThinking from "../../assets/images/luna_thinking.png";
import lunaListening from "../../assets/images/luna_listening.png";
import lunaWalking from "../../assets/images/luna_walking.png";

// Luna States
const STATES = {
    IDLE: "idle",
    TALKING: "talking",
    LISTENING: "listening",
    THINKING: "thinking",
    HAPPY: "happy",
    SLEEPY: "sleepy",
    WALKING: "walking",
};

// Map states to sprites
const SPRITE_MAP = {
    [STATES.IDLE]: lunaIdle,
    [STATES.TALKING]: lunaTalking,
    [STATES.LISTENING]: lunaListening,
    [STATES.THINKING]: lunaThinking,
    [STATES.HAPPY]: lunaHappy,
    [STATES.SLEEPY]: lunaSleepy,
    [STATES.WALKING]: lunaWalking,
};

export default function LunaAvatarEnhanced({
    state = STATES.IDLE,
    isSpeaking = false,
    enableMouseTracking = true,
    enableBlinking = true,
    enableBreathing = true,
}) {
    const [currentState, setCurrentState] = useState(state);
    const [currentSprite, setCurrentSprite] = useState(lunaIdle);
    const [isBlinking, setIsBlinking] = useState(false);
    const [lookDirection, setLookDirection] = useState({ x: 0, y: 0 });
    const [mouthOpen, setMouthOpen] = useState(false);
    const containerRef = useRef(null);
    const blinkTimeoutRef = useRef(null);
    const mouthIntervalRef = useRef(null);

    // Update state from props
    useEffect(() => {
        if (isSpeaking) {
            setCurrentState(STATES.TALKING);
        } else {
            setCurrentState(state);
        }
    }, [state, isSpeaking]);

    // Update sprite based on state
    useEffect(() => {
        setCurrentSprite(SPRITE_MAP[currentState] || lunaIdle);
    }, [currentState]);

    // Natural blinking effect
    useEffect(() => {
        if (!enableBlinking) return;

        const scheduleNextBlink = () => {
            const delay = 2000 + Math.random() * 4000; // 2-6 seconds

            blinkTimeoutRef.current = setTimeout(() => {
                setIsBlinking(true);

                setTimeout(() => {
                    setIsBlinking(false);
                    scheduleNextBlink();
                }, 150);
            }, delay);
        };

        scheduleNextBlink();

        return () => {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
        };
    }, [enableBlinking]);

    // Mouth animation during speech
    useEffect(() => {
        if (isSpeaking) {
            mouthIntervalRef.current = setInterval(() => {
                setMouthOpen(prev => !prev);
            }, 100 + Math.random() * 100);
        } else {
            setMouthOpen(false);
            if (mouthIntervalRef.current) {
                clearInterval(mouthIntervalRef.current);
            }
        }

        return () => {
            if (mouthIntervalRef.current) {
                clearInterval(mouthIntervalRef.current);
            }
        };
    }, [isSpeaking]);

    // Mouse tracking
    useEffect(() => {
        if (!enableMouseTracking || !containerRef.current) return;

        const handleMouseMove = (e) => {
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 3; // Eyes are in upper third

            // Calculate direction (-1 to 1)
            const maxDistance = 400;
            const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / maxDistance));
            const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / maxDistance));

            setLookDirection({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [enableMouseTracking]);

    // Calculate transform based on look direction
    const getEyeTransform = () => {
        const x = lookDirection.x * 3;
        const y = lookDirection.y * 2;
        return `translate(${x}px, ${y}px)`;
    };

    // Calculate head tilt based on look direction
    const getHeadTransform = () => {
        const rotation = lookDirection.x * 3;
        return `rotate(${rotation}deg)`;
    };

    return (
        <div
            ref={containerRef}
            className={`luna-enhanced-container ${currentState} ${isBlinking ? 'blinking' : ''} ${isSpeaking ? 'speaking' : ''}`}
            style={{ '--head-rotation': getHeadTransform() }}
        >
            {/* Holographic aura layers */}
            <div className="enhanced-aura primary" />
            <div className="enhanced-aura secondary" />
            <div className="enhanced-aura tertiary" />

            {/* Floating orbs/particles */}
            <div className="enhanced-particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`enhanced-particle p-${i + 1}`}
                        style={{
                            '--delay': `${i * 0.2}s`,
                            '--duration': `${3 + Math.random() * 3}s`,
                            '--size': `${3 + Math.random() * 5}px`,
                        }}
                    />
                ))}
            </div>

            {/* Star sparkles */}
            <div className="enhanced-sparkles">
                {[...Array(12)].map((_, i) => (
                    <span
                        key={i}
                        className={`enhanced-sparkle s-${i + 1}`}
                        style={{ '--delay': `${i * 0.25}s` }}
                    >
                        ✦
                    </span>
                ))}
            </div>

            {/* Luna sprite with live2d-like effects */}
            <div
                className={`luna-enhanced-sprite-wrapper ${enableBreathing ? 'breathing' : ''}`}
                style={{ transform: getHeadTransform() }}
            >
                {/* Main sprite */}
                <img
                    src={currentSprite}
                    alt="Luna"
                    className={`luna-enhanced-sprite ${currentState}`}
                />

                {/* Eye overlay for blinking effect */}
                {isBlinking && (
                    <div className="blink-overlay" />
                )}

                {/* Mouth animation overlay for speaking */}
                {isSpeaking && (
                    <div className={`mouth-overlay ${mouthOpen ? 'open' : 'closed'}`} />
                )}

                {/* Eye tracking indicator (subtle glow shift) */}
                <div
                    className="eye-glow"
                    style={{ transform: getEyeTransform() }}
                />
            </div>

            {/* Ambient light rays */}
            <div className="light-rays">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`light-ray ray-${i + 1}`} />
                ))}
            </div>

            {/* Name label with enhanced glow */}
            <div className="luna-enhanced-label">
                <span className="label-text">LUNA</span>
                <span className="label-glow">LUNA</span>
            </div>

            {/* State indicator */}
            <div className={`state-indicator ${currentState}`}>
                {currentState === STATES.THINKING && <span className="thinking-dots">...</span>}
                {currentState === STATES.LISTENING && <span className="listening-waves">◉</span>}
                {isSpeaking && <span className="speaking-icon">🎤</span>}
            </div>
        </div>
    );
}

export { STATES as LunaStates };
