import { faGrip, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongDisplay } from 'components';
import { FlexBox, Button, Modal, SongSelect } from 'components';
import { SetlistContext, SongsContext } from 'context';
import React, { useContext, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Song } from 'types';
import './Setlist.scss'

export const Setlist = ({id, label}: {id: string; label: string}) => {
  const [showSongSelect, setShowSongSelect] = useState(false)
  const {setlistIds, setSetlistIds} = useContext(SetlistContext)
  const {songs} = useContext(SongsContext)

  const setlist: Song[] = setlistIds[id].map(songId => songs.find(song => song.id === songId) as Song)

  const handleSongSelect = (newSongId: string) => {
    setSetlistIds(prevSetlistIds => {
      return {
        ...prevSetlistIds,
        [id]: [...prevSetlistIds[id], newSongId]
      }
    })
  }
  return (
    <div className="Setlist">
      <FlexBox gap="1rem" flexDirection='column'>
        <FlexBox alignItems="center" justifyContent="space-between">
          <h4>{label}</h4>
          <Button isRounded onClick={() => setShowSongSelect(true)} icon={faPlus} kind="primary">Add song</Button>
        </FlexBox>
        <Droppable droppableId={id} direction="vertical">
          {(provided, snapshot) => (
            <div className={`Setlist__droppable ${snapshot.isDraggingOver ? 'Setlist__droppable--is-dragging-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
              {setlist?.map((song, i) => (
                <Draggable key={song.id} draggableId={song.id} index={i}>
                  {(provided) => (
                    <div
                      className="Setlist__draggable"
                      ref={provided.innerRef} {...provided.draggableProps}
                    >
                      <SongDisplay song={song} setlistId={id}>
                        <div className='NodeContainer__btn NodeContainer__btn--handle' {...provided.dragHandleProps}>
                          <FontAwesomeIcon icon={faGrip} />
                        </div>
                      </SongDisplay>
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