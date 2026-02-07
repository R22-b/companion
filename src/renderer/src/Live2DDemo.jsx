/**
 * Live2D Demo Page
 * Shows the actual Live2D Hiyori model in action
 */

import { useState, useCallback } from 'react';
import HiyoriLive2D from './components/Avatar/HiyoriLive2D';
import './Live2DDemo.css';

export default function Live2DDemo() {
    const [modelReady, setModelReady] = useState(false);
    const [error, setError] = useState(null);

    const handleReady = useCallback((model) => {
        setModelReady(true);
        console.log('Live2D model loaded!', model);
    }, []);

    const handleError = useCallback((err) => {
        setError(err.message);
    }, []);

    return (
        <div className="live2d-demo-page">
            <header className="demo-header">
                <h1>✨ Live2D Model Demo ✨</h1>
                <p>Official Live2D Hiyori model with full animation support</p>
            </header>

            <main className="demo-main">
                <div className="model-container">
                    <HiyoriLive2D
                        width={400}
                        height={550}
                        onReady={handleReady}
                        onError={handleError}
                        enableMouseTracking={true}
                        autoPlay={true}
                    />
                </div>

                <aside className="demo-info">
                    <section className="info-card">
                        <h3>🎭 Features</h3>
                        <ul>
                            <li>✅ Mouse tracking (eyes follow cursor)</li>
                            <li>✅ Physics simulation (hair sway)</li>
                            <li>✅ 10 different motions</li>
                            <li>✅ Real .moc3 model file</li>
                            <li>✅ Smooth 60fps animation</li>
                        </ul>
                    </section>

                    <section className="info-card">
                        <h3>🖱️ Interactions</h3>
                        <ul>
                            <li>Move mouse to track eyes</li>
                            <li>Click model for random motion</li>
                            <li>Watch physics in action!</li>
                        </ul>
                    </section>

                    <section className="info-card status">
                        <h3>📊 Status</h3>
                        <div className={`status-badge ${modelReady ? 'ready' : error ? 'error' : 'loading'}`}>
                            {modelReady ? '✅ Model Ready' : error ? `❌ Error: ${error}` : '⏳ Loading...'}
                        </div>
                    </section>

                    <section className="info-card">
                        <h3>📂 Model Files</h3>
                        <code className="file-list">
                            <div>📄 Hiyori.moc3</div>
                            <div>📄 Hiyori.model3.json</div>
                            <div>📄 Hiyori.physics3.json</div>
                            <div>🖼️ texture_00.png</div>
                            <div>🖼️ texture_01.png</div>
                            <div>📁 motions/ (10 files)</div>
                        </code>
                    </section>

                    <section className="info-card note">
                        <h3>💡 For Your Luna Model</h3>
                        <p>
                            This proves Live2D works in your app!
                            To get a Luna model that looks like your character, you would need:
                        </p>
                        <ol>
                            <li>An artist to create the layered PSD</li>
                            <li>Rigging in Live2D Cubism Editor</li>
                            <li>Export the .moc3 files</li>
                        </ol>
                        <p className="price-estimate">
                            💰 Estimated cost: $50-200 on Fiverr/Upwork
                        </p>
                    </section>
                </aside>
            </main>

            <footer className="demo-footer">
                <p>Model: Hiyori Momose © Live2D Inc. | Used under Free Material License</p>
            </footer>
        </div>
    );
}
