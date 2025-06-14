'use client'
import CreateItem from "@/components/createitem";
import { useState } from "react";
import ItemStorage from "@/storage/items"
import PlaceStorage from "@/storage/places"
import Notification from "@/components/notification";
import Loading from "@/components/loading";
import ItemSettings from "./itemSettings";
import SelectPlace from "./SelectPlace";
import ListStorage from "@/storage/lists";
import FolderStorage from "@/storage/folders";
import CreateFolder from "@/components/createfolder";
import EditFolder from "@/components/editfolder";
import FolderSettings from "./folderSettings";

interface itemData {
  name: string,
  emoji: string
  id?: number,
  available?: boolean,
  placeId?: number,
  listId?: Array<number>,
  folderId?: number
}
interface folderData {
    name: string,
    id?: number,
}
export default function Page() {
    const [items, setItems] = useState<itemData[]>(ItemStorage.getItems());
    const [folders, setFolders] = useState<folderData[]>(FolderStorage.getFolders());
    const [isNotificationActive, setIsNotificationActive] = useState(false);
    const [notificationContent, setNotificationContent] = useState('Initial content');
    const [notificationColor, setNotificationColor] = useState('is-danger');
    const [searchValue, setSearchValue] = useState<string>('');
    const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<number>(0);
    const [isEditFolderModalActive, setIsEditFolderModalActive] = useState(false);
    const [activeFolderData, setActiveFolderData] = useState<folderData | null>(null);

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
    const showNotification = (content: string, color: string) => {
      setNotificationContent(content);
      setNotificationColor(color);
      setIsNotificationActive(true);
    };
  
    const closeNotification = () => {
      setIsNotificationActive(false);
    };
    const [isModalActive, setIsModalActive] = useState(false);
    const [isFolderModalActive, setIsFolderModalActive] = useState(false);
  
    const openModal = (folderId?: number) => {
      setActiveFolderId(folderId || 0);
      setIsModalActive(true);
    };
  
    const openRootModal = () => {
        openModal();
    }
  
    const closeModal = () => {
      setIsModalActive(false);
    };
    const openFolderModal = () => {
        setIsFolderModalActive(true);
    };
    const closeFolderModal = () => {
        setIsFolderModalActive(false);
    }
    const openEditFolderModal = (folderData: folderData) => {
        setActiveFolderData(folderData);
        setIsEditFolderModalActive(true);
    }
    const closeEditFolderModal = () => {
        setIsEditFolderModalActive(false);
    }
    const [isLoadingActive, setIsLoadingActive] = useState(false);
    const handleSave = (data: itemData) => {
      const saved = ItemStorage.addItem({ name: data.name, emoji: data.emoji, placeId: data.placeId, folderId: data.folderId })
      if(saved) {
        showNotification(`Uusi tavara '${data.name}' lisätty`, "is-success")
        if(data.listId && data.listId.length > 0) {
          data.listId.forEach((listId: number) => {
            ListStorage.assignItemsToList([saved.id as number], listId)
          })
        }
        onUpdate()
      } else {
        showNotification(`Tavaraa '${data.name}' ei voitu lisätä, sillä sen niminen tavara on jo olemassa.`, "is-warning")
      
      }
      closeModal()
    }
    const handleEditFolder = (data: folderData) => {
        const saved = FolderStorage.editFolder(data.id!, data.name);
        if(saved) {
            showNotification(`Kansio '${data.name}' muokattu onnistuneesti.`, "is-success");
            onUpdate();
        } else {
            showNotification(`Kansiota '${data.name}' ei voitu muokata, sillä sen niminen kansio on jo olemassa.`, "is-warning");
        }
        closeEditFolderModal();
    }
    const handleDeleteFolder = (folderId: number) => {
        const folderName = FolderStorage.getFolders(folderId)?.name;
        const deleted = FolderStorage.deleteFolder(folderId);
        if (deleted) {
            showNotification(`Kansio '${folderName}' poistettu onnistuneesti.`, "is-success");
            onUpdate();
        }
    }
    const handleSaveFolder = (data: folderData) => {
        const saved = FolderStorage.addFolder({ name: data.name });
        if(saved) {
            showNotification(`Uusi kansio '${data.name}' lisätty`, "is-success");
            onUpdate();
        } else {
            showNotification(`Kansiota '${data.name}' ei voitu lisätä, sillä sen niminen kansio on jo olemassa.`, "is-warning");
        }
        closeFolderModal();
    }
    const onUpdate = () => {
      setActiveItemId(-1)
      setItems(ItemStorage.getItems())
      setFolders(FolderStorage.getFolders());
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
        <div className="buttons">
            <button className="button is-medium is-success is-outlined mb-6" onClick={openRootModal}>
            <span className="icon">
                <i className="fas fa-plus"></i>
            </span>
            <span>
                Uusi tavara  
            </span>
            </button>
            <button className="button is-medium is-info is-outlined mb-6" onClick={openFolderModal}>
                <span className="icon">
                    <i className="fas fa-folder-plus"></i>
                </span>
                <span>
                    Luo kansio
                </span>
            </button>
        </div>
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
        {folders.map((folder: folderData, index: number) => (
            <div key={index}>
                <div className="columns is-mobile is-vcentered">
                    <div className="column is-9 pt-5">
                        <a onClick={() => toggleFolder(folder.id!)} className="p-5 pr-6">
                            <span className="icon">
                                <i className={`fas ${expandedFolders.includes(folder.id!) ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                            </span>
                            <span className="title is-4 ml-2">{folder.name}</span>
                            <span className="is-size-6 ml-2">({items.filter(item => item.folderId === folder.id).length})</span>
                        </a>
                    </div>
                    
                    <div className="column is-narrow pt-5">
                        <FolderSettings
                            onAddItem={() => openModal(folder.id)}
                            onEditFolder={() => openEditFolderModal(folder)}
                            onDeleteFolder={() => handleDeleteFolder(folder.id!)}
                        />
                    </div>
                </div>
                {expandedFolders.includes(folder.id!) && items.filter(item => item.folderId === folder.id).map((item: itemData, itemIndex: number) => (
                    item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 ?
                    <div key={itemIndex}>
                        <div className={`columns is-mobile is-vcentered pr-5 m-0 ${item.available ? "" : "has-background-light"}`} style={{width: "100%"}}>
                        <div className="column is-2">
                            <span className="is-size-3 pl-5 ml-3">
                            {(item.emoji || item.name[0]).substring(0,2)}
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
                <hr/>
            </div>
        ))}
        
        <p className={`mt-6 ${items.filter(item => !item.folderId || item.folderId === 0).length > 0 ? "" : "is-hidden"}`}>
          <span className="title is-4 p-5 mt-6">Kansioimattomat</span>
          <span className="subtitle is-6">({items.filter(item => !item.folderId || item.folderId === 0).length})</span>
        </p>
        {items.filter(item => !item.folderId || item.folderId === 0).map((item: itemData, index: number) => (
          item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1 ?
          <div key={index}>
            <div className={`columns is-mobile is-vcentered pr-5 m-0 ${item.available ? "" : "has-background-light"}`} style={{width: "100%"}}>
              <div className="column is-2">
                <span className="is-size-3 pl-5 ml-3">
                {(item.emoji || item.name[0]).substring(0,2)}
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
      <CreateItem isActive={isModalActive} onClose={closeModal} onSave={handleSave} folderId={activeFolderId} />
      <CreateFolder isActive={isFolderModalActive} onClose={closeFolderModal} onSave={handleSaveFolder}/>
      <EditFolder isActive={isEditFolderModalActive} onClose={closeEditFolderModal} onSave={handleEditFolder} folderData={activeFolderData} />
      <Loading isActive={isLoadingActive}/>
      <SelectPlace isActive={isSelectPlaceActive} itemId={Number(activeItemId)} onClose={closeSelectPlaceModal} onSave={onUpdate}/>

    </div>
  );
}
