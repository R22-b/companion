import { useState, useEffect } from 'react'

/**
 * Mood States: idle, work, talk, happy, shy, sad, annoyed, sleepy
 */

export const useMoodStore = () => {
    const [mood, setMood] = useState('idle')
    const [energyLevel, setEnergyLevel] = useState('alert') // alert, quiet, warm, slow

    const updateMood = (newMood) => {
        setMood(newMood)
    }

    const updateEnergy = (newEnergy) => {
        setEnergyLevel(newEnergy)
    }

    return { mood, energyLevel, updateMood, updateEnergy }
}
