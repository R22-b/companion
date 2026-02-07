# 🎭 Luna Avatar Implementation Guide

## Overview

This document covers **three approaches** for animating Luna in your Desktop Companion app:

1. **Live2D (2D Animated)** - Traditional VTuber-style animated 2D characters
2. **VRM (3D Models)** - VTuber 3D avatar format using Three.js
3. **Open-LLM-VTuber Integration** - Full-featured open-source VTuber framework

---

## Option 1: Live2D (Current Implementation)

### Status: ⚠️ Model loads but visibility issues being debugged

### Files Created:
- `src/components/Avatar/HiyoriLive2D.jsx` - Live2D renderer component
- `src/components/Avatar/HiyoriLive2D.css` - Styling
- `src/renderer/public/live2d/Hiyori/` - Model files
- `src/renderer/public/live2dcubismcore.min.js` - Cubism 4 runtime

### How It Works:
```jsx
import HiyoriLive2D from './components/Avatar/HiyoriLive2D';

<HiyoriLive2D
  width={400}
  height={550}
  enableMouseTracking={true}
  autoPlay={true}
/>
```

### Required Dependencies:
```bash
npm install pixi.js@7 pixi-live2d-display
```

### Access Demo:
```
http://localhost:5173/?live2d=true
```

---

## Option 2: VRM 3D Models (Recommended for Voxy-like experience)

### What is VRM?
VRM is an open 3D avatar format popular with VTubers. It's easier to find and create than Live2D models.

### Required Packages:
```bash
npm install three @react-three/fiber @react-three/drei @pixiv/three-vrm
```

### Implementation:

```jsx
// VRMAvatar.jsx
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

function VRMModel({ url, onLoaded }) {
  const [vrm, setVrm] = useState(null);
  const gltf = useGLTF(url);

  useEffect(() => {
    if (gltf.scene) {
      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));
      
      loader.load(url, (result) => {
        const vrm = result.userData.vrm;
        VRMUtils.removeUnnecessaryJoints(vrm.scene);
        setVrm(vrm);
        onLoaded?.(vrm);
      });
    }
  }, [url]);

  if (!vrm) return null;
  
  return <primitive object={vrm.scene} />;
}

export default function VRMAvatar({ modelUrl, width = 400, height = 600 }) {
  return (
    <Canvas
      style={{ width, height }}
      camera={{ position: [0, 1.5, 2], fov: 30 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <VRMModel url={modelUrl} />
    </Canvas>
  );
}
```

### Where to Get VRM Models:
- **VRoid Hub**: https://hub.vroid.com/ (Free VRM models)
- **VRoid Studio**: Create your own (Free software)
- **Booth.pm**: Purchase/download VRM models

---

## Option 3: Open-LLM-VTuber Integration

### What It Is:
A complete open-source AI VTuber framework with:
- Live2D animated avatars
- Voice chat (STT + TTS)
- Local LLM support
- Desktop pet mode
- Long-term memory

### GitHub Repository:
```
https://github.com/t41372/Open-LLM-VTuber
```

### Quick Start:
1. Clone the repository:
```bash
git clone --recursive https://github.com/t41372/Open-LLM-VTuber.git
cd Open-LLM-VTuber
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure `conf.yaml` with your LLM backend (Ollama, etc.)

4. Run the server:
```bash
python server.py
```

5. Open in browser or download Electron app from Releases

### Integration with Your App:
You can integrate Open-LLM-VTuber by:
1. Running it as a separate backend service
2. Connecting your Electron app to its WebSocket API
3. Using their Electron client with your custom configuration

---

## Comparison Table

| Feature | Live2D | VRM (3D) | Open-LLM-VTuber |
|---------|--------|----------|-----------------|
| Complexity | High | Medium | Low (pre-built) |
| Model Availability | Limited | Abundant | Included |
| Performance | Light | Medium | Medium |
| Mouse Tracking | ✅ | ✅ | ✅ |
| Voice Sync | Manual | Manual | Built-in |
| Local LLM | Your code | Your code | Built-in |
| Development Time | Days | Hours | Minutes |
| Customization | Full | Full | Config-based |

---

## Recommended Approach

For your Luna Desktop Companion, I recommend a **hybrid approach**:

### Phase 1 (Immediate):
- Use the **Enhanced CSS Avatar** (`LunaAvatarEnhanced.jsx`) that's already working
- It provides breathing, blinking, mouse tracking, and state animations

### Phase 2 (Short-term):
- Integrate **VRM 3D model** for a more dynamic experience
- Easier to find/create models
- Works well with React Three Fiber

### Phase 3 (Advanced):
- Either fix Live2D integration
- Or adopt Open-LLM-VTuber components for full VTuber features

---

## Current Demo Access

| Mode | URL |
|------|-----|
| Main App | http://localhost:5173/ |
| CSS Avatar Demo | http://localhost:5173/?demo=true |
| Live2D Demo | http://localhost:5173/?live2d=true |

---

## Files Structure

```
companion/
├── src/renderer/
│   ├── public/
│   │   ├── live2d/
│   │   │   └── Hiyori/          # Live2D model files
│   │   └── live2dcubismcore.min.js
│   └── src/
│       ├── components/
│       │   └── Avatar/
│       │       ├── LunaAvatar.jsx         # Original sprite avatar
│       │       ├── LunaAvatarEnhanced.jsx # Enhanced CSS avatar ✅
│       │       ├── LunaAvatarEnhanced.css
│       │       ├── LunaLive2D.jsx         # Live2D wrapper
│       │       ├── HiyoriLive2D.jsx       # Hiyori model renderer
│       │       └── index.js               # Avatar exports
│       ├── LunaDemo.jsx         # CSS avatar demo page
│       ├── Live2DDemo.jsx       # Live2D demo page
│       └── main.jsx             # Route handling
```

---

## Next Steps

1. **Test Enhanced CSS Avatar**: Visit `http://localhost:5173/?demo=true`
2. **Try VRM Integration**: I can create a VRMAvatar component
3. **Explore Open-LLM-VTuber**: For full VTuber features

Let me know which path to prioritize! 🚀
