'use client';
import React, { useState } from 'react';
import ItemStorage from "@/storage/items";

interface listData {
    name: string,
    lastUpdated: Date,
    id?: number,
    items?: number[]
}
function parseDate(date:Date) {
    const ndate = new Date();
    const currentDate = ndate.getDate()+"."+(ndate.getMonth()+1)+"."+ndate.getFullYear();
    const ydate = new Date();
    ydate.setDate(ydate.getDate() - 1);
    const yesterdayDate = ydate.getDate()+"."+(ydate.getMonth()+1)+"."+ydate.getFullYear();
    const tdate = new Date();
    tdate.setDate(tdate.getDate() + 1);
    const tomorrowDate = tdate.getDate()+"."+(tdate.getMonth()+1)+"."+tdate.getFullYear();

    const itemDate = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    return {
        "date": itemDate,
        "textDate": (itemDate == currentDate ? "Tänään" : (itemDate == yesterdayDate ? "Eilen" : (itemDate == tomorrowDate ? "Huomenna" : itemDate)))
    }
}
const getLists = (id?:number) => {
    if(typeof window === "undefined") return [];

    const array = JSON.parse(window.localStorage.getItem("lists")||"[]");
    if(id || id == 0) {
        return array.filter((list:listData) => list.id == id)[0];
    } else {
        return array.sort((a:listData,b:listData) => (new Date(a.lastUpdated).getTime() < new Date(b.lastUpdated).getTime()) ? 1 : ((new Date(b.lastUpdated).getTime() < new Date(a.lastUpdated).getTime()) ? -1 : 0));
    }
}
const getNextID = () => {
    const currentId = Number(window.localStorage.getItem("currentListId") || -1)
    const nextId = currentId+1;
    
    window.localStorage.setItem('currentListId', JSON.stringify(nextId))

    return nextId;
}

const assignItemsToList = (items: number[], listId: number, assignToLinks?: boolean) => {
    const lists = getLists();
    const list = lists.filter((list: listData) => list.id == listId)[0];

    const currentItems = list.items;

    items.forEach(item => {
        if(!currentItems.filter((i:any) => i.id == item)[0]) {
            const listItem = {
                id: item,
                packed: false
            }
            currentItems.push(listItem);
        }
    })
    list.items = currentItems;
    console.log(list.name,list.items, items)

    window.localStorage.setItem('lists', JSON.stringify(lists))

    if(assignToLinks) {
        const linkeds = getLinkedLists(list.id);
        linkeds.forEach((link:any) => {
            console.log(items, link[1])
            assignItemsToList(items, link[1], false)
        })
    }
}
const unassignItemFromList = (listId: number, itemId: number) => {
    const lists = getLists();
    const list = lists.filter((list: listData) => list.id == listId)[0];

    list.items = list.items.filter((i:any) => i.id != itemId)

    window.localStorage.setItem('lists', JSON.stringify(lists))
    return true;
}
const toggleItemPack = (itemId: number, listId: number) => {
    const lists = getLists();
    const list = lists.filter((list: listData) => list.id == listId)[0];
    const currentItem = list.items.filter((i:any) => i.id == itemId)[0];
    if(!currentItem) return false;

    currentItem.packed = !currentItem.packed;
    console.log(currentItem)
    window.localStorage.setItem('lists', JSON.stringify(lists))
    return true;
}

const clear = () => {
    window.localStorage.clear()
}

const addList = (data: listData) => {
    const lists = getLists();
    data.id = getNextID();
    data.items = [];

    let exists = false;
    lists.forEach((list: listData) => {
        if(list.name == data.name) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        lists.push(data)
        window.localStorage.setItem('lists', JSON.stringify(lists))
        return true;
    }
}
const editListName = (name: string, id: number) => {
    const lists = getLists();

    let exists = false;
    lists.forEach((list: listData) => {
        if(list.name == name) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        lists.filter((list:listData) => list.id == id)[0].name = name;
        window.localStorage.setItem('lists', JSON.stringify(lists))
        return true;
    }
}
const deleteList = (id: number) => {
    let lists = getLists();

    const name = lists.filter((list:listData) => list.id == id)[0].name;
    const confirmResult = confirm("Poistetaanko lista '"+name+"'?")
    if(confirmResult) {
        lists = lists.filter((list: listData) => list.id != id)
        window.localStorage.setItem('lists', JSON.stringify(lists))
        return true;
    } 
    return false;
}
const getLinkedLists = (id?:number) => {
    const array = JSON.parse(window.localStorage.getItem("listlinks")||"[]");
    if(id || id == 0) {
        const links = array.filter((link:number[]) => link[0] == id ? getLists(link[1]) : false);
        return links;
    } else {
        return array;
    }
}
const getToThisLinkedLists = (id?:number) => {
    const array = getLinkedLists()
    if(id || id == 0) {
        const links = array.filter((link:number[]) => link[1] == id ? getLists(link[0]) : false);
        return links;
    } else {
        return array;
    }
}
const listsLink = (ids: number[]) => {
    const links = getLinkedLists();

    let exists = false;
    links.forEach((link:number[]) => {
        if(link[0] == ids[0] && link[1] == ids[1]) {
            exists = true;
        }
    })
    if(exists) return false;

    links.push(ids)
    window.localStorage.setItem('listlinks', JSON.stringify(links))
    return true;
}
const listsUnlink = (ids: number[]) => {
    let links = getLinkedLists();

    let exists = [-1];
    links.forEach((link:number[]) => {
        if(link[0] == ids[0] && link[1] == ids[1]) {
            exists = link;
        }
    })
    if(exists[0] == -1) return false;

    links = links.filter((link:number[]) => (link[0] != exists[0] || link[1] != exists[1]))
    window.localStorage.setItem('listlinks', JSON.stringify(links))
    return true;
}
const unPackAllItems = (id:number) => {
    const lists = getLists();
    const list = lists.filter((list: listData) => list.id == id)[0];
    list.items.forEach((item:any) => {
        item.packed = false;
    })
    window.localStorage.setItem('lists', JSON.stringify(lists))
    return true;
}
export default {
    getLists,
    addList,
    clear,
    parseDate,
    deleteList,
    editListName,
    assignItemsToList,
    unassignItemFromList,
    toggleItemPack,
    listsLink,
    listsUnlink,
    getLinkedLists,
    getToThisLinkedLists,
    unPackAllItems
}