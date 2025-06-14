'use client';
import React from 'react';
import PlaceStorage from '@/storage/places'
interface placeData {
    name: string,
    id?: number
}
interface EditPlaceProps {
    isActive: boolean;
    id: number;
    onClose: () => void;
    onSave: (place: placeData) => void;
}
  
const EditPlace: React.FC<EditPlaceProps> = ({ isActive, id, onClose, onSave }) => {
    const [inputValue, setInputValue] = React.useState<string>('');
    const place = PlaceStorage.getPlaces(id);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const getDefaultValue = () => place.name;

    React.useEffect(() => {
        if (isActive) {
            setInputValue(getDefaultValue()); // Reset input value when modal is activated
        }
    }, [isActive]);

    const handleSave = () => {
        onSave({ name: inputValue }); // Pass both input and emoji values to the parent
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Muokkaa paikkaa</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field mb-5">
                        Paikan nimi päivittyy kaikissa tavaroissa.
                    </div>
                    <div className="field">
                        <label className="label">Nimi</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                placeholder="Nimeä paikka" 
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button className="button is-success" onClick={handleSave}>Tallenna</button>
                        <button className="button" onClick={onClose}>Peruuta</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default EditPlace