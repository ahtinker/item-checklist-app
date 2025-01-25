'use client';
import React from 'react';
import ItemStorage from '@/storage/items';
import ListStorage from "@/storage/lists";
import PlaceStorage from "@/storage/places";
import Link from 'next/link';
import CreatePlace from '@/components/CreatePlace';

interface SelectPlaceProps {
    isActive: boolean;
    itemId: number;
    onClose: () => void;
    onSave: () => void;
}

const LinkLists: React.FC<SelectPlaceProps> = ({ isActive, itemId, onSave, onClose }) => {
    if(itemId < 0) return;
    const [places, setPlaces] = React.useState(ItemStorage.getItems());
    const item = ItemStorage.getItems(itemId);
    
    const handleSave = (placeId: Number) => {
        ItemStorage.setItemPlace(itemId, placeId)
        onSave()
        onClose();
    };

    const [isModalActive, setIsModalActive] = React.useState(false);
      
    const openModal = () => {
        setIsModalActive(true);
    };
    
    const closeModal = () => {
        setIsModalActive(false);
    };
    const onUpdate = () => {
        setPlaces(PlaceStorage.getPlaces());
    }
    const handleCreateSave = (data: any) => {
        const saved = PlaceStorage.addPlace(data)
        if(saved) {
            onUpdate()
        }
        closeModal()
    }
    const placeId = item.placeId;
    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{item.name}</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <div className="py-2 mb-4">
                            <button className="button" onClick={openModal}>
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>Luo uusi paikka</span>
                            </button>
                        </div>
                        <hr/>
                            {PlaceStorage.getPlaces().map((place: any, index: number) => (
                            placeId != place.id ?
                                <label key={index} >
                                    <div className='columns is-mobile is-vcentered mt-1' style={{width: "100%"}}>
                                        <div className="column pl-5 is-size-5">
                                            <strong>{place.name}</strong>
                                        </div>
                                        <div className="column is-3 pl-5 is-size-5">
                                            <button className="button is-link" onClick={() => handleSave(Number(place.id))}>
                                                Aseta
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                </label>
                            : 
                                <label key={index} >
                                    <div className='columns is-mobile is-vcentered mt-1' style={{width: "100%"}}>
                                        <div className="column pl-5 is-size-5">
                                            {place.name}
                                        </div>
                                        <div className="column is-3 px-0 is-size-5 has-text-right">
                                            <button disabled className="button is-light" onClick={() => handleSave(Number(place.id))}>
                                                <span className="icon">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                </label>
                            ))}
                        
                    </div>
                </section>
                <footer className="modal-card-foot">
                <div className="buttons are-medium">
                    <button className="button" onClick={onClose}>Peruuta</button>
                </div>
                </footer>
            </div>
            <CreatePlace isActive={isModalActive} onClose={closeModal} onSave={handleCreateSave}/>
        </div>
    )
}
export default LinkLists