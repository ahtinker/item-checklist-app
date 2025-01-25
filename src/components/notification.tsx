'use client';
import React from 'react';
interface CreateNotificationProps {
    content: string;
    color: string;
    isActive: boolean;
    onClose: () => void;
}

const Notification: React.FC<CreateNotificationProps> = ({ content, color, isActive, onClose }) => {
    return (
        <div className={`notification ${color} ${isActive ? '' : 'is-hidden'}`}>
        <button className="delete" onClick={onClose}></button>
            {content}
        </div>
    )
}
export default Notification