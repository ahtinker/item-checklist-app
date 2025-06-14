'use client';
import React, { useState } from 'react';
import ListStorage from '@/storage/lists';

interface itemData {
    name: string,
    emoji: string
    id?: number,
    available?: boolean,
    placeId?: number,
    folderId?: number
}

const getItems = (id?:number) => {
    if(typeof window === "undefined") return [];

    const array = JSON.parse(window.localStorage.getItem("items")||"[]");

    if(id || id == 0) {
        return array.filter((item:itemData) => item.id == id)[0];
    } else {
        const ar = array.sort((a:any, b:any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
        return ar.sort((a:itemData, b:itemData) => Number(a.available === false) - Number(b.available === false))
    }
}
const getNextID = () => {
    const currentId = Number(window.localStorage.getItem("currentListId") || -1)
    const nextId = currentId+1;
    
    window.localStorage.setItem('currentListId', JSON.stringify(nextId))

    return nextId;
}
const addItem = (data: itemData) => {
    const items = getItems();

    data.id = getNextID()
    data.available = true;
    data.placeId = data.placeId || 0;
    data.folderId = data.folderId || 0;
    let exists = false;
    items.forEach((item: itemData) => {
        if(item.name == data.name) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        items.push(data)
        window.localStorage.setItem('items', JSON.stringify(items))
        return data;
    }
}
const setItemPlace = (itemId: number, placeId: number) => {
    const items = getItems()
    items.filter((i:any) => i.id == itemId)[0].placeId = placeId;
    window.localStorage.setItem('items', JSON.stringify(items))
    return true;
}
const setItemFolder = (itemId: number, folderId: number) => {
    const items = getItems()
    items.filter((i:any) => i.id == itemId)[0].folderId = folderId;
    window.localStorage.setItem('items', JSON.stringify(items))
    return true;
}
const editItem = (id: number, name: string, emoji: string) => {
    const items = getItems();

    let exists = false;
    items.forEach((item: itemData) => {
        if(item.name == name && item.id != id) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        const item = items.filter((item: itemData) => item.id == id)[0]
        item.name = name;
        item.emoji = emoji;
        window.localStorage.setItem('items', JSON.stringify(items))
        return true;
    }
}
const deleteItem = (id: number) => {
    let items = getItems();

    const name = items.filter((item: itemData) => item.id == id)[0].name;
    const confirmResult = confirm("Poistetaanko tavara '"+name+"'?")

    if(confirmResult) {
        items = items.filter((item: itemData) => item.id != id)
        window.localStorage.setItem('items', JSON.stringify(items))

        const lists = ListStorage.getLists();
        lists.forEach((list:any) => {
            list.items = list.items.filter((item:any) => item.id != id)
        })
        window.localStorage.setItem('lists', JSON.stringify(lists))

        return true;
    } 
    return false;
}
const toggleItemAvailable = (id: number) => {
    const items = getItems();
    const item = items.filter((item: itemData) => item.id == id)[0];
    item.available = !item.available
    window.localStorage.setItem('items', JSON.stringify(items))
}

export default {
    addItem,
    deleteItem,
    editItem,
    getItems,
    setItemPlace,
    setItemFolder,
    toggleItemAvailable
}