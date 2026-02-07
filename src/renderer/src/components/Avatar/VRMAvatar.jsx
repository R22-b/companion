/**
 * VRMAvatar.jsx
 * 3D VRM Model Renderer using Three.js and React Three Fiber
 * 
 * VRM is a popular open format for 3D VTuber avatars
 * This is easier to integrate than Live2D!
 */

import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './VRMAvatar.css';

// Placeholder VRM model component
// Note: Need to install @pixiv/three-vrm for full VRM support
function VRMModel({ url, onLoaded, lookAt }) {
    const meshRef = useRef();
    const [vrm, setVrm] = useState(null);
    const { camera } = useThree();

    // Simple placeholder - shows a cute anime-style head
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Simple idle animation
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;

            // Look at mouse position if provided
            if (lookAt) {
                meshRef.current.rotation.x = THREE.MathUtils.lerp(
                    meshRef.current.rotation.x,
                    lookAt.y * 0.3,
                    0.1
                );
                meshRef.current.rotation.y = THREE.MathUtils.lerp(
                    meshRef.current.rotation.y,
                    lookAt.x * 0.5,
                    0.1
                );
            }
        }
    });

    // When VRM is fully supported, load the model here
    // For now, show a placeholder sphere
    return (
        <group ref={meshRef}>
            {/* Head */}
            <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#ffd4c4" />
            </mesh>

            {/* Hair (simplified) */}
            <mesh position={[0, 1.7, 0]}>
                <sphereGeometry args={[0.32, 32, 32]} />
                <meshStandardMaterial color="#6b4fff" />
            </mesh>

            {/* Body */}
            <mesh position={[0, 0.8, 0]}>
                <capsuleGeometry args={[0.25, 0.8, 16, 32]} />
                <meshStandardMaterial color="#0099ff" />
            </mesh>

            {/* Eyes */}
            <mesh position={[-0.1, 1.55, 0.25]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0.1, 1.55, 0.25]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}

// Loading fallback
function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#00f5ff" wireframe />
        </mesh>
    );
}

export default function VRMAvatar({
    width = 400,
    height = 600,
    modelUrl = null, // Path to .vrm file
    enableMouseTracking = true,
    onReady = () => { },
}) {
    const containerRef = useRef(null);
    const [lookAt, setLookAt] = useState({ x: 0, y: 0 });
    const [isReady, setIsReady] = useState(false);

    // Mouse tracking
    useEffect(() => {
        if (!enableMouseTracking || !containerRef.current) return;

        const handleMouseMove = (e) => {
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize to -1 to 1
            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = -(e.clientY - centerY) / (rect.height / 2);

            setLookAt({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [enableMouseTracking]);

    // Mark as ready when mounted
    useEffect(() => {
        setIsReady(true);
        onReady();
    }, [onReady]);

    return (
        <div
            ref={containerRef}
            className={`vrm-avatar-container ${isReady ? 'ready' : 'loading'}`}
            style={{ width, height }}
        >
            <Canvas
                camera={{ position: [0, 1.5, 3], fov: 30 }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <pointLight position={[-3, 2, 4]} intensity={0.5} color="#00f5ff" />
                <pointLight position={[3, 2, 4]} intensity={0.5} color="#ff6bff" />

                {/* Model */}
                <Suspense fallback={<LoadingFallback />}>
                    <VRMModel url={modelUrl} lookAt={lookAt} />
                </Suspense>

                {/* Optional camera controls for debugging */}
                {/* <OrbitControls enableZoom={false} /> */}
            </Canvas>

            {/* Holographic overlay */}
            <div className="vrm-holo-overlay">
                <div className="vrm-scanlines"></div>
                <div className="vrm-glow"></div>
            </div>

            {/* Status */}
            <div className="vrm-status">
                {isReady ? '3D Avatar Ready ✨' : 'Loading...'}
            </div>
        </div>
    );
}
