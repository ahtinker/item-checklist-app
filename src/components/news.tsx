'use client';
import React from 'react';
import PlaceStorage from '@/storage/places'
import ItemStorage from '@/storage/items'

interface NewsProps {
    isActive: boolean;
    onClose: () => void;
}
  
const News: React.FC<NewsProps> = ({ isActive, onClose }) => {

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card" style={{padding: "0px"}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Pakkauslistasovellusta on päivitetty</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="is-size-5 mb-4">Uutta tässä versiossa</div>
                    <ul style={{listStyleType: "disc", paddingLeft: "20px"}}>
                        <li>Tavarat voi nyt järjestellä kansioihin</li>
                        <li>Bugikorjauksia ja pieniä parannuksia</li>
                    </ul>
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button className="button" onClick={onClose}>Sulje</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default News