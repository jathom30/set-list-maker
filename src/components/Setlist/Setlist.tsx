import { faGrip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongDisplay } from 'components';
import { SetlistContext, SongsContext } from 'context';
import React, { useContext } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Song } from 'types';
import './Setlist.scss'

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const Setlist = ({id, label}: {id: string; label: string}) => {
  const {setlistIds, setSetlistIds} = useContext(SetlistContext)
  const {songs} = useContext(SongsContext)

  const handleDragEnd = (result: DropResult) => {
    setSetlistIds(prevSetlists => {
      if (!result.destination) {
        return prevSetlists
      }
      return {
        ...prevSetlists,
        [id]: reorder(
          prevSetlists[id],
          result.source.index,
          result.destination?.index
        )
      }
    })
  }
  const setlist: Song[] = setlistIds[id].map(songId => songs.find(song => song.id === songId) as Song)

  return (
    <div className="Setlist">
      <h4>{label}</h4>
      <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div className="Setlist__droppable" ref={provided.innerRef} {...provided.droppableProps}>
                {setlist?.map((song, i) => (
                  <Draggable key={song.id} draggableId={song.id} index={i}>
                    {(provided) => (
                      <div className="Setlist__draggable" ref={provided.innerRef} {...provided.draggableProps}>
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
        </DragDropContext>
    </div>
  )
}