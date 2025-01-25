'use client'
import Image from "next/image";
import styles from "./page.module.scss";
import NavBar from "../../components/navbar"
import CreateItem from "@/components/createitem";
import { useState } from "react";
import ItemStorage from "@/storage/items"
import PlaceStorage from "@/storage/places"
import Notification from "@/components/notification";
import { useRouter } from 'next/navigation';
import Loading from "@/components/loading";
import ItemSettings from "./itemSettings";
import SelectPlace from "./SelectPlace";
interface itemData {
  name: string,
  emoji: string
  id?: number,
  available?: boolean,
  placeId?: number
}
export default function Page() {
    const [items, setItems] = useState(ItemStorage.getItems());
    const router = useRouter();
    const [isNotificationActive, setIsNotificationActive] = useState(false);
    const [notificationContent, setNotificationContent] = useState('Initial content');
    const [notificationColor, setNotificationColor] = useState('is-danger');
    const [searchValue, setSearchValue] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };
    const showNotification = (content: string, color: string) => {
      setNotificationContent(content);
      setNotificationColor(color);
      setIsNotificationActive(true);
    };
  
    const closeNotification = () => {
      setIsNotificationActive(false);
    };
    const [isModalActive, setIsModalActive] = useState(false);
  
    const openModal = () => {
      setIsModalActive(true);
    };
  
    const closeModal = () => {
      setIsModalActive(false);
    };
    const [isLoadingActive, setIsLoadingActive] = useState(false);
    const openLoading = () => {
      setIsLoadingActive(true);
    };
    const handleSave = (data: itemData) => {
      const saved = ItemStorage.addItem({name: data.name, emoji: data.emoji})
      if(saved) {
        showNotification(`Uusi tavara '${data.name}' lisätty`, "is-success")
        onUpdate()
      } else {
        showNotification(`Tavaraa '${data.name}' ei voitu lisätä, sillä sen niminen tavara on jo olemassa.`, "is-warning")
      }
      closeModal()
    }
    const onUpdate = () => {
      setActiveItemId(-1)
      setItems(ItemStorage.getItems())
    }
    const [isSelectPlaceActive, setIsSelectPlaceActive] = useState(false);
    const [activeItemId, setActiveItemId] = useState<Number>();
  
    const openSelectPlaceModal = () => {
      setIsSelectPlaceActive(true);
    };
    const closeSelectPlaceModal = () => {
      setIsSelectPlaceActive(false);
    };
    const changeLocation = (itemId:Number) => {
      setActiveItemId(itemId)
      openSelectPlaceModal()
    } 
  return (
    <div>
      <section className="section is-fullheight-with-navbar">
        <p className="title">Tavarat</p>
        <Notification
          isActive={isNotificationActive}
          onClose={closeNotification}
          color={notificationColor}
          content={notificationContent}
        />    
        <button className="button is-medium is-success is-outlined mb-6" onClick={openModal}>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>
            Uusi tavara  
          </span>
        </button>
        <div className="field">
          <label className="label">Etsi tavaraa</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" placeholder="Hakusana" onInput={handleSearchChange}/>
            <span className="icon is-small is-left">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>
        
      </section>
        <hr/>
        {items.map((item: itemData, index: number) => (
          item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 ?
          <div key={index}>
            <div className={`columns is-mobile is-vcentered pr-5 m-0 ${item.available ? "" : "has-background-light"}`} style={{width: "100%"}}>
              <div className="column is-2">
                <span className="is-size-3 pl-5 ml-3">
                  {item.emoji?.substring(0,2)}
                </span>
              </div> 
              <div className="column pl-5 ml-2">
                <div>
                  <strong>{item.name}</strong>
                  <br/>
                  {item.available ? "" :
                    <div className="has-text-danger">Kadonnut</div>
                  }
                  <div className="dropdown is-hoverable is-center">
                    <div className="dropdown-trigger">
                      <a className="button is-small is-size-6 is-rounded is-shadowless mt-1" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className="icon">
                          <i className="fas fa-location-dot"></i>
                        </span>
                        <span>
                          {PlaceStorage.getPlaces(item.placeId)?.name || "Ei paikkaa"}
                        </span>
                      </a>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <a href="#" className="dropdown-item is-size-5" onClick={() => changeLocation(Number(item.id))}>
                          <span className="icon mr-4">
                            <i className="fas fa-refresh"></i>
                          </span>
                          <span>
                            Vaihda paikkaa
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  

                </div>
              </div>
              <div className="column is-1 pt-5 pr-6 mr-2 ml-4">
                <ItemSettings itemId={Number(item.id)} onUpdate={onUpdate} showNotification={showNotification}/> 
              </div>
            </div>
            <hr/>
          </div>
          : ""
        ))}
      <CreateItem isActive={isModalActive} onClose={closeModal} onSave={handleSave}/>

      <Loading isActive={isLoadingActive}/>
      <SelectPlace isActive={isSelectPlaceActive} itemId={Number(activeItemId)} onClose={closeSelectPlaceModal} onSave={onUpdate}/>

    </div>
  );
}
