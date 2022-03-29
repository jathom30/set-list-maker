import { createSetlistIds } from "helpers";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { SongsContext } from "./SongsContext";

type SetlistContextType = {
  setlistIds: string[]
  setSetlistIds: Dispatch<SetStateAction<string[]>>
  createSetlist: (length: number, numberOfSetlists: number) => void
  replaceSongId: (originalId: string, replacementId: string) => void
  removeSongId: (id: string) => void
}

const defaultValues = {
  setlistIds: [],
  setSetlistIds: (_value: SetStateAction<string[]>) => undefined,
  createSetlist: (_length: number, _numberOfSetlists: number) => undefined,
  replaceSongId: (_originalId: string, _replacementId: string) => undefined,
  removeSongId: (_id: string) => undefined,
}

export const SetlistContext = createContext<SetlistContextType>(defaultValues)

export const SetlistContextProvider: React.FC = ({ children }) => {
  const [setlistIds, setSetlistIds] = useState<string[]>([])
  const {songs} = useContext(SongsContext)

  const createSetlist = (length: number, numberOfSetlists: number) => {
    setSetlistIds(createSetlistIds(length, numberOfSetlists, songs))
  }

  const replaceSongId = (originalId: string, replacementId: string) => {
    setSetlistIds(prevIds => {
      const index = prevIds.findIndex(prevId => prevId === originalId)
      const filtered = prevIds.filter(prevId => prevId !== originalId)
      return [...filtered.slice(0, index), replacementId, ...filtered.slice(index)]
    })
  }

  const removeSongId = (id: string) => {
    setSetlistIds(prevIds => prevIds.filter(prevId => prevId !== id))
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