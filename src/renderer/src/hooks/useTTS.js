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

            // Prefer a female/soft voice
            const preferred = available.find(v =>
                v.name.includes('Zira') || // Windows
                v.name.includes('Samantha') || // Mac
                v.name.includes('Google US English') // Chrome
            );

            if (preferred) setSelectedVoice(preferred);
            else setSelectedVoice(available[0]);
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
