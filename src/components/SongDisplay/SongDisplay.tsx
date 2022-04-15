import React, { ReactNode, useContext, useRef, useState } from "react";
import { Dial, FlexBox, Modal, SongForm, Button, Popover, SongSelect } from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faCaretDown, faCaretRight, faEdit, faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { SongsContext, SetlistContext } from "context";
import { useOnClickOutside } from "hooks";
import { BasicSong, SongWithId } from "types";
import './SongDisplay.scss'
import { Label } from "components/Label";
import { GridBox } from "components/Box";
import { capitalizeFirstLetter } from "helpers";

export const SongDisplay = ({song, setlistId, index, isPreview = false, children}: {song: SongWithId; setlistId: string; index: number; isPreview?: boolean; children?: ReactNode}) => {
  const [showPopover, setShowPopover] = useState(false)
  const [showSongList, setShowSongList] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const popperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [showAddSong, setShowAddSong] = useState(false)
  const {editSong} = useContext(SongsContext)
  const {replaceSongId, removeSongId} = useContext(SetlistContext)
  const detailsRef = useRef<HTMLDivElement>(null)

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

  useOnClickOutside([popperRef, buttonRef], () => setShowPopover(false))
  useOnClickOutside(detailsRef, () => setShowDetails(false))

  return (
    <div className={`SongDisplay ${(showPopover || showSongList || showAddSong) ? 'SongDisplay--is-editing' : ''}`}>
      <FlexBox alignItems="center" justifyContent="space-between" gap="0.5rem">
        <div className={`SongDisplay__left ${!children ? 'SongDisplay__left--no-child' : ''}`}>
          {children}
          <p className="SongDisplay__index">{index + 1}.</p>
          <p className="SongDisplay__name">{song.name}</p>
          {!isPreview && <Button kind="secondary" onClick={() => setShowDetails(!showDetails)} isRounded icon={showDetails ? faCaretDown : faCaretRight} />}
        </div>
        {!isPreview && (
          <FlexBox alignItems="center" gap=".5rem" paddingRight=".5rem">
            {song.isCover && <p className="SongDisplay__cover">Cover</p>}
            {/* {song.placement !== 'other' && (
              <div className="SongDisplay__position">
                {song.placement === 'closer' && <FontAwesomeIcon icon={faStepForward} />}
                {song.placement === 'opener' && <FontAwesomeIcon icon={faStepBackward} />}
              </div>
            )} */}
            <Dial tempo={song.tempo} />
            <Popover
              position={['left', 'bottom']}
              align="start"
              content={
                <div className="SongDisplay__popover" ref={popperRef}>
                  <FlexBox flexDirection="column" gap=".5rem" padding="1rem" alignItems="flex-start">
                    <Button width="100%" kind="secondary" icon={faEdit} onClick={handleShowAddSong}>
                      Edit details
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
                <Button kind="secondary" isRounded onClick={() => setShowPopover(!showPopover)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Button>
              </div>
            </Popover>
          </FlexBox>
        )}
      </FlexBox>
      {showDetails && (
        <div ref={detailsRef} className="SongDisplay__details">
          <GridBox gridTemplateColumns="1fr 1fr 1fr" gap="1rem">
            <FlexBox flexDirection="column">
              <Label>Placement</Label>
              <span>{capitalizeFirstLetter(song.placement)}</span>
            </FlexBox>
            <FlexBox flexDirection="column">
              <Label>Length</Label>
              <span>{song.length} minutes</span>
            </FlexBox>
            {song.key && <FlexBox flexDirection="column">
              <Label>Key</Label>
              <span>{song.key}</span>
            </FlexBox>}
          </GridBox>
          <FlexBox flexDirection="column">
            <Label>Feel</Label>
            {song.feel.map(f => (
              <span key={f} >{f}</span>
            ))}
          </FlexBox>
          {song.notes && <FlexBox flexDirection="column">
            <Label>Notes</Label>
            <span>{song.notes}</span>
          </FlexBox>}
        </div>
      )}
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


// TODO feel pills