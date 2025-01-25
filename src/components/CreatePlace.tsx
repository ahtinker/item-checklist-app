'use client';
import React from 'react';
interface placeData {
    name: string,
    id?: number
}
interface CreatePlaceProps {
    isActive: boolean;
    onClose: () => void;
    onSave: (item: placeData) => void;
}
  
const CreatePlace: React.FC<CreatePlaceProps> = ({ isActive, onClose, onSave }) => {
    const [inputValue, setInputValue] = React.useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const getDefaultValue = () => "";

    React.useEffect(() => {
        if (isActive) {
            setInputValue(getDefaultValue()); // Reset input value when modal is activated
        }
    }, [isActive]);

    const handleSave = () => {
        if(inputValue.length == 0) return onClose();
        onSave({ name: inputValue }); // Pass both input and emoji values to the parent
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Uusi paikka</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
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

export default CreatePlace