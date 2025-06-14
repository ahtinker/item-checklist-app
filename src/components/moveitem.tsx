'use client';
import React from 'react';
import FolderStorage from '@/storage/folders';

interface folderData {
    name: string,
    id?: number,
}

interface MoveItemProps {
    isActive: boolean;
    onClose: () => void;
    onSave: (folderId: number) => void;
    currentFolderId?: number;
}
  
const MoveItem: React.FC<MoveItemProps> = ({ isActive, onClose, onSave, currentFolderId }) => {
    const [targetFolder, setTargetFolder] = React.useState<number>(0);

    React.useEffect(() => {
        if (isActive) {
            setTargetFolder(currentFolderId || 0);
        }
    }, [isActive, currentFolderId]);

    const handleSave = () => {
        onSave(targetFolder);
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Siirrä kansioon</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Valitse kansio</label>
                        <div className="control">
                            <div className="select">
                                <select value={targetFolder} onChange={(e) => setTargetFolder(Number(e.target.value))}>
                                    {FolderStorage.getFolders().map((folder: folderData) => (
                                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                                    ))}
                                    <option value={0}>Kansioimattomat</option>
                                </select>
                            </div>
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

export default MoveItem; 