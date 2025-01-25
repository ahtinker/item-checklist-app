'use client';
import React from 'react';
import ListStorage from '@/storage/lists';
import ItemStorage from '@/storage/items';
import EditItem from '@/components/edititem';
interface ItemSettingsProps {
    listId: Number;
    itemId: Number;
    onUpdate: () => void;
}
  
const ItemSettings:React.FC<ItemSettingsProps> = ({ listId, itemId, onUpdate }) => {
 const [isEditActive, setIsEditActive] = React.useState(false);
    let item = ItemStorage.getItems(itemId);

    const openItemSettings = () => {
        setIsEditActive(true)
    }
    const closeItemSettings = () => {
        setIsEditActive(false)
    }
    const removeFromList = () => {
        ListStorage.unassignItemFromList(listId, itemId)
        onUpdate()
    }
    const handleSave = (data: any) => {
      const saved = ItemStorage.editItem(Number(itemId), data.name, data.emoji)
      if(saved) {
        onUpdate()
      }
      closeItemSettings()
    }
    return (
        <div className="dropdown is-hoverable is-right">
            
            <div className="dropdown-trigger">
              <a className="button is-white" style={{backgroundColor: "transparent"}}  aria-haspopup="true" aria-controls="dropdown-menu">
                <span className="icon has-text-grey is-size-4">
                    <i className="fas fa-ellipsis"></i>
                </span>
              </a>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a href="#" className="dropdown-item is-size-5" onClick={openItemSettings}>
                  <span className="icon mr-4">
                    <i className="fas fa-pencil"></i>
                  </span>
                  <span>
                    Muokkaa
                  </span>
                </a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item is-size-5 has-text-danger" onClick={removeFromList}>
                  <span className="icon mr-4">
                    <i className="fas fa-minus"></i>
                  </span>
                  <span>
                    Poista listalta
                  </span>
                </a>              
              </div>
            </div>
            <EditItem itemId={itemId} isActive={isEditActive} onClose={closeItemSettings} onSave={handleSave}/>
        </div>
    )
}
export default ItemSettings