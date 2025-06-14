'use client';
import React from 'react';

interface folderData {
    name: string,
    id?: number,
}

interface FolderSettingsProps {
    onAddItem: () => void;
    onEditFolder: () => void;
    onDeleteFolder: () => void;
}

const FolderSettings: React.FC<FolderSettingsProps> = ({ onAddItem, onEditFolder, onDeleteFolder }) => {
    return (
        <div className="dropdown is-hoverable is-right">
            <div className="dropdown-trigger">
              <a className="button is-white"  aria-haspopup="true" aria-controls="dropdown-menu" style={{backgroundColor: "transparent"}}>
                <span className="icon has-text-grey is-size-4">
                    <i className="fas fa-ellipsis"></i>
                </span>
              </a>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a href="#" className="dropdown-item is-size-5" onClick={onAddItem}>
                  <span className="icon mr-4">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>
                    Uusi tavara
                  </span>
                </a>
                <a href="#" className="dropdown-item is-size-5" onClick={onEditFolder}>
                    <span className="icon mr-4">
                        <i className="fas fa-pencil"></i>
                    </span>
                    <span>
                        Muokkaa
                    </span>
                </a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item is-size-5 has-text-danger" onClick={onDeleteFolder}>
                  <span className="icon mr-4">
                    <i className="fas fa-trash-can"></i>
                  </span>
                  <span>
                    Poista kansio
                  </span>
                </a>              
              </div>
            </div>
        </div>
    )
}

export default FolderSettings; 