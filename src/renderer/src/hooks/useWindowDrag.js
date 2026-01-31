import { useRef } from 'react';

export const useWindowDrag = () => {
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const onMouseDown = (e) => {
        isDragging.current = true;
        offset.current = { x: e.clientX, y: e.clientY };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (isDragging.current) {
            window.api.dragWindow(offset.current.x, offset.current.y);
        }
    };

    const onMouseUp = () => {
        isDragging.current = false;
        window.api.savePosition();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    return { onMouseDown };
};
