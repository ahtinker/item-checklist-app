'use client';
import React from 'react';
import PlaceStorage from '@/storage/places';
import EditPlace from '@/components/EditPlace';
interface PlaceSettings {
    placeId: Number;
    onUpdate: () => void;
    showNotification: (content: string, color: string) => void;
}
  
const PlaceSettings:React.FC<PlaceSettings> = ({ placeId, onUpdate, showNotification }) => {
    const [isEditActive, setIsEditActive] = React.useState(false);
    
    let place = PlaceStorage.getPlaces(placeId);
    const openPlaceSettings = () => {
      setIsEditActive(true)
    }
    const closePlaceSettings = () => {
      setIsEditActive(false)
    }
    const remove = () => {
      let c = PlaceStorage.deletePlace(placeId)
      if(c) {
        showNotification(`Paikka '${place.name}' poistettiin onnistuneesti.`, "is-success")
      }   
      onUpdate()
    }
    const handleSave = (data: any) => {
      const saved = PlaceStorage.editPlace(Number(placeId), data.name)
      if(saved) {
        showNotification(`Paikkaa '${data.name}' muokattu`, "is-success")
        onUpdate()
      } else {
        showNotification(`Nimeä '${data.name}' ei voitu antaa, sillä sen niminen paikka on jo olemassa.`, "is-warning")
      }
      closePlaceSettings()
    }
    return (
        <div className="dropdown is-hoverable is-right">
            <div className="dropdown-trigger">
              <a className="button is-white"  aria-haspopup="true" aria-controls="dropdown-menu">
                <span className="icon has-text-grey is-size-4">
                    <i className="fas fa-ellipsis"></i>
                </span>
              </a>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a href="#" className="dropdown-item is-size-5" onClick={openPlaceSettings}>
                  <span className="icon mr-4">
                    <i className="fas fa-pencil"></i>
                  </span>
                  <span>
                    Muokkaa
                  </span>
                </a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item is-size-5 has-text-danger" onClick={remove}>
                  <span className="icon mr-4">
                    <i className="fas fa-trash-can"></i>
                  </span>
                  <span>
                    Poista paikka
                  </span>
                </a>              
              </div>
            </div>
            <EditPlace id={placeId} isActive={isEditActive} onClose={closePlaceSettings} onSave={handleSave}/>
        </div>
    )
}
export default PlaceSettings