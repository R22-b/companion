import { useRef, useCallback } from 'react';

export const useWebcam = () => {
    const videoRef = useRef(null);

    const captureFrame = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // Create a hidden video element if it doesn't exist
            if (!videoRef.current) {
                videoRef.current = document.createElement('video');
            }

            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            // Create a canvas to draw the frame
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);

            // Convert to base64 JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const base64 = dataUrl.split(',')[1];

            // Stop the stream
            stream.getTracks().forEach(track => track.stop());

            return base64;
        } catch (error) {
            console.error("Webcam Capture Error:", error);
            throw error;
        }
    }, []);

    return { captureFrame };
};
