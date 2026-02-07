/**
 * Avatar Components Index
 * Export all Luna avatar variants from a single location
 */

// Original sprite-based avatar
export { default as LunaAvatar, LunaStates } from './LunaAvatar';

// Enhanced sprite-based avatar with Live2D-like CSS effects
export { default as LunaAvatarEnhanced, LunaStates as EnhancedLunaStates } from './LunaAvatarEnhanced';

// Live2D model renderer (when model is available)
export { default as LunaLive2D } from './LunaLive2D';

/**
 * Usage Guide:
 * 
 * 1. SPRITE MODE (Current):
 *    import { LunaAvatar, LunaStates } from './components/Avatar';
 *    <LunaAvatar state={LunaStates.IDLE} isSpeaking={false} />
 * 
 * 2. ENHANCED SPRITE MODE (Recommended - No extra dependencies):
 *    import { LunaAvatarEnhanced, EnhancedLunaStates } from './components/Avatar';
 *    <LunaAvatarEnhanced 
 *      state={EnhancedLunaStates.IDLE} 
 *      isSpeaking={false}
 *      enableMouseTracking={true}
 *      enableBlinking={true}
 *      enableBreathing={true}
 *    />
 * 
 * 3. LIVE2D MODE (Requires model files):
 *    import { LunaLive2D, LunaStates } from './components/Avatar';
 *    <LunaLive2D 
 *      state="idle" 
 *      isSpeaking={false}
 *      lookAt={{ x: 0, y: 0 }}
 *      onReady={() => console.log('Model loaded!')}
 *    />
 * 
 * Note: LunaLive2D will automatically fall back to sprite mode if
 * the Live2D model files are not available.
 */
