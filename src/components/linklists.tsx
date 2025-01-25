'use client';
import React from 'react';
import ItemStorage from '@/storage/items';
import ListStorage from "@/storage/lists";
import Link from 'next/link';

interface LinkListsProps {
    isActive: boolean;
    id: number;
    onClose: () => void;
    onSave: () => void;
}

const LinkLists: React.FC<LinkListsProps> = ({ isActive, id, onSave, onClose }) => {
    let selected: Number[] = [];
    const handleListClick = (id: number) => {
        if(selected.includes(id)) {
            selected = selected.filter(n => n != id);
        } else {
            selected.push(id)
        }
    }
    const handleSave = () => {
        console.log(selected)
        selected.forEach(select => {
            ListStorage.listsLink([id,select])
        })
        onSave()
    };
    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Valitse yhdistettävät listat</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <div className="py-2 mt-5">
                            <Link className="py-2" href="/">
                                Voit luoda uusia listoja Listat -osiosta
                            </Link>
                        </div>
                        <hr/>
                            {ListStorage.getLists().filter((i:any) => i.id != id).map((list: any, index: number) => (
                            !ListStorage.getLinkedLists(id).filter((i:any) => i[1] == list.id)[0] ?
                              <label key={index} onChange={() => handleListClick(Number(list.id))}>
                                <div className='columns is-mobile is-vcentered mt-1' style={{width: "100%"}}>
                                    <div className="column is-1 pl-5">
                                        <input type="checkbox" id={`__itemcheckbox_${list.id}`}></input>
                                    </div> 
                                    <div className="column pl-5">
                                        <strong>{list.name}</strong>
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
                    <button className="button is-success" onClick={handleSave}>Tallenna</button>
                    <button className="button" onClick={onClose}>Peruuta</button>
                </div>
                </footer>
            </div>
        </div>
    )
}
export default LinkLists