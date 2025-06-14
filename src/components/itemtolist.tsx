'use client';
import React from 'react';
import ItemStorage from '@/storage/items';
import ListStorage from "@/storage/lists";
import PlaceStorage from "@/storage/places";
import Link from 'next/link';
import CreateItem from './createitem';
import FolderStorage from '@/storage/folders';

interface ItemToListProps {
    isActive: boolean;
    id: Number;
    onClose: () => void;
    onSave: () => void;
}
interface itemData {
    name: string,
    emoji: string
    id?: number,
    available?: boolean,
    placeId?: number,
    folderId?: number,
}
interface folderData {
    name: string,
    id?: number,
}

const ItemToList: React.FC<ItemToListProps> = ({ isActive, id, onSave, onClose }) => {
    const [selected, setSelected] = React.useState<Number[]>([]);
    const [items, setItems] = React.useState<itemData[]>(ItemStorage.getItems());
    const [folders, setFolders] = React.useState<folderData[]>(FolderStorage.getFolders());
    const [expandedFolders, setExpandedFolders] = React.useState<number[]>([]);
    const [searchValue, setSearchValue] = React.useState<string>('');
    
    const toggleFolder = (folderId: number) => {
        if (expandedFolders.includes(folderId)) {
            setExpandedFolders(expandedFolders.filter(id => id !== folderId));
        } else {
            setExpandedFolders([...expandedFolders, folderId]);
        }
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleItemClick = (id: number) => {
        if(selected.includes(id)) {
            setSelected(selected.filter(n => n != id));
        } else {
            selected.push(id)
            setSelected(selected)
        }
    }
    const [checkedLinks, setCheckedLinks] = React.useState(true);
    
    const [isModalActive, setIsModalActive] = React.useState(false);
    
    const openModal = () => {
        setIsModalActive(true);
    };
    
    const closeModal = () => {
        setIsModalActive(false);
    };

    const handleSave = () => {
        console.log(selected)
        ListStorage.assignItemsToList(selected, id, checkedLinks)
        onSave()
        setSelected([])
    };
    const handleNewItemSave = (data: itemData) => {
        const saved = ItemStorage.addItem({ name: data.name, emoji: data.emoji, placeId: data.placeId, folderId: data.folderId })
        if(saved) {
            setItems(ItemStorage.getItems())
        }
        closeModal()
    }
    
    let currentList = ListStorage.getLists().filter((list: any) => list.id == id)[0]
    if(!currentList) return null;

    const availableItems = React.useMemo(() => {
        return items
            .filter(item => !currentList.items?.some((i: any) => i.id === item.id))
            .filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [items, currentList.items, searchValue]);

    const renderItemContent = (item: itemData) => (
        <>
            <div className='columns is-mobile is-vcentered mt-1' style={{width: "100%"}}>
                <div className="column is-1 pl-5">
                            <input type="checkbox" onChange={() => handleItemClick(Number(item.id))} id={`__itemcheckbox_${item.id}`}></input>
                </div> 
                <div className="column is-2">
                    <span className="is-size-3 pl-3">
                    {(item.emoji || item.name[0]).substring(0,2)}
                    </span>
                </div> 
                <div className="column">
                    <div>
                    <strong>{item.name}</strong>
                    <br/>
                    {item.available ? "" :
                        <div className="has-text-danger">Kadonnut</div>
                    }
                    <span className="icon-text">
                        <span className="icon">
                        <i className="fas fa-location-dot"></i>
                        </span>
                        <span>
                            {PlaceStorage.getPlaces(item.placeId)?.name || "Ei paikkaa"}
                        </span>
                    </span>
                    </div>
                </div>
            </div>
            <hr/>
        </>
    );

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Valitse lisättävät tavarat</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        {
                            ListStorage.getLinkedLists(Number(id))[0] ? 
                            <label>
                                <input type="checkbox" checked={checkedLinks} onChange={() => {setCheckedLinks(!checkedLinks)}}></input>
                                <span className="pl-3 has-text-weight-bold">Lisää myös yhdistettyihin listoihin ({ListStorage.getLinkedLists(Number(id)).length})</span>
                            </label> : ""
                        }
                        <label className="label mt-5">Etsi tavaraa</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" placeholder="Hakusana" onInput={handleSearchChange}/>
                            <span className="icon is-small is-left">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                        </div>
                        <br/>
                        <div className="py-2">
                            <button className="button" onClick={openModal}>
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>    
                                <span>
                                    Luo uusi tavara
                                </span>
                            </button>
                        </div>

                        
                        <hr/>
                            {folders.map((folder) => (
                                <div key={folder.id}>
                                    <a onClick={() => toggleFolder(folder.id!)}>
                                        <div className='columns is-mobile is-vcentered py-4' style={{width: "100%"}}>
                                            <div className="column">
                                                <span className="icon">
                                                    <i className={`fas ${expandedFolders.includes(folder.id!) ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                                                </span>
                                                <strong className='ml-2'>{folder.name}</strong>
                                            </div>
                                        </div>
                                    </a>
                                    {expandedFolders.includes(folder.id!) && (
                                        <div>
                                            {availableItems.filter(item => item.folderId === folder.id).map((item) => (
                                                <label key={item.id}>
                                                    {renderItemContent(item)}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                     <hr/>
                                </div>
                            ))}
                            <p className="title is-6 mt-5">Kansioimattomat</p>
                            {availableItems.filter(item => !item.folderId || item.folderId === 0).map((item) => (
                                <label key={item.id}>
                                    {renderItemContent(item)}
                                </label>
                            ))}
                    </div>
                </section>
                <footer className="modal-card-foot">
                <div className="buttons are-medium">
                    <button className="button is-success" onClick={handleSave}>Lisää</button>
                    <button className="button" onClick={onClose}>Peruuta</button>
                </div>
                </footer>
            </div>
            <CreateItem isActive={isModalActive} onClose={closeModal} onSave={handleNewItemSave}/>
        </div>
    )
}
export default ItemToList