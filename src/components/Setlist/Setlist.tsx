import { faEllipsisVertical, faGrip, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongDisplay } from 'components';
import { FlexBox, Button, Modal, SongSelect, Popover } from 'components';
import { SetlistContext, SongsContext } from 'context';
import { useOnClickOutside } from 'hooks';
import React, { ReactNode, useContext, useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './Setlist.scss'

export const Setlist = ({id, label, dragHandle, onRemoveSetlist, onAddSong}: {
  id: string;
  label: string;
  dragHandle: ReactNode;
  onRemoveSetlist: (setlistId: string) => void;
  onAddSong: (setlistId: string, songId: string) => void;
}) => {
  const [showPopover, setShowPopover] = useState(false)
  const popperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const [showSongSelect, setShowSongSelect] = useState(false)
  const {setlists} = useContext(SetlistContext)
  const {songs, isSuccess} = useContext(SongsContext)

  const setlist = setlists[id]?.map(songId => songs?.find(song => song.id === songId))
  const setlistLength = setlist?.reduce((total, song) => total += (song?.length || 0), 0)

  const handleSongSelect = (newSongId: string) => {
    onAddSong(id, newSongId)
    setShowSongSelect(false)
  }

  const handleShowAddSong = () => {
    setShowSongSelect(true)
    setShowPopover(false)
  }

  const handleRemoveSetlist = () => {
    onRemoveSetlist(id)
    setShowPopover(false)
  }

  const setlistCount = Object.keys(setlists).length

  useOnClickOutside(popperRef, () => setShowPopover(false))

  return (
    <div className="Setlist">
      <FlexBox gap="1rem" flexDirection='column'>
        <FlexBox alignItems="center" justifyContent="space-between" padding="0 .5rem">
          <FlexBox alignItems="center" gap="0.5rem">
            {dragHandle}
            <h4>{label}</h4>
            <p>{setlistLength} min</p>
          </FlexBox>
          <Popover
            position={['left']}
            align="start"
            content={
              <div ref={popperRef} className='Setlist__popover'>
                <FlexBox flexDirection="column" gap=".5rem" padding="1rem" alignItems="flex-start">
                  <Button width='100%' kind="secondary" icon={faPlus} onClick={handleShowAddSong}>
                    Add Song
                  </Button>
                  {setlistCount > 1 && (
                    <Button width='100%' kind="danger" icon={faTrash} onClick={handleRemoveSetlist}>
                      Remove set
                    </Button>
                  )}
                </FlexBox>
              </div>
            }
            isOpen={showPopover}
          >
            <div ref={buttonRef}>
              <Button isRounded onClick={() => setShowPopover(true)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            </div>
          </Popover>
        </FlexBox>
        <Droppable droppableId={id} type="SONG" direction="vertical">
          {(provided, snapshot) => (
            <div
              className={`Setlist__droppable ${snapshot.isDraggingOver ? 'Setlist__droppable--is-dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {isSuccess && setlist?.map((song, i) => (
                <Draggable key={song?.id} draggableId={song?.id || ''} index={i}>
                  {(provided) => (
                    <div
                      className="Setlist__draggable"
                      ref={provided.innerRef} {...provided.draggableProps}
                    >
                      {song && (
                        <SongDisplay song={song} index={i} setlistId={id}>
                          <div className='Setlist__song-handle' {...provided.dragHandleProps}>
                            <FontAwesomeIcon icon={faGrip} />
                          </div>
                        </SongDisplay>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </FlexBox>
      {showSongSelect && (
        <Modal offClick={() => setShowSongSelect(false)}>
          <SongSelect label="Add song" onChange={handleSongSelect} />
        </Modal>
      )}
    </div>
  )
}