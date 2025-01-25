'use client';
import React from 'react';
interface loadingProps {
    isActive: boolean;
}
  
const Loading: React.FC<loadingProps> = ({ isActive }) => {

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background blur" style={{background: "transparent"}}></div>
        </div>
    )
}
export default Loading