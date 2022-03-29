import { faGrip, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, FlexBox, Modal, SetlistForm, SongDisplay } from "components";
import { SongsContext } from "context";
import React, { useContext, useState } from "react";
import { Song } from "types";
import './SetlistRoute.scss'
import { SetlistContext } from "context/SetlistContext";

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const SetlistRoute = () => {
  const [showCreateSetlist, setShowCreateSetlist] = useState(false)
  const {setlistIds, setSetlistIds, createSetlist} = useContext(SetlistContext)
  const {songs} = useContext(SongsContext)

  const handleSave = (length: number, count: number) => {
    setShowCreateSetlist(false)
    createSetlist(length)
  }

  const handleDragEnd = (result: DropResult) => {
    setSetlistIds(prevSetlist => {
      // dropped outside the list
      if (!result.destination) {
        return prevSetlist;
      }
      return reorder(
        prevSetlist || [],
        result.source.index,
        result.destination?.index,
      )
    })
  }

  const setlist = setlistIds.map(id => songs.find(s => s.id === id) as Song)

  return (
    <div className="SetlistRoute">
      <FlexBox flexDirection='column' gap=".5rem" padding='1rem'>
        <FlexBox alignItems="center" justifyContent="space-between">
          <h1>Setlist</h1>
          <Button kind="secondary" isRounded onClick={() => setShowCreateSetlist(true)}>
            <FlexBox paddingLeft="0.25rem" paddingRight="0.25rem" gap=".5rem">
            <FontAwesomeIcon icon={faPlusCircle}/>
            <span>Create Setlist</span>
            </FlexBox>
          </Button>
        </FlexBox>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div className="SetlistRoute__droppable" ref={provided.innerRef} {...provided.droppableProps}>
                {setlist?.map((song, i) => (
                  <Draggable key={song.id} draggableId={song.id} index={i}>
                    {(provided) => (
                      <div className="SetlistRoute__draggable" ref={provided.innerRef} {...provided.draggableProps}>
                        <SongDisplay song={song}>
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
        </DragDropContext>
      </FlexBox>
      {showCreateSetlist && (
        <Modal offClick={() => setShowCreateSetlist(false)}>
          <SetlistForm onSave={handleSave} />
        </Modal>
      )}
    </div>
  )
}