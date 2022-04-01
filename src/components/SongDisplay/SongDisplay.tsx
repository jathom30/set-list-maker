import React, { ReactNode, useContext, useRef, useState } from "react";
import { Dial, FlexBox, Modal, SongForm, Button, Popover, SongSelect } from "components";
import './SongDisplay.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faEdit, faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { SongsContext, SetlistContext } from "context";
import { useOnClickOutside } from "hooks";
import { GridBox } from "components/Box";
import { BasicSong, SongWithId } from "types";

export const SongDisplay = ({song, setlistId, index, isDisabled = false, children}: {song: SongWithId; setlistId: string; index: number; isDisabled?: boolean; children?: ReactNode}) => {
  const [showPopover, setShowPopover] = useState(false)
  const [showSongList, setShowSongList] = useState(false)
  const popperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [showAddSong, setShowAddSong] = useState(false)
  const {editSong} = useContext(SongsContext)
  const {replaceSongId, removeSongId} = useContext(SetlistContext)

  const handeEdit = (song: SongWithId | BasicSong) => {
    // double check that id is present when editing
    const songWithId = song as SongWithId
    if (songWithId?.id) {
      editSong(songWithId)
    }
    setShowAddSong(false)
  }

  const handleShowAddSong = () => {
    setShowAddSong(true)
    setShowPopover(false)
  }

  const handleReplaceSong = (newId: string) => {
    replaceSongId(song.id, newId, setlistId)
  }

  const handleRemoveSong = () => {
    removeSongId(song.id, setlistId)
  }

  useOnClickOutside(popperRef, () => setShowPopover(false))

  return (
    <div className={`SongDisplay SongDisplay--${song.feel} ${(showPopover || showSongList || showAddSong) ? 'SongDisplay--is-editing' : ''}`}>
      <GridBox alignItems="center" gridTemplateColumns="1fr min-content">
        <FlexBox alignItems="center" gap=".5rem" paddingLeft={!children ? '1rem' : ''}>
          {children}
          <p className="SongDisplay__name"><span>{index + 1}.</span></p>
          <p className="SongDisplay__name">{song.name}</p>
          {!isDisabled && (
            <Popover
              position={['right', 'bottom']}
              align="start"
              content={
                <div className="SongDisplay__popover" ref={popperRef}>
                  <FlexBox flexDirection="column" gap=".5rem" padding="1rem" alignItems="flex-start">
                    <Button width="100%" kind="secondary" icon={faEdit} onClick={handleShowAddSong}>
                      Details
                    </Button>
                    <Button width="100%" kind="secondary" icon={faArrowRightArrowLeft} onClick={() => {setShowSongList(true); setShowPopover(false)}}>
                      Replace
                    </Button>
                    <Button width="100%" kind="danger" icon={faTrash} onClick={handleRemoveSong}>
                      Remove
                    </Button>
                  </FlexBox>
                </div>
              }
              isOpen={showPopover}
            >
              <div ref={buttonRef}>
                <Button kind="secondary" isRounded onClick={() => setShowPopover(true)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Button>
              </div>
            </Popover>
          )}
        </FlexBox>
        <FlexBox alignItems="center" gap="1rem" paddingRight="1rem">
          {song.isCover && <p className="SongDisplay__cover">Cover</p>}
          <Dial tempo={song.tempo} />
        </FlexBox>
      </GridBox>
      {showAddSong && (
        <Modal offClick={() => setShowAddSong(false)}>
          <SongForm label="Edit Song" defaultSong={song} onSave={handeEdit} onCancel={() => setShowAddSong(false)} />
        </Modal>
      )}
      {showSongList && (
        <Modal offClick={() => setShowSongList(false)}>
          <SongSelect label="Replace song" onChange={handleReplaceSong} />
        </Modal>
      )}
    </div>
  )
}
