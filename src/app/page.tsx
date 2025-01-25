'use client';
import React, { useState, useEffect } from 'react';
import NavBar from "../components/navbar"
import CreateList from "../components/createlist"
import Notification from "../components/notification"
import Image from "next/image"
import PlusIcon from "../../public/plus-solid.svg";
import Storage from "../storage/lists";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);

  
  const router = useRouter();
  useEffect(() => {
    setHydrated(true)
    router.prefetch("/items")
  }, [])
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

  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [notificationContent, setNotificationContent] = useState('Initial content');
  const [notificationColor, setNotificationColor] = useState('is-danger');

  const showNotification = (content: string, color: string) => {
    setNotificationContent(content);
    setNotificationColor(color);
    setIsNotificationActive(true);
  };

  const closeNotification = () => {
    setIsNotificationActive(false);
  };

  const handleListClick = (id: number) => {
    openLoading()
    router.push(`/list/${id}`); // Navigate to the list page
  };

  const handleSave = (value: string) => {
    const saved = Storage.addList({name: value, lastUpdated: new Date()})
    if(saved) {
      showNotification(`Uusi lista '${value}' lisätty`, "is-success")
    } else {
      showNotification(`Listaa '${value}' ei voitu lisätä, sillä sen niminen lista on jo olemassa.`, "is-warning")
    }
    closeModal()
  }
  interface listData {
    name: string,
    lastUpdated: Date,
    id: number,
    items: Object[]
  }
  return (
    <div>
      <section className="section is-link is-fullheight-with-navbar">
        <p className="title">Tavarapakkauslistat</p>

        <Notification
          isActive={isNotificationActive}
          onClose={closeNotification}
          color={notificationColor}
          content={notificationContent}
        />    
        <button className="button is-medium is-success is-outlined" onClick={openModal}>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>
            Uusi lista  
          </span>
        </button>
      </section>
      {hydrated && Storage.getLists().length == 0 ? 
          <div className="has-text-centered has-text-grey mt-6 pt-6">
            Luo lista painamalla Uusi lista -painiketta.
          </div>
          :
          <hr/>
      }
      {hydrated ? Storage.getLists().map((item: listData, index: number) => (
        <a key={index} onClick={() => handleListClick(item.id)}>
          <div className='columns is-mobile is-vcentered mt-4' style={{width: "100%"}}>
            <div className="column is-2">
              <span className="icon pl-5 ml-4">
                <i className={`${item.items && (item.items?.filter((i:any) => !i.packed)[0] || !item.items[0]) ? "far fa-circle" : "fas fa-check"} is-size-5 has-text-grey`}></i>
              </span>
            </div> 
            <div className="column">
              <div>
                <strong>{item.name}</strong>
                <br/>
                <div className={`${item.items && (item.items?.filter((i:any) => !i.packed)[0] || !item.items[0]) ? "has-text-grey" : "has-text-success has-text-weight-bold"}`}>
                  {`
                    Pakattu ${item.items?.filter((i:any) => i.packed).length}/${item.items?.length}
                  `}
                </div>
              </div>
            </div>
          </div>
          <hr/>
        </a>
      )) : ""}
      <CreateList isActive={isModalActive} onClose={closeModal} onSave={handleSave}></CreateList>
      <Loading isActive={isLoadingActive}/>
      {/* <button className="button mt-6 is-ghost has-text-light" onClick={() => {localStorage.clear()}}>clear</button> */}
    </div>
  );
}
