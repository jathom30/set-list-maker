import { createParentSetlists, deleteParentSetlists, updateParentSetlists } from "api";
import { createSetlists } from "helpers";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Song } from "types";
import { SongsContext } from "./SongsContext";
import {v4 as uuid} from 'uuid'

type SetlistContextType = {
  parentId?: string
  setParentId: (id?: string) => void
  setlistIds: string[]
  setSetlistIds: Dispatch<SetStateAction<string[]>>
  setlists: {[key: string]: string[]}
  setSetlists: Dispatch<SetStateAction<{[key: string]: string[]}>>
  saveSetlists: (name: string) => void
  updateSetlists: (name: string) => void
  deleteSetlists: (id: string) => void
  replaceSongId: (originalId: string, replacementId: string, setlistId: string) => void
  removeSongId: (id: string, setlistId: string) => void
  removeSetlist: (setlistId: string) => void
  createSetlist: (length: number, count: number) => void
  availableSongs: Song[]
}

const defaultValues = {
  parentId: undefined,
  setParentId: (_id?: string) => undefined,
  setlistIds: [],
  setSetlistIds: (_value: SetStateAction<string[]>) => undefined,
  setlists: {},
  setSetlists: (_value: SetStateAction<{[key: string]: string[]}>) => undefined,
  saveSetlists: (_name: string) => undefined,
  updateSetlists: (_name: string) => undefined,
  deleteSetlists: (_id: string) => undefined,
  replaceSongId: (_originalId: string, _replacementId: string, _setlistId: string) => undefined,
  removeSongId: (_id: string, _setlistId: string) => undefined,
  removeSetlist: (_setlistId: string) => undefined,
  createSetlist: (_length: number, _count: number) => undefined,
  availableSongs: [],
}

export const SetlistContext = createContext<SetlistContextType>(defaultValues)

export const SetlistContextProvider: React.FC = ({ children }) => {
  // can be undefined if working with a new setlist not in the database
  const [parentId, setParentId] = useState<string>()
  // ids are used to track drag and drop of whole setlists
  const [setlistIds, setSetlistIds] = useState<string[]>([])
  // setlists are the object of ids and lists of songs
  const [setlists, setSetlists] = useState<{[key: string]: string[]}>({})
  const {songs} = useContext(SongsContext)

  const queryClient = useQueryClient()

  const createSetlist = (length: number, numberOfSetlists: number) => {
    const {setlists, ids} = createSetlists(length, numberOfSetlists, songs)
    setSetlists(setlists)
    setSetlistIds(ids)
  }

  const saveSetlistsMutation = useMutation(createParentSetlists)
  
  const saveSetlists = (name: string) => {
    // if setlist has an id, its already in the database, so update rather than create
    if (parentId) {
      return
    }
    saveSetlistsMutation.mutate({
      localId: uuid(), // ! may not be needed 
      name,
      setlists,
      setlistIds,
      dateModified: new Date().toISOString(),
    }, {
      onSuccess: () => queryClient.invalidateQueries('parent-list')
    })
  }

  const updateSetlistsMutation = useMutation(updateParentSetlists)
  const updateSetlists = (name: string) => {
    updateSetlistsMutation.mutate({
      id: parentId,
      name,
      setlists,
      setlistIds,
      dateModified: new Date().toISOString(),
    })
  }

  const deleteSetlistsMutation = useMutation(deleteParentSetlists)

  const deleteSetlists = (id: string) => {
    deleteSetlistsMutation.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries('parent-list')
    })
  }


  const replaceSongId = (originalId: string, replacementId: string, setlistId: string) => {
    setSetlists(prevSetlists => {
      const index = prevSetlists[setlistId].findIndex(prevId => prevId === originalId)
      const filtered = prevSetlists[setlistId].filter(prevId => prevId !== originalId)
      return {
        ...prevSetlists,
        [setlistId]: [...filtered.slice(0, index), replacementId, ...filtered.slice(index)],
      }
    })
  }

  const removeSongId = (id: string, setlistId: string) => {
    setSetlists(prevSetlists => {
      return {
        ...prevSetlists,
        [setlistId]: prevSetlists[setlistId].filter(songId => songId !== id)
      }
    })
  }

  const removeSetlist = (setlistId: string) => {
    setSetlistIds(prevSetlistIds => prevSetlistIds.filter(id => id !== setlistId))
    setSetlists(prevSetlists => {
      return Object.keys(prevSetlists).reduce((newSetlists, id) => {
        if (id !== setlistId) {
          return {
            ...newSetlists,
            [id]: prevSetlists[id],
          }
        }
        return newSetlists
      }, {})
    })
  }

  const usedSongs = Object.keys(setlists).reduce((all: string[], id) => [
    ...all,
    ...setlists[id]
  ], [])
  const availableSongs = songs?.filter(song => usedSongs.every(id => id !== song.id)) || []

  const value = {
    parentId,
    setParentId,
    setlistIds,
    setSetlistIds,
    setlists,
    setSetlists,
    saveSetlists,
    updateSetlists,
    deleteSetlists,
    replaceSongId,
    removeSongId,
    removeSetlist,
    createSetlist,
    availableSongs,
  }

  return (
    <SetlistContext.Provider value={value}>
      {children}
    </SetlistContext.Provider>
  )
}