'use client';
import ItemStorage from '@/storage/items';

interface folderData {
    name: string,
    id?: number,
}

const getFolders = (id?:number) => {
    if(typeof window === "undefined") return [];

    const array = JSON.parse(window.localStorage.getItem("folders")||"[]");

    if(id || id == 0) {
        return array.filter((folder:folderData) => folder.id == id)[0];
    } else {
        return array.sort((a:any, b:any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    }
}
const getNextID = () => {
    const currentId = Number(window.localStorage.getItem("currentFolderId") || 0)
    const nextId = currentId+1;
    
    window.localStorage.setItem('currentFolderId', JSON.stringify(nextId))

    return nextId;
}
const addFolder = (data: folderData) => {
    const folders = getFolders();

    data.id = getNextID()
    let exists = false;
    folders.forEach((folder: folderData) => {
        if(folder.name == data.name) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        folders.push(data)
        window.localStorage.setItem('folders', JSON.stringify(folders))
        return data;
    }
}

const editFolder = (id: number, name: string) => {
    const folders = getFolders();

    let exists = false;
    folders.forEach((folder: folderData) => {
        if(folder.name == name && folder.id != id) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        const folder = folders.filter((folder: folderData) => folder.id == id)[0]
        folder.name = name;
        window.localStorage.setItem('folders', JSON.stringify(folders))
        return true;
    }
}
const deleteFolder = (id: number) => {
    let folders = getFolders();

    const name = folders.filter((folder: folderData) => folder.id == id)[0].name;
    const confirmResult = confirm("Poistetaanko kansio '"+name+"'?\nKansion tavarat siirretään kansioimattomiksi.")

    if(confirmResult) {
        ItemStorage.getItems().forEach((item: any) => {
            if(item.folderId == id) {
                item.folderId = 0;
                ItemStorage.setItemFolder(item.id, 0);
            }
        })
        folders = folders.filter((folder: folderData) => folder.id != id)
        window.localStorage.setItem('folders', JSON.stringify(folders))

        return true;
    } 
    return false;
}

export default {
    addFolder,
    deleteFolder,
    editFolder,
    getFolders
} 