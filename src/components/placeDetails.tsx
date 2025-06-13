'use client';
import React from 'react';
import PlaceStorage from '@/storage/places'
import ItemStorage from '@/storage/items'

interface PlaceDetailsProps {
    isActive: boolean;
    id: Number;
    onClose: () => void;
}
  
const PlaceDetails: React.FC<PlaceDetailsProps> = ({ isActive, id, onClose }) => {
    const place = PlaceStorage.getPlaces(id);
    const items = ItemStorage.getItems().filter((item: any) => item.placeId == id);

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card" style={{padding: "0px"}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">{place ? place.name : '...'}</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body" style={{padding: "0px", paddingTop: "15px"}}>
                    {items.length > 0 ? 
                        items.map((item: any, index: number) => (
                            <div key={index} className="pb-1">
                            <div className='columns pl-5 is-mobile is-vcentered mb-1' style={{width: "100%"}}>
                                <div className="column is-2">
                                    <span className="is-size-3 pl-3">
                                    {item.emoji.substring(0,2)}
                                    </span>
                                </div> 
                                <div className="column">
                                    <div>
                                    <strong>{item.name}</strong>
                                    {item.available ? "" :
                                    <span className="ml-3 has-text-danger">Kadonnut</span>
                                    }
                                    <br/>
                                    <span className="icon-text">
                                        <span className="icon">
                                        <i className="fas fa-location-dot"></i>
                                        </span>
                                        <span>{PlaceStorage.getPlaces(item.placeId)?.name || "Ei paikkaa"}</span>
                                    </span>
                                    
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        ))
                     : (
                        <div className="has-text-centered">
                            <p className="is-size-5">Ei tavaroita</p>
                        </div>
                    )}
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

export default PlaceDetails