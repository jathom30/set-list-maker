import React, { useContext, useState } from "react";
import { Button, FlexBox, Modal, SongForm, SongsTable } from "components";
import { SongsContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import './SongsRoute.scss'
import { BasicSong, SongWithId } from "types";

export const SongsRoute = () => {
  const {addSong} = useContext(SongsContext)
  const [showAddSong, setShowAddSong] = useState(false)
  
  const handleSave = (song: BasicSong | SongWithId) => {
    const basicSong = song as BasicSong
    const songWithId = song as SongWithId
    // double check there is no id before being added to db
    if (songWithId?.id) return
    addSong(basicSong)
    setShowAddSong(false)
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
