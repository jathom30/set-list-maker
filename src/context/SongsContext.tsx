import { someSongs } from "mocks";
import React, { createContext, useState } from "react";
import { Song } from "types";

type SongsContextType = {
  songs: Song[]
  addSong: (song: Song) => void
  removeSong: (songName: string) => void
  updateSong: (song: Song) => void
}

const defaultValues = {
  songs: [],
  addSong: (_song: Song) => undefined,
  removeSong: (_songName: string) => undefined,
  updateSong: (_song: Song) => undefined,
}

export const SongsContext = createContext<SongsContextType>(defaultValues)

export const SongsContextProvider: React.FC = ({children}) => {
  // TODO remove this when done testing
  const [songs, setSongs] = useState<Song[]>(someSongs)

  const addSong = (song: Song) => {
    setSongs(prevSongs => [...prevSongs, song])
  }

  const removeSong = (id: string) => {
    setSongs(prevSongs => prevSongs.filter(prevSong => prevSong.id !== id))
  }

  const updateSong = (song: Song) => {
    setSongs(prevSongs => {
      const index = prevSongs.findIndex(prevSong => prevSong.id === song.id)
      const filtered = prevSongs.filter(prevSong => prevSong.id !== song.id)
      return [...filtered.slice(0, index), song, ...filtered.slice(index)]
    })
  }

  const value = {
    songs,
    addSong,
    removeSong,
    updateSong,
  }

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  )
}