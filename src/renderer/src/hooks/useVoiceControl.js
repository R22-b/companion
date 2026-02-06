import { useEffect, useState } from 'react';

export const useVoiceControl = (onCommand) => {
    const [isListening, setIsListening] = useState(false);
    const [lastTranscript, setLastTranscript] = useState('');

    useEffect(() => {
        // Browser compatibility check
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Voice Control: Browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Voice Control: Listening...");
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart for continuous listening (silent restart)
            try {
                recognition.start();
            } catch (e) { /* ignore already started errors */ }
        };

        recognition.onerror = (event) => {
            console.error("Voice Control Error:", event.error);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log("Voice Result:", transcript);
            setLastTranscript(transcript);

            // Simple Keyword Matching
            if (transcript.includes('talk') || transcript.includes('chat')) {
                onCommand('talk');
            } else if (transcript.includes('work') || transcript.includes('focus') || transcript.includes('quiet')) {
                onCommand('work');
            } else if (transcript.includes('normal') || transcript.includes('idle')) {
                onCommand('normal');
            } else if (transcript.includes('hide') || transcript.includes('minimize')) {
                onCommand('hide');
            } else if (transcript.includes('look') || transcript.includes('see') || transcript.includes('vision') || transcript.includes('watch')) {
                onCommand('vision');
            } else if (transcript.startsWith('open ') || transcript.startsWith('launch ')) {
                // Extract app name
                const appName = transcript.replace('open ', '').replace('launch ', '').trim();
                if (appName) onCommand(`open:${appName}`);
            }
        };

        try {
            recognition.start();
        } catch (e) { console.error("Could not start recognition", e); }

        return () => {
            recognition.stop();
        };
    }, [onCommand]);

    return { isListening, lastTranscript };
};
