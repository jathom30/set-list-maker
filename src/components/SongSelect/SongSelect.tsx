import React, { useContext } from "react";
import { Label } from "components";
import Select from "react-select";
import { SetlistContext, SongsContext } from "context";
import './SongSelect.scss'

export const SongSelect = ({label, onChange}: {label: string; onChange: (id: string) => void}) => {
  const {songs} = useContext(SongsContext)
  const {setlistIds} = useContext(SetlistContext)

  // reduce all songs across sets to one flat array of songs
  const allUsedSongIds = Object.keys(setlistIds).reduce((all: string[], id) => [
    ...all,
    ...setlistIds[id]
  ], [])
  // only show songs that are not currently in use
  const unusedSongs = songs.filter(song => allUsedSongIds.every(id => id !== song.id))

  return (
    <div className="SongSelect">
      <Label>{label}</Label>
      <Select
        getOptionLabel={(option) => option.name}
        getOptionValue={option => option.id}
        options={unusedSongs}
        onChange={(newValue) => newValue?.id && onChange(newValue.id)}
        autoFocus
      />
    </div>
  )
}