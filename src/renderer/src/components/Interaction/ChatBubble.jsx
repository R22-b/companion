import React, { useState, useEffect } from 'react'
import './ChatBubble.css'

const ChatBubble = ({ message, visible: parentVisible }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [displayMessage, setDisplayMessage] = useState('')

    useEffect(() => {
        if (parentVisible && message) {
            setDisplayMessage(message)
            setIsVisible(true)

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 5000)

            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [message, parentVisible])

    return (
        <div className={`chat-bubble-container ${isVisible ? 'visible' : ''}`}>
            <div className="bubble-content">
                {displayMessage}
            </div>
            <div className="bubble-tail"></div>
        </div>
    )
}

export default ChatBubble;

