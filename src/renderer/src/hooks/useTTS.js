import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            console.log("TTS: Loaded voices", available.length);
            setVoices(available);

            // Prefer cute/feminine voices for Luna
            const voicePreferences = [
                // Windows voices
                'Microsoft Zira',
                'Microsoft Aria',
                'Microsoft Jenny',
                'Zira',
                // Mac voices
                'Samantha',
                'Karen',
                'Moira',
                // Google voices
                'Google US English Female',
                'Google UK English Female',
            ];

            let preferred = null;
            for (const pref of voicePreferences) {
                preferred = available.find(v =>
                    v.name.toLowerCase().includes(pref.toLowerCase())
                );
                if (preferred) break;
            }

            // Fallback to any female voice
            if (!preferred) {
                preferred = available.find(v =>
                    v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('woman')
                );
            }

            if (preferred) {
                console.log("TTS: Selected voice:", preferred.name);
                setSelectedVoice(preferred);
            } else if (available.length > 0) {
                setSelectedVoice(available[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = useCallback((text) => {
        if (!text) return;

        // Cancel loading speak
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;

        // Pitch/Rate adjustments for a "companion" feel
        utterance.pitch = 1.1;
        utterance.rate = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [selectedVoice]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking };
};
