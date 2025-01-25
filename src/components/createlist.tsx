'use client';
import React from 'react';
interface CreateListProps {
    isActive: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
}

const getDateToday = () => {
    const date = new Date();
    return date.getDate()+"."+(date.getMonth()+1)+"."+(date.getFullYear())
}
  
const CreateList: React.FC<CreateListProps> = ({ isActive, onClose, onSave }) => {
    const [inputValue, setInputValue] = React.useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
    const getDefaultValue = () => `Matka ${getDateToday()}`;

    React.useEffect(() => {
        if (isActive) {
          setInputValue(getDefaultValue()); // Reset input value when modal is activated
        }
    }, [isActive]);

    const handleSave = () => {
        if(inputValue.length == 0) return onClose()
        onSave(inputValue); // Pass the input value to the parent
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Uusi lista</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                    <label className="label">Nimi</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            placeholder="Vierumäki" 
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
export default CreateList