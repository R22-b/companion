import { create } from 'zustand';

/**
 * Mood States: idle, work, talk, happy, shy, sad, annoyed, sleepy
 * Energy Levels: alert, quiet, warm, slow
 * Activity States: neutral, talking, listening, thinking
 */
export const useMoodStore = create((set) => ({
  mood: 'idle',
  energyLevel: 'alert',
  activity: 'neutral',
  setMood: (mood) => set({ mood }),
  updateMood: (mood) => set({ mood }),
  setEnergyLevel: (energyLevel) => set({ energyLevel }),
  updateEnergy: (energyLevel) => set({ energyLevel }),
  setActivity: (activity) => set({ activity }),
}));