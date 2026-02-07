# Luna Live2D Model - Creation Guide

## 📋 Overview
This document outlines the requirements for creating Luna as a Live2D model for the AI Companion desktop application.

---

## 🎨 Character Design Reference

**Luna** is an ethereal, holographic AI companion with:
- **Style**: Anime/chibi aesthetic with neon holographic glow
- **Color Palette**: 
  - Primary: Cyan (#00f5ff)
  - Secondary: Magenta (#ff6bff)
  - Accent: Pink (#ffb3da), Purple (#b388ff)
- **Body**: Semi-transparent holographic appearance
- **Hair**: Long, flowing cyan hair with magenta/pink highlights
- **Eyes**: Large, expressive cyan eyes with glow
- **Outfit**: Simple flowing dress with sparkle effects
- **Aura**: Surrounded by particles and star sparkles

---

## 🔪 Step 1: Layering Requirements (PSD Structure)

### Required Layers (Top to Bottom):

```
📁 Luna.psd
├── 📁 Hair_Front
│   ├── Bangs_Left
│   ├── Bangs_Center
│   ├── Bangs_Right
│   └── Side_Hair_Front
│
├── 📁 Face
│   ├── 📁 Eyes_Left
│   │   ├── Eyebrow_Left
│   │   ├── Eyelash_Upper_Left
│   │   ├── Eyelash_Lower_Left
│   │   ├── Eye_White_Left
│   │   ├── Iris_Left
│   │   └── Pupil_Left
│   │
│   ├── 📁 Eyes_Right
│   │   ├── Eyebrow_Right
│   │   ├── Eyelash_Upper_Right
│   │   ├── Eyelash_Lower_Right
│   │   ├── Eye_White_Right
│   │   ├── Iris_Right
│   │   └── Pupil_Right
│   │
│   ├── 📁 Mouth
│   │   ├── Upper_Lip
│   │   ├── Lower_Lip
│   │   ├── Mouth_Inside
│   │   └── Tongue (optional)
│   │
│   ├── Nose
│   ├── Blush_Left (optional expression)
│   ├── Blush_Right (optional expression)
│   └── Face_Base
│
├── 📁 Body
│   ├── Neck
│   ├── 📁 Arms
│   │   ├── Upper_Arm_Left
│   │   ├── Lower_Arm_Left
│   │   ├── Hand_Left
│   │   ├── Upper_Arm_Right
│   │   ├── Lower_Arm_Right
│   │   └── Hand_Right
│   │
│   ├── Torso
│   ├── 📁 Dress
│   │   ├── Dress_Upper
│   │   ├── Dress_Lower_Left
│   │   └── Dress_Lower_Right
│   │
│   └── 📁 Legs
│       ├── Upper_Leg_Left
│       ├── Lower_Leg_Left
│       ├── Foot_Left
│       ├── Upper_Leg_Right
│       ├── Lower_Leg_Right
│       └── Foot_Right
│
├── 📁 Hair_Back
│   ├── Hair_Back_Left
│   ├── Hair_Back_Center
│   └── Hair_Back_Right
│
└── 📁 Effects
    ├── Aura_Glow
    └── Sparkles (optional)
```

### ⚠️ Important Notes:

1. **Paint Behind**: When cutting out parts (arms, hair), paint the area behind them so there's no "hole" when they move.

2. **Overlap**: Layers should slightly overlap at joints (elbow, shoulder, neck).

3. **Resolution**: Export at 2048x2048 or higher for quality.

4. **Transparent Background**: The PSD must have a transparent background.

---

## 📐 Step 2: Meshing Guidelines

### Auto Mesh Settings:

| Part | Mesh Quality | Notes |
|------|-------------|-------|
| Face Base | Standard | Basic deformation |
| Eyes (all parts) | Heavy | Smooth blinking |
| Eyebrows | Heavy | Expression control |
| Mouth (all parts) | Heavy | Lip sync |
| Hair (all parts) | Heavy | Physics sway |
| Body/Torso | Standard | Basic movement |
| Arms/Hands | Standard | Wave gestures |
| Dress | Heavy | Flowing physics |

---

## 🎛️ Step 3: Rigging Parameters

### Required Parameters:

| Parameter | Key Points | Purpose |
|-----------|------------|---------|
| `ParamAngleX` | -30, 0, 30 | Head turn left/right |
| `ParamAngleY` | -30, 0, 30 | Head tilt up/down |
| `ParamAngleZ` | -30, 0, 30 | Head rotation |
| `ParamEyeLOpen` | 0, 1 | Left eye open/close |
| `ParamEyeROpen` | 0, 1 | Right eye open/close |
| `ParamEyeBallX` | -1, 0, 1 | Eye look left/right |
| `ParamEyeBallY` | -1, 0, 1 | Eye look up/down |
| `ParamBrowLY` | -1, 0, 1 | Left eyebrow position |
| `ParamBrowRY` | -1, 0, 1 | Right eyebrow position |
| `ParamMouthOpenY` | 0, 1 | Mouth open/close |
| `ParamMouthForm` | -1, 0, 1 | Smile/neutral/frown |
| `ParamBodyAngleX` | -10, 0, 10 | Body sway |
| `ParamBodyAngleY` | -10, 0, 10 | Body lean |
| `ParamBodyAngleZ` | -10, 0, 10 | Body tilt |
| `ParamBreath` | 0, 1 | Breathing animation |
| `ParamHairFront` | -1, 0, 1 | Bangs sway |
| `ParamHairSide` | -1, 0, 1 | Side hair sway |
| `ParamHairBack` | -1, 0, 1 | Back hair sway |
| `ParamArmLA` | 0, 1 | Left arm wave |
| `ParamArmRA` | 0, 1 | Right arm wave |

---

## 🎬 Step 4: Motion Files Required

### Required Motions:

| Motion Name | Description | Loop |
|-------------|-------------|------|
| `Idle.motion3.json` | Default standing animation | Yes |
| `Talk.motion3.json` | Speaking with mouth movement | Yes |
| `Happy.motion3.json` | Cheerful bouncing | Yes |
| `Sad.motion3.json` | Drooping, slow movement | Yes |
| `Think.motion3.json` | Looking up, hand on chin | Yes |
| `Sleepy.motion3.json` | Slow swaying, half-closed eyes | Yes |
| `Listen.motion3.json` | Attentive, slight lean forward | Yes |
| `Walk.motion3.json` | Walking bounce | Yes |
| `Blink.motion3.json` | Quick eye blink | No |
| `Wave.motion3.json` | Waving hand | No |
| `Nod.motion3.json` | Head nodding | No |

### Expression Files:

| Expression | Triggered When |
|------------|----------------|
| `normal.exp3.json` | Default state |
| `happy.exp3.json` | User compliments, good mood |
| `sad.exp3.json` | User seems upset |
| `angry.exp3.json` | User is frustrated |
| `surprised.exp3.json` | Unexpected input |
| `thinking.exp3.json` | Processing complex query |
| `sleepy.exp3.json` | Late night usage |

---

## 📦 Step 5: Export Checklist

### Final Export Files:

```
📁 live2d/
├── Luna.moc3              # Compiled model
├── Luna.model3.json       # Model configuration
├── Luna.png               # Texture atlas
├── Luna.physics3.json     # Physics settings (hair, dress)
├── Luna.cdi3.json         # Display info (optional)
│
├── 📁 motions/
│   ├── Idle.motion3.json
│   ├── Talk.motion3.json
│   ├── Happy.motion3.json
│   ├── Sad.motion3.json
│   ├── Think.motion3.json
│   ├── Sleepy.motion3.json
│   ├── Listen.motion3.json
│   ├── Walk.motion3.json
│   ├── Blink.motion3.json
│   ├── Wave.motion3.json
│   └── Nod.motion3.json
│
└── 📁 expressions/
    ├── normal.exp3.json
    ├── happy.exp3.json
    ├── sad.exp3.json
    ├── angry.exp3.json
    ├── surprised.exp3.json
    ├── thinking.exp3.json
    └── sleepy.exp3.json
```

### model3.json Structure:

```json
{
  "Version": 3,
  "FileReferences": {
    "Moc": "Luna.moc3",
    "Textures": ["Luna.png"],
    "Physics": "Luna.physics3.json",
    "Motions": {
      "Idle": [{ "File": "motions/Idle.motion3.json" }],
      "Talk": [{ "File": "motions/Talk.motion3.json" }],
      "Happy": [{ "File": "motions/Happy.motion3.json" }],
      "Blink": [{ "File": "motions/Blink.motion3.json" }]
    },
    "Expressions": [
      { "Name": "normal", "File": "expressions/normal.exp3.json" },
      { "Name": "happy", "File": "expressions/happy.exp3.json" }
    ]
  }
}
```

---

## 🛠️ Tools Needed

1. **Art Software**: Photoshop, Krita, or GIMP (for layering)
2. **Live2D Cubism Editor**: [Download](https://www.live2d.com/en/download/cubism/)
   - Free version: Limited to 100 deformers
   - Pro version: Unlimited features

---

## 💡 Tips for Best Results

1. **Start Simple**: Begin with just the face and eyes, then add body parts.
2. **Test Often**: Export and test in the app frequently.
3. **Reference Videos**: Watch Live2D tutorials on YouTube (e.g., Brian Tsui, Live2D official).
4. **Physics Last**: Add physics for hair/dress after all rigging is complete.

---

## 📱 Integration

Once you have the exported files, place them in:
```
src/renderer/src/assets/live2d/
```

Then set `LIVE2D_AVAILABLE = true` in `LunaLive2D.jsx`.

---

## 🎓 Learning Resources

- [Live2D Official Tutorials](https://docs.live2d.com/)
- [Brian Tsui YouTube](https://www.youtube.com/c/BrianTsui) - Excellent beginner guides
- [Live2D Community](https://community.live2d.com/)

---

## 💰 Outsourcing Options

If you prefer to hire an artist:

| Platform | Price Range | Notes |
|----------|-------------|-------|
| Fiverr | $50-300 | Variable quality |
| Upwork | $100-500 | Professional artists |
| Skeb | $100-400 | Japanese artists |
| VGen | $150-600 | VTuber specialists |
| Twitter/X | Varies | Commission artists |

Search for: "Live2D model commission", "VTuber model artist"

---

*Document created for Luna AI Companion Project*
*Last updated: February 2026*
