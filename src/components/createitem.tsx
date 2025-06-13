'use client';
import React from 'react';
import PlaceStorage from '@/storage/places'
import ListStorage from '@/storage/lists'

interface itemData {
    name: string,
    emoji: string
    id?: number,
    available?: boolean,
    placeId?: number,
    listId?: Array<number>
}
interface CreateItemProps {
    isActive: boolean;
    onClose: () => void;
    onSave: (item: itemData) => void;
}
  
const CreateItem: React.FC<CreateItemProps> = ({ isActive, onClose, onSave }) => {
    const [inputValue, setInputValue] = React.useState<string>('');
    const [emojiValue, setEmojiValue] = React.useState<string>(''); // New state for emoji input
    const [placeValue, setPlaceValue] = React.useState<number>(0); 
    const [listValue, setListValue] = React.useState<Array<number>>([]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleEmojiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmojiValue(event.target.value.substring(0,2)); // Update emoji value
    };


    const getDefaultValue = () => "";

    React.useEffect(() => {
        if (isActive) {
            setInputValue(getDefaultValue()); // Reset input value when modal is activated
            setEmojiValue(''); // Reset emoji value
        }
    }, [isActive]);

    const handleSave = () => {
        if(inputValue.length == 0) return onClose();
        onSave({ name: inputValue, emoji: emojiValue, placeId: placeValue, listId: listValue }); // Pass both input and emoji values to the parent
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Uusi tavara</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Nimi</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                placeholder="Nimeä tavara" 
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Emoji</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                placeholder="Syötä emoji tähän" 
                                value={emojiValue}
                                onChange={handleEmojiChange}
                            />
                        </div>
                    </div>
                    {PlaceStorage.getPlaces().length != 0 ?
                        <div className="field">
                            <label className="label">Paikka</label>
                            <div className="control">
                                <select
                                    className="select px-3"
                                    onChange={e => setPlaceValue(Number(Array.from(e.target.children)[e.target.selectedIndex].getAttribute("data-placeid")))}
                                >
                                    <option>Ei paikkaa</option>
                                    {PlaceStorage.getPlaces().map((place: any, index: number) => (
                                        <option key={index} data-placeid={place.id}>
                                            {place.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        : ""}
                    {ListStorage.getLists().length != 0 ?
                        <div className="field">
                            <label className="label">Lisää pakkauslistalle</label>
                            <div className="control">
                                <select multiple className="select px-3" onChange={e => setListValue(Array.from(e.target.children).map((child: any) => Number(child.getAttribute("data-listid"))))}>
                                    {ListStorage.getLists().map((list: any, index: number) => (
                                        <option key={index} data-listid={list.id}>
                                            {list.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        : ""}

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

export default CreateItem