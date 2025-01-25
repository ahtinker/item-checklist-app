'use client';
import React from 'react';
import ListStorage from '@/storage/lists';
import ItemStorage from '@/storage/items';
import EditItem from '@/components/edititem';
interface ItemSettingsProps {
    itemId: Number;
    onUpdate: () => void;
    showNotification: (content: string, color: string) => void;
}
  
const ItemSettings:React.FC<ItemSettingsProps> = ({ itemId, onUpdate, showNotification }) => {
    const [isEditActive, setIsEditActive] = React.useState(false);
    
    let item = ItemStorage.getItems(itemId);
    const openItemSettings = () => {
      setIsEditActive(true)
    }
    const closeItemSettings = () => {
      setIsEditActive(false)
    }
    const remove = () => {
      let c = ItemStorage.deleteItem(itemId)
      if(c) {
        showNotification(`Tavara '${item.name}' poistettiin onnistuneesti.`, "is-success")
      }   
      onUpdate()
    }
    const markAsLost = () => {
      if(item.available) {
        showNotification(`Tavara '${item.name}' on nyt merkattu kadonneeksi.`, "is-success")
      } else {
        showNotification(`Tavara '${item.name}' on nyt merkattu löydetyksi.`, "is-success")
      }
      ItemStorage.toggleItemAvailable(itemId)
      onUpdate();
    }
    const handleSave = (data: any) => {
      const saved = ItemStorage.editItem(Number(itemId), data.name, data.emoji)
      if(saved) {
        showNotification(`Tavaraa '${data.name}' muokattu`, "is-success")
        onUpdate()
      } else {
        showNotification(`Nimeä '${data.name}' ei voitu antaa, sillä sen niminen tavara on jo olemassa.`, "is-warning")
      }
      closeItemSettings()
    }
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
                <a href="#" className="dropdown-item is-size-5" onClick={openItemSettings}>
                  <span className="icon mr-4">
                    <i className="fas fa-pencil"></i>
                  </span>
                  <span>
                    Muokkaa
                  </span>
                </a>
                <a href="#" className="dropdown-item is-size-5" onClick={markAsLost}>
                  <span className="icon mr-4">
                    <i className={item.available ? `fa-solid fa-circle-question` : `fas fa-check`}></i>
                  </span>
                  <span>
                    {item.available ?
                    "Aseta kadonneeksi"
                    : 
                    "Aseta löydetyksi"
                    }
                  </span>
                </a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item is-size-5 has-text-danger" onClick={remove}>
                  <span className="icon mr-4">
                    <i className="fas fa-trash-can"></i>
                  </span>
                  <span>
                    Poista tavara
                  </span>
                </a>              
              </div>
            </div>
            <EditItem itemId={itemId} isActive={isEditActive} onClose={closeItemSettings} onSave={handleSave}/>
        </div>
    )
}
export default ItemSettings