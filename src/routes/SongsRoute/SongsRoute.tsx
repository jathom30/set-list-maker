import React, { useContext, useState } from "react";
import { Button, FlexBox, Modal, SongForm, SongsTable } from "components";
import { SongsContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Song } from "types";
import './SongsRoute.scss'

export const SongsRoute = () => {
  const {addSong} = useContext(SongsContext)
  const [showAddSong, setShowAddSong] = useState(false)
  
  const handleSave = (song: Song) => {
    setShowAddSong(false)
    addSong(song)
  }

  return (
    <div className="SongsRoute">
      <FlexBox alignItems="center" justifyContent="space-between">
        <h1>Song List</h1>
        <Button kind="primary" isRounded onClick={() => setShowAddSong(true)}>
          <FlexBox paddingLeft="0.25rem" paddingRight="0.25rem" gap=".5rem">
          <FontAwesomeIcon icon={faPlusCircle}/>
          <span>Add Song</span>
          </FlexBox>
        </Button>
      </FlexBox>
      <SongsTable />
      {showAddSong && (
        <Modal offClick={() => setShowAddSong(false)}>
          <SongForm label="Create New Song" onSave={handleSave} onCancel={() => setShowAddSong(false)} />
        </Modal>
      )}
    </div>
  )
}
