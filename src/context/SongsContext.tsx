import { createSong, deleteSong, getSongs, updateSong } from "api";
import React, { createContext, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useMutation, useQuery } from "react-query";
import { Song } from "types";

type SongsContextType = {
  songs: Song[]
  addSong: (song: Song) => void
  removeSong: (songName: string) => void
  editSong: (song: Song) => void
}

const defaultValues = {
  songs: [],
  addSong: (_song: Song) => undefined,
  removeSong: (_songName: string) => undefined,
  editSong: (_song: Song) => undefined,
}

export const SongsContext = createContext<SongsContextType>(defaultValues)

export const SongsContextProvider: React.FC = ({children}) => {
  const [songs, setSongs] = useState<Song[]>([])

  const {isLoggedIn} = useIdentityContext()

  const songsQuery = useQuery('songs', getSongs, {
    enabled: isLoggedIn,
    onSuccess: (data) => setSongs(data?.map(d => d.fields) as Song[])
  })
  const addSongMutation = useMutation(createSong)
  const deleteSongMutation = useMutation(deleteSong)
  const updateSongMutation = useMutation(updateSong)
  
  const addSong = (song: Song) => {
    // TODO make optomistic update
    addSongMutation.mutate(song, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const removeSong = (id: string) => {
    deleteSongMutation.mutate(id, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const editSong = (song: Song) => {
    // TODO make optomistic update
    updateSongMutation.mutate(song, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const value = {
    songs,
    addSong,
    removeSong,
    editSong,
  }

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  )
}