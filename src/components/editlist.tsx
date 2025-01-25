'use client';
import React from 'react';
interface EditListProps {
    isActive: boolean;
    name: string;
    onClose: () => void;
    onSave: (value: string) => void;
}
  
const EditList: React.FC<EditListProps> = ({ isActive, name, onClose, onSave }) => {
    const [inputValue, setInputValue] = React.useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    React.useEffect(() => {
        if (isActive) {
          setInputValue(name); // Reset input value when modal is activated
        }
    }, [isActive]);

    const handleSave = () => {
      onSave(inputValue); // Pass the input value to the parent
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Vaihda nimeä</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                    <label className="label">Nimi</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            placeholder="Vaellus" 
                            value={inputValue}
                            onChange={handleInputChange}
                        ></input>
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
    )
}
export default EditList