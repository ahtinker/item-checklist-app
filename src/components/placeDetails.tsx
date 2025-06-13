'use client';
import React, { useState } from 'react';
import PlaceStorage from '@/storage/places'
import ItemStorage from '@/storage/items'
import SelectPlace from '@/app/items/SelectPlace'

interface PlaceDetailsProps {
    isActive: boolean;
    id: Number;
    onClose: () => void;
}
  
const PlaceDetails: React.FC<PlaceDetailsProps> = ({ isActive, id, onClose }) => {
    const place = PlaceStorage.getPlaces(id);
    const [activeItemId, setActiveItemId] = useState<Number>();
    const [isSelectPlaceActive, setIsSelectPlaceActive] = useState(false);
    const [items, setItems] = useState([]);

    React.useEffect(() => {
        setItems(ItemStorage.getItems().filter((item: any) => item.placeId == id))
    }, [id]);

    const openSelectPlaceModal = () => {
        setIsSelectPlaceActive(true);
    };
    const closeSelectPlaceModal = () => {
        setIsSelectPlaceActive(false);
    };
    const changeLocation = (itemId:Number) => {
        setActiveItemId(itemId)
        openSelectPlaceModal()
        onUpdate()
    } 
    const onUpdate = () => {
        setItems(ItemStorage.getItems().filter((item: any) => item.placeId == id))
    }

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card" style={{padding: "0px"}}>
                <header className="modal-card-head">
                    <span className="icon mr-2 is-size-3">
                        <i className="fas fa-location-dot"></i>
                    </span>
                    <p className="modal-card-title">{place ? place.name : '...'}</p>

                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body" style={{padding: "0px", paddingTop: "15px"}}>
                    {items.length > 0 ? 
                        items.map((item: any, index: number) => (
                            <div key={index} className="pb-1">
                                <div className={`columns is-mobile is-vcentered pr-5 m-0 ${item.available ? "" : "has-background-light"}`} style={{width: "100%"}}>
                                <div className="column is-2">
                                    <span className="is-size-3 pl-5 ml-3">
                                    {(item.emoji || item.name[0]).substring(0,2)}
                                    </span>
                                </div> 
                                <div className="column pl-5 ml-2">
                                    <div>
                                    <strong>{item.name}</strong>
                                    <br/>
                                    {item.available ? "" :
                                        <div className="has-text-danger">Kadonnut</div>
                                    }
                                        <a href="#" className="button is-small is-rounded" onClick={() => changeLocation(Number(item.id))}>
                                            <span className="icon">
                                                <i className="fas fa-refresh"></i>
                                            </span>
                                            <span>
                                                Vaihda paikkaa
                                            </span>
                                        </a>
                                    

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
            <SelectPlace isActive={isSelectPlaceActive} itemId={activeItemId as number} onClose={closeSelectPlaceModal} onSave={onUpdate}/>
        </div>
    );
};

export default PlaceDetails