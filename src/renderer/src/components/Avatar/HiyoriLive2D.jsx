/**
 * HiyoriLive2D.jsx
 * Live2D Model Renderer - FIXED VERSION
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import './HiyoriLive2D.css';

export default function HiyoriLive2D({
    width = 350,
    height = 500,
    modelPath = null,
    onReady = () => { },
    onError = () => { },
    enableMouseTracking = true,
    autoPlay = true,
}) {
    const canvasRef = useRef(null);
    const appRef = useRef(null);
    const modelRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [currentMotion, setCurrentMotion] = useState('');

    useEffect(() => {
        if (!canvasRef.current) return;

        let mounted = true;
        let app = null;

        const initLive2D = async () => {
            try {
                // Check if Cubism Core is loaded
                if (typeof window.Live2DCubismCore === 'undefined') {
                    throw new Error('Live2DCubismCore not loaded. Make sure live2dcubismcore.min.js is included in index.html');
                }

                // Dynamic imports
                const PIXI = await import('pixi.js');
                const { Live2DModel } = await import('pixi-live2d-display/cubism4');

                // Register PIXI globally
                window.PIXI = PIXI;

                // Register ticker
                Live2DModel.registerTicker(PIXI.Ticker);

                // Create PIXI Application - use newer init method if available
                app = new PIXI.Application();

                await app.init({
                    view: canvasRef.current,
                    width: width,
                    height: height,
                    backgroundAlpha: 0,
                    antialias: true,
                    resolution: 1,
                    autoDensity: false,
                });

                appRef.current = app;

                // Model path
                const defaultModelPath = '/live2d/Hiyori/Hiyori.model3.json';

                console.log('[HiyoriLive2D] Loading model from:', modelPath || defaultModelPath);

                // Load the Live2D model
                const model = await Live2DModel.from(modelPath || defaultModelPath, {
                    autoInteract: false,
                    autoUpdate: true,
                });

                if (!mounted) {
                    model.destroy();
                    return;
                }

                modelRef.current = model;

                // Log model dimensions
                console.log('[HiyoriLive2D] Model dimensions:', model.width, 'x', model.height);

                // Simple positioning - just scale to fit and center
                const scaleX = width / model.width;
                const scaleY = height / model.height;
                const scale = Math.min(scaleX, scaleY) * 0.8;

                model.scale.set(scale, scale);
                model.x = (width - model.width * scale) / 2;
                model.y = (height - model.height * scale) / 2;

                console.log('[HiyoriLive2D] Positioned at:', model.x, model.y, 'scale:', scale);

                // Add to stage
                app.stage.addChild(model);

                // Ensure it's visible
                model.visible = true;
                model.alpha = 1;

                // Start motion
                if (autoPlay) {
                    const motionIndex = Math.floor(Math.random() * 10) + 1;
                    const motionName = motionIndex < 10 ? `Hiyori_m0${motionIndex}` : `Hiyori_m${motionIndex}`;
                    try {
                        model.motion(motionName);
                        setCurrentMotion(`Motion ${motionIndex}`);
                    } catch (e) {
                        console.warn('Motion error:', e);
                    }
                }

                setIsLoaded(true);
                onReady(model);

                console.log('[HiyoriLive2D] ✅ Model loaded and visible!');
            } catch (err) {
                console.error('[HiyoriLive2D] Failed to load:', err);
                setError(err.message);
                onError(err);
            }
        };

        initLive2D();

        return () => {
            mounted = false;
            if (modelRef.current) {
                modelRef.current.destroy();
                modelRef.current = null;
            }
            if (appRef.current) {
                appRef.current.destroy(true);
                appRef.current = null;
            }
        };
    }, [width, height, modelPath, autoPlay, onReady, onError]);

    // Play random motion
    const playRandomMotion = useCallback(() => {
        if (!modelRef.current) return;

        const model = modelRef.current;
        const motionIndex = Math.floor(Math.random() * 10) + 1;
        const motionName = motionIndex < 10 ? `Hiyori_m0${motionIndex}` : `Hiyori_m${motionIndex}`;

        try {
            model.motion(motionName);
            setCurrentMotion(`Motion ${motionIndex}`);
        } catch (e) {
            console.warn('Motion error:', e);
        }
    }, []);

    // Mouse tracking
    useEffect(() => {
        if (!enableMouseTracking || !modelRef.current || !isLoaded) return;

        const handleMouseMove = (e) => {
            if (!modelRef.current || !canvasRef.current) return;

            const model = modelRef.current;
            const rect = canvasRef.current.getBoundingClientRect();

            model.focus(
                e.clientX - rect.left,
                e.clientY - rect.top
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [enableMouseTracking, isLoaded]);

    const handleClick = useCallback(() => {
        playRandomMotion();
    }, [playRandomMotion]);

    if (error) {
        return (
            <div className="hiyori-live2d-wrapper error">
                <div className="live2d-error-content">
                    <span className="error-icon">⚠️</span>
                    <p>Failed to load Live2D model</p>
                    <small>{error}</small>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`hiyori-live2d-wrapper ${isLoaded ? 'loaded' : 'loading'}`}
            style={{ width, height }}
        >
            {!isLoaded && (
                <div className="live2d-loader">
                    <div className="loader-ring"></div>
                    <span>Loading Hiyori...</span>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="hiyori-live2d-canvas"
                onClick={handleClick}
                width={width}
                height={height}
                style={{ width, height }}
            />

            <div className="holo-overlay">
                <div className="holo-scanlines"></div>
                <div className="holo-glow"></div>
            </div>

            {isLoaded && currentMotion && (
                <div className="motion-indicator">
                    {currentMotion}
                </div>
            )}

            {isLoaded && (
                <div className="click-hint">Click for random motion ✨</div>
            )}
        </div>
    );
}
