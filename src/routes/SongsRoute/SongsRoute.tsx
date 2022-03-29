import React, { useContext, useState } from "react";
import { Button, FlexBox, Modal, SongForm } from "components";
import { SongsContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Song } from "types";

export const SongsRoute = () => {
  const {songs, addSong} = useContext(SongsContext)
  const [showAddSong, setShowAddSong] = useState(false)

  const handleSave = (song: Song) => {
    setShowAddSong(false)
    addSong(song)
  }

  return (
    <div className="SongsRoute">
      <FlexBox flexDirection='column' gap=".5rem" padding='1rem'>
        <FlexBox alignItems="center" justifyContent="space-between">
          <h1>Song List</h1>
          <Button kind="secondary" isRounded onClick={() => setShowAddSong(true)}>
            <FlexBox paddingLeft="0.25rem" paddingRight="0.25rem" gap=".5rem">
            <FontAwesomeIcon icon={faPlusCircle}/>
            <span>Add Song</span>
            </FlexBox>
          </Button>
        </FlexBox>
        {songs?.map(song => (
          <p key={song.id}>{song.name}</p>
        ))}
      </FlexBox>
      {showAddSong && (
        <Modal offClick={() => setShowAddSong(false)}>
          <SongForm label="Create New Song" onSave={handleSave} />
        </Modal>
      )}
    </div>
  )
}