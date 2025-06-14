'use client';
import React from 'react';

interface folderData {
    name: string,
    id?: number
}
interface EditFolderProps {
    isActive: boolean;
    onClose: () => void;
    onSave: (item: folderData) => void;
    folderData: folderData | null;
}
  
const EditFolder: React.FC<EditFolderProps> = ({ isActive, onClose, onSave, folderData }) => {
    const [inputValue, setInputValue] = React.useState<string>('');
    
    React.useEffect(() => {
        if (isActive && folderData) {
            setInputValue(folderData.name);
        }
    }, [isActive, folderData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSave = () => {
        if(inputValue.length == 0 || !folderData) return onClose();
        onSave({ name: inputValue, id: folderData.id });
    };

    if (!folderData) return null;

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Muokkaa kansiota</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Nimi</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                placeholder="Nimeä kansio" 
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

export default EditFolder; 