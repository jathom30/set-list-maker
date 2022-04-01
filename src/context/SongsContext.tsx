import { createSong, deleteSong, getSongs, updateSong } from "api";
import React, { createContext } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useMutation, useQuery } from "react-query";
import { BasicSong, SongWithId } from "types";

type SongsContextType = {
  songs?: SongWithId[]
  addSong: (song: BasicSong) => void
  removeSong: (songName: string) => void
  editSong: (song: SongWithId) => void
  isSuccess: boolean
  isLoading: boolean
}

const defaultValues = {
  songs: [],
  addSong: (_song: BasicSong) => undefined,
  removeSong: (_songName: string) => undefined,
  editSong: (_song: SongWithId) => undefined,
  isSuccess: false,
  isLoading: true,
}

export const SongsContext = createContext<SongsContextType>(defaultValues)

export const SongsContextProvider: React.FC = ({children}) => {
  const {isLoggedIn} = useIdentityContext()

  const songsQuery = useQuery('songs', getSongs, {
    enabled: isLoggedIn || !!process.env.REACT_APP_IS_DEV,
  })
  const songs = songsQuery.data?.map(d => d.fields) as SongWithId[] | undefined

  const addSongMutation = useMutation(createSong)
  const deleteSongMutation = useMutation(deleteSong)
  const updateSongMutation = useMutation(updateSong)
  
  const addSong = (song: BasicSong) => {
    // TODO make optimistic update
    addSongMutation.mutate(song, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const removeSong = (id: string) => {
    deleteSongMutation.mutate(id, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const editSong = (song: SongWithId) => {
    // TODO make optimistic update
    updateSongMutation.mutate(song, {
      onSuccess: () => songsQuery.refetch()
    })
  }

  const value = {
    songs,
    addSong,
    removeSong,
    editSong,
    isSuccess: songsQuery.isSuccess,
    isLoading: songsQuery.isLoading,
  }

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  )
}