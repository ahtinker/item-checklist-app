'use client';
import React from 'react';
import ItemStorage from '@/storage/items';
import ListStorage from "@/storage/lists";
import PlaceStorage from "@/storage/places";
import Link from 'next/link';
import CreateItem from './createitem';
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
    placeId?: number
}

const ItemToList: React.FC<ItemToListProps> = ({ isActive, id, onSave, onClose }) => {
    const [selected, setSelected] = React.useState<Number[]>([]);
    const [items, setItems] = React.useState(ItemStorage.getItems());
    const [searchValue, setSearchValue] = React.useState<string>('');
    
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
    };
    const handleNewItemSave = (data: itemData) => {
        const saved = ItemStorage.addItem({name: data.name, emoji: data.emoji})
        if(saved) {
            setItems(ItemStorage.getItems())
        }
        closeModal()
    }
    
    let currentList = ListStorage.getLists().filter((list: any) => list.id == id)[0]
    if(!currentList) return null;
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
                            {items.map((item: itemData, index: number) => (
                            (!currentList.items?.filter((i:any) => i.id == item.id)[0] && item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1) ?
                              <label key={index}>
                                <div className='columns is-mobile is-vcentered mt-1' style={{width: "100%"}}>
                                    <div className="column is-1 pl-5">
                                        <input type="checkbox" onChange={() => handleItemClick(Number(item.id))} id={`__itemcheckbox_${item.id}`}></input>
                                    </div> 
                                    <div className="column is-2">
                                        <span className="is-size-3 pl-3">
                                        {item.emoji?.substring(0,2)}
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
                            </label>
                            : ""
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