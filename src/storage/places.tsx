'use client';
import React, { useState } from 'react';
import ListStorage from '@/storage/lists';

interface placeData {
    name: string,
    id?: number,
}

const getPlaces = (id?:number) => {
    if(typeof window === "undefined") return [];

    const array = JSON.parse(window.localStorage.getItem("places")||"[]");

    if(id || id == 0) {
        return array.filter((place:placeData) => place.id == id)[0];
    } else {
        return array.sort((a:any, b:any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    }
}
const getNextID = () => {
    const currentId = Number(window.localStorage.getItem("currentListId") || -1)
    const nextId = currentId+1;
    
    window.localStorage.setItem('currentListId', JSON.stringify(nextId))

    return nextId;
}
const addPlace = (data: placeData) => {
    const places = getPlaces();

    data.id = getNextID()
    let exists = false;
    places.forEach((place: placeData) => {
        if(place.name == data.name) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        places.push(data)
        window.localStorage.setItem('places', JSON.stringify(places))
        return true;
    }
}
const editPlace = (id: number, name: string) => {
    const places = getPlaces();

    let exists = false;
    places.forEach((places: placeData) => {
        if(places.name == name && places.id != id) {
            exists = true;
        }
    })

    if(exists) {
        return false;
    } else {
        const place = places.filter((place: placeData) => place.id == id)[0]
        place.name = name;
        window.localStorage.setItem('places', JSON.stringify(places))
        return true;
    }
}
const deletePlace = (id: number) => {
    let places = getPlaces();

    const name = places.filter((place: placeData) => place.id == id)[0].name;
    const confirmResult = confirm("Poistetaanko paikka '"+name+"'?")

    if(confirmResult) {
        places = places.filter((place: placeData) => place.id != id)
        window.localStorage.setItem('places', JSON.stringify(places))

        return true;
    } 
    return false;
}

export default {
    addPlace,
    deletePlace,
    editPlace,
    getPlaces
}