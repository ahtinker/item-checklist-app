'use client'
import { useState } from "react";
import PlaceStorage from "@/storage/places"
import Notification from "@/components/notification";
import { useRouter } from 'next/navigation';
import Loading from "@/components/loading";
import PlaceSettings from "./PlaceSettings";
import CreatePlace from "@/components/CreatePlace";
import PlaceDetails from "@/components/placeDetails";
interface placeData {
  name: string,
  id?: number,
}
export default function Page() {
    const [places, setPlaces] = useState(PlaceStorage.getPlaces());
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
    const [isPlaceDetailsActive, setIsPlaceDetailsActive] = useState(false);
    const [placeDetailsId, setPlaceDetailsId] = useState(0);
    const openModal = () => {
      setIsModalActive(true);
    };
    const openPlaceDetails = (id: number) => {
      setIsPlaceDetailsActive(true);
      setPlaceDetailsId(id);
    };
    const closePlaceDetails = () => {
      setIsPlaceDetailsActive(false);
    };
    const closeModal = () => {
      setIsModalActive(false);
    };
    const [isLoadingActive, setIsLoadingActive] = useState(false);
    const openLoading = () => {
      setIsLoadingActive(true);
    };
    const handleSave = (data: placeData) => {
      const saved = PlaceStorage.addPlace({name: data.name})
      if(saved) {
        showNotification(`Uusi paikka '${data.name}' lisätty`, "is-success")
        onUpdate()
      } else {
        showNotification(`Paikkaa '${data.name}' ei voitu lisätä, sillä sen niminen paikka on jo olemassa.`, "is-warning")
      }
      closeModal()
    }
    const onUpdate = () => {
      setPlaces(PlaceStorage.getPlaces())
    }
  return (
    <div>
      <section className="section is-fullheight-with-navbar">
        <p className="title">Paikat</p>
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
            Uusi paikka  
          </span>
        </button>
        <div className="field">
          <label className="label">Etsi paikkaa</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" placeholder="Hakusana" onInput={handleSearchChange}/>
            <span className="icon is-small is-left">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>
        
      </section>
      <hr/>
        {places.map((place: placeData, index: number) => (
          place.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 ?
          <div key={index}>
            <div className='columns is-mobile is-vcentered my-0' style={{width: "100%"}}>
              <div className="column is-2">
                <span className="icon is-size-5 pl-5 ml-3">
                  <i className="fas fa-location-dot"></i>
                </span>
              </div> 
              <div className="column pl-4 is-size-5" onClick={() => openPlaceDetails(Number(place.id))}>
                <div>
                  <div>{place.name}</div>
                </div>
              </div>
              <div className="column is-1 pt-5 pr-6 mr-2 ml-4">
                <PlaceSettings placeId={Number(place.id)} onUpdate={onUpdate} showNotification={showNotification}/> 
              </div>
            </div>
            <hr/>
          </div>
          : ""
        ))}
      <CreatePlace isActive={isModalActive} onClose={closeModal} onSave={handleSave}/>
      <PlaceDetails isActive={isPlaceDetailsActive} id={placeDetailsId} onClose={closePlaceDetails}/>
      <Loading isActive={isLoadingActive}/>

    </div>
  );
}
