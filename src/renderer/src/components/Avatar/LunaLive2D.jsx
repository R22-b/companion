/**
 * LunaLive2D.jsx
 * Live2D Model Renderer for Luna
 * 
 * This component will render a Live2D model when available.
 * Until then, it falls back to the enhanced sprite-based LunaAvatar.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Export your Live2D model from Cubism with these files:
 *    - Luna.moc3 (the model)
 *    - Luna.model3.json (configuration)
 *    - Luna.png (texture atlas)
 *    - Luna.physics3.json (optional - for hair/clothing physics)
 *    - motions/ folder with .motion3.json files
 * 
 * 2. Place all files in: src/renderer/src/assets/live2d/
 * 
 * 3. Install dependencies:
 *    npm install pixi.js@7 pixi-live2d-display
 * 
 * 4. Set LIVE2D_AVAILABLE to true below
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import './LunaLive2D.css';

// Toggle this when Live2D model is ready
const LIVE2D_AVAILABLE = false;

// Fallback to sprite-based avatar
import LunaAvatar, { LunaStates } from './LunaAvatar';

// Motion/Expression mapping
const MOTION_MAP = {
    idle: 'Idle',
    talking: 'Talk',
    happy: 'Happy',
    sad: 'Sad',
    thinking: 'Think',
    sleepy: 'Sleepy',
    listening: 'Listen',
    walking: 'Walk',
};

const EXPRESSION_MAP = {
    idle: 'normal',
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    surprised: 'surprised',
    thinking: 'thinking',
    sleepy: 'sleepy',
};

export default function LunaLive2D({
    state = 'idle',
    isSpeaking = false,
    lookAt = null, // { x, y } for mouse tracking
    onReady = () => { },
    onError = () => { },
}) {
    const canvasRef = useRef(null);
    const appRef = useRef(null);
    const modelRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Initialize Live2D (only if available)
    useEffect(() => {
        if (!LIVE2D_AVAILABLE) return;

        let mounted = true;

        const initLive2D = async () => {
            try {
                // Dynamic imports for Live2D
                const PIXI = await import('pixi.js');
                const { Live2DModel } = await import('pixi-live2d-display');

                // Register Live2D with PIXI
                Live2DModel.registerTicker(PIXI.Ticker);

                // Create PIXI Application
                const app = new PIXI.Application({
                    view: canvasRef.current,
                    width: 280,
                    height: 380,
                    backgroundAlpha: 0,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });

                appRef.current = app;

                // Load the Live2D model
                const modelPath = new URL(
                    '../../assets/live2d/Luna.model3.json',
                    import.meta.url
                ).href;

                const model = await Live2DModel.from(modelPath, {
                    autoInteract: false, // We'll handle interaction manually
                });

                if (!mounted) {
                    model.destroy();
                    return;
                }

                modelRef.current = model;

                // Scale and position the model
                model.anchor.set(0.5, 0.5);
                model.scale.set(0.25);
                model.x = app.screen.width / 2;
                model.y = app.screen.height / 2;

                // Add to stage
                app.stage.addChild(model);

                setIsLoaded(true);
                onReady();

                console.log('[LunaLive2D] Model loaded successfully!');
            } catch (err) {
                console.error('[LunaLive2D] Failed to load:', err);
                setError(err.message);
                onError(err);
            }
        };

        initLive2D();

        return () => {
            mounted = false;
            if (modelRef.current) {
                modelRef.current.destroy();
            }
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, [onReady, onError]);

    // Handle state/motion changes
    useEffect(() => {
        if (!modelRef.current || !isLoaded) return;

        const model = modelRef.current;
        const motionName = MOTION_MAP[state] || 'Idle';
        const expressionName = EXPRESSION_MAP[state] || 'normal';

        // Play motion
        try {
            model.motion(motionName);
        } catch (e) {
            console.warn(`[LunaLive2D] Motion '${motionName}' not found`);
        }

        // Set expression
        try {
            model.expression(expressionName);
        } catch (e) {
            console.warn(`[LunaLive2D] Expression '${expressionName}' not found`);
        }
    }, [state, isLoaded]);

    // Handle speaking animation
    useEffect(() => {
        if (!modelRef.current || !isLoaded) return;

        const model = modelRef.current;

        if (isSpeaking) {
            // Start mouth movement
            model.internalModel?.coreModel?.setParameterValueById?.('ParamMouthOpenY', 0.8);
        } else {
            // Stop mouth movement
            model.internalModel?.coreModel?.setParameterValueById?.('ParamMouthOpenY', 0);
        }
    }, [isSpeaking, isLoaded]);

    // Handle mouse/cursor tracking
    useEffect(() => {
        if (!modelRef.current || !isLoaded || !lookAt) return;

        const model = modelRef.current;

        // Calculate relative position for the model to look at
        const { x, y } = lookAt;

        try {
            model.internalModel?.coreModel?.setParameterValueById?.('ParamAngleX', x * 30);
            model.internalModel?.coreModel?.setParameterValueById?.('ParamAngleY', y * 30);
            model.internalModel?.coreModel?.setParameterValueById?.('ParamBodyAngleX', x * 10);
        } catch (e) {
            // Parameters might not exist in all models
        }
    }, [lookAt, isLoaded]);

    // Handle random blinking
    useEffect(() => {
        if (!modelRef.current || !isLoaded) return;

        const model = modelRef.current;

        const blink = () => {
            const randomDelay = 2000 + Math.random() * 4000; // 2-6 seconds

            setTimeout(() => {
                if (modelRef.current) {
                    try {
                        model.motion('Blink');
                    } catch (e) {
                        // Fallback: manually animate eye parameter
                        const coreModel = model.internalModel?.coreModel;
                        if (coreModel) {
                            coreModel.setParameterValueById?.('ParamEyeLOpen', 0);
                            coreModel.setParameterValueById?.('ParamEyeROpen', 0);
                            setTimeout(() => {
                                coreModel.setParameterValueById?.('ParamEyeLOpen', 1);
                                coreModel.setParameterValueById?.('ParamEyeROpen', 1);
                            }, 150);
                        }
                    }
                    blink(); // Schedule next blink
                }
            }, randomDelay);
        };

        blink();
    }, [isLoaded]);

    // If Live2D is not available, use sprite fallback
    if (!LIVE2D_AVAILABLE) {
        return (
            <div className="luna-live2d-wrapper fallback">
                <LunaAvatar state={state} isSpeaking={isSpeaking} />
                <div className="live2d-badge">Sprite Mode</div>
            </div>
        );
    }

    // Loading state
    if (!isLoaded && !error) {
        return (
            <div className="luna-live2d-wrapper loading">
                <div className="live2d-loader">
                    <div className="loader-ring"></div>
                    <span>Loading Luna...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="luna-live2d-wrapper error">
                <LunaAvatar state={state} isSpeaking={isSpeaking} />
                <div className="live2d-error">Live2D Error: Using fallback</div>
            </div>
        );
    }

    return (
        <div className="luna-live2d-wrapper">
            <canvas ref={canvasRef} className="luna-live2d-canvas" />
        </div>
    );
}

export { LunaStates };
