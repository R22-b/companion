import React, { useState } from 'react'
import './RadialMenu.css'

const RadialMenu = ({ onSelect, visible }) => {
    const options = [
        { id: 'work', label: 'Work' },
        { id: 'talk', label: 'Talk' },
        { id: 'normal', label: 'Normal' },
        { id: 'hide', label: 'Hide' }
    ]

    return (
        <div className={`radial-menu-container ${visible ? 'visible' : ''}`}>
            {options.map((opt, i) => (
                <div
                    key={opt.id}
                    className="menu-item"
                    style={{ '--i': i, '--total': options.length }}
                    onClick={() => onSelect(opt.id)}
                >
                    <span className="item-label">{opt.label}</span>
                </div>
            ))}
            <div className="menu-center"></div>
        </div>
    )
}

export default RadialMenu
