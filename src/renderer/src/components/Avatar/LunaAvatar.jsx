import React, { useMemo } from 'react';
import './LunaAvatar.css';

// Default prop values if not provided
export const LunaAvatar = ({
    mood = 'neutral',
    isSpeaking = false,
    volume = 0,
    mousePos = { x: 0, y: 0 }
}) => {

    // Scale avatar slightly when speaking
    const scale = isSpeaking ? 1 + (volume * 0.05) : 1;

    // Subtle parallax for head movement (clamped to avoid breaking the neck)
    const headX = Math.max(-10, Math.min(10, mousePos.x * 10));
    const headY = Math.max(-5, Math.min(5, mousePos.y * 5));

    // Eye movement needs to be subtle
    const eyeX = headX * 0.6;
    const eyeY = headY * 0.6;

    // Generate random particles (memoized to prevent re-render flickering)
    const particles = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            id: i,
            left: Math.random() * 80 + 10 + '%',
            delay: Math.random() * 5 + 's',
            size: Math.random() * 3 + 1 + 'px'
        }));
    }, []);

    return (
        <div
            className="relative w-96 h-96 flex items-center justify-center animate-float luna-container"
            style={{ transform: `scale(${scale})` }}
        >
            {/* Ambient Hologram Glow Behind */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-20 animate-pulse mix-blend-screen" />

            {/* Rising Particles */}
            <div className="absolute inset-0 overflow-visible">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            bottom: '20%',
                            animationDelay: p.delay
                        }}
                    />
                ))}
            </div>

            {/* Main SVG Geometry */}
            <svg viewBox="0 0 400 500" className="w-full h-full overflow-visible">
                <defs>
                    {/* The "Hologram" Gradient - Electric Blue to Purple */}
                    <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" /> {/* Cyan */}
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" /> {/* Blue */}
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" /> {/* Purple */}
                    </linearGradient>

                    {/* Inner Glow for that "Light" look */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Strong Outer Bloom */}
                    <filter id="bloom">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 18 -7
                        " result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="over" />
                    </filter>
                </defs>

                {/* --- BACK HAIR (Behind Body) --- */}
                {/* Large flowing locks moving in the "wind" */}
                <g className="animate-hair-flow" transform={`translate(${headX * 0.2}, ${headY * 0.2})`}>
                    <path
                        d="M140,120 C80,120 40,250 20,350 C10,380 60,320 80,280 C60,400 120,450 160,380"
                        fill="url(#holoGradient)" opacity="0.6"
                    />
                    <path
                        d="M260,120 C320,120 380,200 390,300 C395,350 340,320 300,280 C340,400 280,450 240,380"
                        fill="url(#holoGradient)" opacity="0.6"
                    />
                </g>

                {/* --- BODY GROUP --- */}
                <g className="animate-float" style={{ animationDuration: '7s' }}>

                    {/* Floating Legs */}
                    <path
                        d="M170,300 Q170,360 180,420 Q185,440 175,445"
                        fill="none" stroke="url(#holoGradient)" strokeWidth="12" strokeLinecap="round" opacity="0.8"
                    />
                    <path
                        d="M230,300 Q230,350 215,410 Q210,430 220,435"
                        fill="none" stroke="url(#holoGradient)" strokeWidth="12" strokeLinecap="round" opacity="0.8"
                    />

                    {/* Dress/Torso - Semi-transparent ghostly look */}
                    <path
                        d="M200,140 
                           Q140,260 140,320 
                           Q200,340 260,320 
                           Q260,260 200,140 Z"
                        fill="url(#holoGradient)" opacity="0.5" filter="url(#glow)"
                    />

                    {/* Inner Dress Solid Core */}
                    <path
                        d="M200,140 Q160,240 160,280 Q200,290 240,280 Q240,240 200,140"
                        fill="white" opacity="0.2"
                    />

                    {/* Arms (Outstretched slightly) */}
                    <path
                        d="M165,180 Q140,220 120,240"
                        fill="none" stroke="url(#holoGradient)" strokeWidth="10" strokeLinecap="round"
                    />
                    <path
                        d="M235,180 Q260,220 280,240"
                        fill="none" stroke="url(#holoGradient)" strokeWidth="10" strokeLinecap="round"
                    />
                </g>

                {/* --- HEAD GROUP (Moves with Mouse) --- */}
                <g transform={`translate(${headX}, ${headY})`}>

                    {/* Face Shape */}
                    <ellipse cx="200" cy="140" rx="60" ry="55" fill="url(#holoGradient)" />

                    {/* Face Highlight (Chin/Cheek) for 3D feel */}
                    <path d="M160,150 Q200,210 240,150" fill="white" opacity="0.1" />

                    {/* FRONT HAIR (Bangs) - Complex flow */}
                    <g filter="url(#glow)">
                        <path
                            d="M200,90 
                               C150,90 130,120 130,180 
                               Q130,120 160,100 
                               C180,160 220,160 240,100
                               Q270,120 270,180
                               C270,120 250,90 200,90"
                            fill="url(#holoGradient)" opacity="0.95"
                        />
                        {/* Loose strands */}
                        <path d="M200,90 Q220,70 260,80" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                        <path d="M200,90 Q180,70 140,80" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                    </g>

                    {/* --- FACE FEATURES --- */}
                    <g transform={`translate(${eyeX}, ${eyeY})`}>
                        {/* Glowing White Eyes (No pupils = Spirit/Hologram look) */}
                        <ellipse cx="175" cy="150" rx="14" ry="18" fill="white" filter="url(#bloom)" opacity="0.9" />
                        <ellipse cx="225" cy="150" rx="14" ry="18" fill="white" filter="url(#bloom)" opacity="0.9" />

                        {/* Subtle Blink Animation Layer */}
                        <g className="animate-blink">
                            {/* Eyelids (hidden usually, animate down) */}
                        </g>

                        {/* Mouth - Tiny and cute */}
                        {isSpeaking ? (
                            <circle cx="200" cy="175" r="4" fill="white" opacity="0.8" className="animate-talk" />
                        ) : (
                            <path
                                d="M195,175 Q200,178 205,175"
                                fill="none" stroke="white" strokeWidth="2" opacity="0.8" strokeLinecap="round"
                            />
                        )}

                        {/* Blush */}
                        <ellipse cx="165" cy="165" rx="8" ry="4" fill="#f472b6" opacity="0.3" blur="2px" />
                        <ellipse cx="235" cy="165" rx="8" ry="4" fill="#f472b6" opacity="0.3" blur="2px" />
                    </g>
                </g>
            </svg>
        </div>
    );
};
