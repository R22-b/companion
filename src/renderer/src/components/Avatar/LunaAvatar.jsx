import { useEffect, useState, useRef } from "react";
import "./LunaAvatar.css";

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

export default function LunaAvatar({
  state = STATES.IDLE,
  isSpeaking = false,
}) {
  const [currentState, setCurrentState] = useState(state);
  const [currentSprite, setCurrentSprite] = useState(lunaIdle);
  const containerRef = useRef(null);

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

  return (
    <div
      ref={containerRef}
      className={`luna-sprite-container ${currentState}`}
    >
      {/* Outer glow aura */}
      <div className="sprite-aura" />
      <div className="sprite-aura-secondary" />

      {/* Floating magical particles */}
      <div className="magic-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`magic-particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Star sparkles */}
      <div className="star-sparkles">
        {[...Array(8)].map((_, i) => (
          <span key={i} className={`star-sparkle sparkle-${i + 1}`}>✦</span>
        ))}
      </div>

      {/* Main Luna sprite */}
      <div className="luna-sprite-wrapper">
        <img
          src={currentSprite}
          alt="Luna"
          className={`luna-sprite ${currentState}`}
        />
      </div>

      {/* Name label */}
      <div className="luna-label">LUNA</div>
    </div>
  );
}

export { STATES as LunaStates };
