'use client'
import { useParams, useRouter } from 'next/navigation';
import Storage from "@/storage/lists";
import ItemStorage from "@/storage/items";
import PlaceStorage from "@/storage/places";
import Link from 'next/link';
import React from "react";
import EditList from '@/components/editlist';
import Notification from '@/components/notification';
import Loading from '@/components/loading';
import ItemToList from '@/components/itemtolist';
import LinkLists from '@/components/linklists';
import ItemSettings from './itemSettings';

const ListPage = () => {
  const router = useRouter();
  const [lists, setLists] = React.useState(Storage.getLists()); // Assuming getLists fetches your data from localStorage

  const onToggleItem = (itemId: Number) => {
    const updated = Storage.toggleItemPack(itemId, currentList.id);
    if (updated) {
      setLists(Storage.getLists());
    }
  };

  const params = useParams();
  const { id } = params;
  const currentList = lists.filter((list:any) => list.id == id)[0];
  if(!currentList) return null;

  const [isItemModalActive, setIsItemModalActive] = React.useState(false);

  const openItemModal = () => {
    setIsItemModalActive(true);
  };

  const closeItemModal = () => {
    setIsItemModalActive(false);
  };
  const handleItemSave = () => {
    setLists(Storage.getLists());
    closeItemModal();
  }

  const [isLinkModalActive, setIsLinkModalActive] = React.useState(false);

  const openLinkModal = () => {
    setIsLinkModalActive(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalActive(false);
  };
  const handleLinkSave = () => {
    setLists(Storage.getLists());
    closeLinkModal();
  }


  const [isModalActive, setIsModalActive] = React.useState(false);

  React.useEffect(() => {
    router.prefetch("/"); // Preload the next page
  }, []);

  const openModal = () => {
    setIsModalActive(true);
  };

  const closeModal = () => {
    setIsModalActive(false);
  };
  const [isNotificationActive, setIsNotificationActive] = React.useState(false);
  const [notificationContent, setNotificationContent] = React.useState('Initial content');
  const [notificationColor, setNotificationColor] = React.useState('is-danger');
  
  const showNotification = (content: string, color: string) => {
    setNotificationContent(content);
    setNotificationColor(color);
    setIsNotificationActive(true);
  };
  const closeNotification = () => {
    setIsNotificationActive(false);
  };
  const handleSave = (value: string) => {
    if(value == currentList.name) return closeModal();
    const saved = Storage.editListName(value, Number(id))
    if(!saved) {
      showNotification(`Nimeä ei voitu vaihtaa, sillä on olemassa jo lista antamallasi nimellä.`, "is-warning")
    } else {
      closeNotification()
    }
    closeModal()
  }
  const [isLoadingActive, setIsLoadingActive] = React.useState(false);
  const openLoading = () => {
    setIsLoadingActive(true);
  };
  const home =() => {
    openLoading()
    router.push('/');
  }

  const handleDelete = () => {
    let deleted = Storage.deleteList(Number(id));
    if(deleted) {
      console.log("Deleted")
      home()
    }
  }
  const unlink = (id:Number) => {
    Storage.listsUnlink([currentList.id, id])
    setLists(Storage.getLists());
  }
  const unlinkToThis = (id:Number) => {
    Storage.listsUnlink([id, currentList.id])
    setLists(Storage.getLists());
  }
  const unPackAll = () => {
    Storage.unPackAllItems(currentList.id)
    setLists(Storage.getLists());
  }
  const onUpdate = () => {
    setLists(Storage.getLists());
  }
  return (
    <div className="pt-6">
      <nav className="sn navbar is-boxed is-fixed-top px-5">
        <a className="navbar-brand py-3" onClick={home}>
          <div className="navbar-item is-size-4 has-text-weight-bold">
            <span className="icon">
              <i className="fas fa-chevron-left"></i>
            </span>
            <span>
              Takaisin
            </span>
          </div>
        </a>
      </nav>
      <nav className="sn navbar is-fixed-top" style={{marginTop: "75px", height: "70px"}}>
        <div className="navbar-start">
          <div className="navbar-brand is-size-4 p-5">
            {currentList.name}
          </div>
        </div>
        <div className="sn navbar-end">
        <div className="dropdown is-hoverable is-right">
            <div className="dropdown-trigger p-4 m-1">
              <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                <span className="icon is-small">
                  <i className="fas fa-gear is-size-4" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a href="#" className="dropdown-item is-size-5" onClick={openModal}>
                  <span className="icon mr-4">
                    <i className="fas fa-pencil"></i>
                  </span>
                  <span>
                    Muokkaa nimeä
                  </span>
                </a>
                <a href="#" className="dropdown-item is-size-5" onClick={unPackAll}>
                  <span className="icon mr-4">
                    <i className="fas fa-ban"></i>
                  </span>
                  <span>
                    Pura pakkaukset
                  </span>
                </a>
                <a href="#" className="dropdown-item is-size-5" onClick={openLinkModal}>
                  <span className="icon mr-4">
                    <i className="fas fa-link"></i>
                  </span>
                  <span>
                    Yhdistä toiseen listaan
                  </span>
                </a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item is-size-5 has-text-danger" onClick={handleDelete}>
                  <span className="icon mr-4">
                    <i className="fas fa-trash-can"></i>
                  </span>
                  <span>
                    Poista lista
                  </span>
                </a>              
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <hr style={{marginTop: "100px"}}/>

      <section className="section is-fullheight-with-navbar my-0 pb-0 pt-5 ">
        <div className="mb-5">
          {Storage.getLinkedLists(currentList.id)[0] || Storage.getToThisLinkedLists(currentList.id)[0] ? 
            <div className="has-text-grey mb-2">
              Yhdistettyihin listoihin lisätään automaattisesti tavarat, jotka lisätään tähän listaan. Toisin päin, tähän listaan yhdistetyistä listoista lisätään tälle listalle.
            </div>          
          :""}
          {
          Storage.getLinkedLists(currentList.id).map((list: any, index:number) => (
            <div key={index} className="columns is-vcentered icon-text m-0">
              <span className="icon has-text-grey">
                <i className="fas fa-link"></i>
              </span>
              <strong>Yhdistetty </strong>
              <Link href={`/list/${list[1]}`}>
                {Storage.getLists(list[1]).name}
              </Link>
              <a className="button is-small is-ghost has-text-danger is-size-6" onClick={() => unlink(list[1])}>Poista</a>
            </div>
          ))
          }
          {
          Storage.getToThisLinkedLists(currentList.id).map((list: any, index:number) => (
            <div key={index} className="columns is-vcentered icon-text m-0">
              <span className="icon has-text-grey">
                <i className="fas fa-arrow-right"></i>
              </span>
              <strong>Tähän yhdistynyt </strong>
              <Link href={`/list/${list[0]}`}>
                {Storage.getLists(list[0]).name}
              </Link>
              <a className="button is-small is-ghost has-text-danger is-size-6" onClick={() => unlinkToThis(list[0])}>Poista</a>
            </div>
          ))
          }
        </div>
        <Notification
          isActive={isNotificationActive}
          onClose={closeNotification}
          color={notificationColor}
          content={notificationContent}
        />    
        <button className="button is-medium is-success is-outlined mb-6" onClick={openItemModal}>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>
            Lisää tavaroita  
          </span>
        </button>
      </section>
      {ItemStorage.getItems().map((item: any, index: number) => (
        currentList && currentList.items?.filter((i:any) => i.id == item.id && !i.packed)[0] ?
          <div key={index} className="pb-1">
            <div className='columns pl-5 is-mobile is-vcentered mb-1' style={{width: "100%"}}>
                <div className="column is-2">
                    <span className="is-size-3 pl-3">
                    {(item.emoji || item.name[0]).substring(0,2)}
                    </span>
                </div> 
                <div className="column">
                    <div>
                    <strong>{item.name}</strong>
                    {item.available ? "" :
                      <span className="ml-3 has-text-danger">Kadonnut</span>
                    }
                    <br/>
                    <span className="icon-text">
                        <span className="icon">
                        <i className="fas fa-location-dot"></i>
                        </span>
                        <span>{PlaceStorage.getPlaces(item.placeId)?.name || "Ei paikkaa"}</span>
                    </span>
                    <br/>
                      <span className="icon-text has-text-danger">
                        <span className="icon">
                        <i className="fas fa-ban"></i>
                        </span>
                        <span>Ei pakattu</span>
                      </span>
                    </div>
                    
                </div>
                  <a className="column is-1 pt-5 pr-6 pl-5 ml-4" onClick={() => {onToggleItem(item.id)}}>
                      <span className="icon has-text-success is-size-4">
                        <i className="fas fa-check"></i>
                      </span>
                  </a>
                  <div className="column is-1 pt-5 pr-6 mr-2 ml-4">
                    <ItemSettings itemId={item.id} listId={currentList.id} onUpdate={onUpdate}/> 
                </div>
            </div>
          </div>
        : ""
        ))}
        {
          currentList.items?.filter((i:any) => i.packed)[0] ?
            <div>
              <section style={{height: "50px"}}></section>
              <div className="has-text-centered pb-5 has-text-grey is-size-5">
                Pakatut
              </div>
            </div>
            
          : ""
        }
        
        {ItemStorage.getItems().map((item: any, index: number) => (
        currentList.items?.filter((i:any) => i.id == item.id && i.packed)[0] ?
          <div key={index} className="has-background-light pb-1">
            <div className='columns pl-5 is-mobile is-vcentered mb-1' style={{width: "100%"}}>
              <div className="column is-2">
                  <span className="is-size-3 pl-3">
                  {(item.emoji || item.name[0]).substring(0,2)}
                  </span>
              </div> 
              <div className="column">
                <div>
                <strong>{item.name}</strong>
                {item.available ? "" :
                  <span className="ml-3 has-text-danger">Kadonnut</span>
                }
                <br/>
                <span className="icon-text">
                    <span className="icon">
                    <i className="fas fa-location-dot"></i>
                    </span>
                    <span>{PlaceStorage.getPlaces(item.placeId)?.name || "Ei paikkaa"}</span>
                </span>
                <br/>
                  <span className="icon-text has-text-grey">
                    <span className="icon">
                    <i className="fas fa-check"></i>
                    </span>
                    <span>Pakattu</span>
                  </span>
                </div>
              </div>
                <a className="column is-1 pt-5 pr-6 pl-5 ml-4" onClick={() => {onToggleItem(item.id)}}>
                  <span className="icon has-text-grey is-size-4">
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  </span>
                </a>
                <div className="column is-1 pt-5 pr-6 mr-2 ml-4">
                    <ItemSettings itemId={item.id} listId={currentList.id} onUpdate={onUpdate}/> 
                </div>
            </div>
          </div>
        : ""
        ))}

      <EditList isActive={isModalActive} onClose={closeModal} onSave={handleSave} name={currentList.name}/>
      <Loading isActive={isLoadingActive}/>
      <ItemToList isActive={isItemModalActive} onClose={closeItemModal} onSave={handleItemSave} id={currentList.id}/>
      <LinkLists isActive={isLinkModalActive} onClose={closeLinkModal} onSave={handleLinkSave} id={currentList.id}/>
    </div>
  );
};

export default ListPage;