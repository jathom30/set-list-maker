import { createSetlistIds } from "helpers";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { SongsContext } from "./SongsContext";

type SetlistContextType = {
  setlistIds: {[key: string]: string[]}
  setSetlistIds: Dispatch<SetStateAction<{[key: string]: string[]}>>
  createSetlist: (length: number, numberOfSetlists: number) => void
  replaceSongId: (originalId: string, replacementId: string, setlistId: string) => void
  removeSongId: (id: string, setlistId: string) => void
}

const defaultValues = {
  setlistIds: {},
  setSetlistIds: (_value: SetStateAction<{[key: string]: string[]}>) => undefined,
  createSetlist: (_length: number, _numberOfSetlists: number) => undefined,
  replaceSongId: (_originalId: string, _replacementId: string, _setlistId: string) => undefined,
  removeSongId: (_id: string, _setlistId: string) => undefined,
}

export const SetlistContext = createContext<SetlistContextType>(defaultValues)

export const SetlistContextProvider: React.FC = ({ children }) => {
  const [setlistIds, setSetlistIds] = useState<{[key: string]: string[]}>({})
  const {songs} = useContext(SongsContext)

  // TODO set up state to handle multiple setlists
  const createSetlist = (length: number, numberOfSetlists: number) => {
    const testlists = createSetlistIds(length, numberOfSetlists, songs)
    setSetlistIds(testlists)
  }


  const replaceSongId = (originalId: string, replacementId: string, setlistId: string) => {
    setSetlistIds(prevSetlists => {
      const index = prevSetlists[setlistId].findIndex(prevId => prevId === originalId)
      const filtered = prevSetlists[setlistId].filter(prevId => prevId !== originalId)
      return {
        ...prevSetlists,
        [setlistId]: [...filtered.slice(0, index), replacementId, ...filtered.slice(index)],
      }
    })
  }

  const removeSongId = (id: string, setlistId: string) => {
    setSetlistIds(prevSetlists => {
      return {
        ...prevSetlists,
        [setlistId]: prevSetlists[setlistId].filter(songId => songId !== id)
      }
    })
  }

  const value = {
    setlistIds,
    setSetlistIds,
    createSetlist,
    replaceSongId,
    removeSongId,
  }

  return (
    <SetlistContext.Provider value={value}>
      {children}
    </SetlistContext.Provider>
  )
}