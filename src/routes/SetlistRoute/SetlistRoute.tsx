import React, { useContext } from "react";
import { faGripVertical, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, MaxHeightContainer, Setlist, SetlistForm } from "components";
import './SetlistRoute.scss'
import { SetlistContext } from "context";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const SetlistRoute = ({isMobile}: {isMobile: boolean}) => {
  const {setlistIds, setSetlistIds, setSetlists, createSetlist, removeSetlist} = useContext(SetlistContext)

  const handleRemoveAll = () => {
    setlistIds.forEach(id => removeSetlist(id))
  }

  // handles both SETLIST and SONG drag and drop
  const handleDragEnd = (result: DropResult) => {
    const {type} = result
    if (type === 'SETLIST') {
      setSetlistIds(prevIds => {
        if (!(result.destination && prevIds)) {
          return prevIds
        }
        return reorder(
          prevIds,
          result.source.index,
          result.destination.index,
        )
      })
    }
    if (type === 'SONG') {
      setSetlists(prevSetlists => {
        if (!result.destination) {
          return prevSetlists
        }
        const destinationSetlistId = result.destination.droppableId
        const sourceSetlistId = result.source.droppableId
        // if dragging and dropping within the same container
        if (result.destination.droppableId === result.source.droppableId) {
          return {
            ...prevSetlists,
            [sourceSetlistId]: reorder(
              prevSetlists[sourceSetlistId],
              result.source.index,
              result.destination.index
            )
          }
        }
        // if dragging and dropping between two different containers
        // remove id from source
        const updatedSourceList = prevSetlists[sourceSetlistId].filter(songId => songId !== result.draggableId)
        // add to destination
        const updatedDestinationList = [
          ...prevSetlists[destinationSetlistId].slice(0, result.destination.index),
          result.draggableId,
          ...prevSetlists[destinationSetlistId].slice(result.destination.index)
        ]
        return {
          ...prevSetlists,
          [sourceSetlistId]: updatedSourceList,
          [destinationSetlistId]: updatedDestinationList,
        }
      })
    }
  }

  if (setlistIds.length === 0) {
    return (
      <div className="SetlistRoute">
        <FlexBox gap="1rem" flexDirection="column">
          <h1>Setlist</h1>
          <SetlistForm onSave={createSetlist} />
        </FlexBox>
      </div>
    )
  }

  return (
    <div className="SetlistRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding=".5rem" alignItems="center" justifyContent="space-between">
            <h1>Setlist</h1>
            <Button kind="danger" isRounded onClick={handleRemoveAll}>
              <FlexBox paddingLeft="0.25rem" paddingRight="0.25rem" gap=".5rem">
              <FontAwesomeIcon icon={faRotate}/>
              <span>Reset</span>
              </FlexBox>
            </Button>
          </FlexBox>
        }
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="setlistId" type="SETLIST" direction={isMobile ? "vertical" : "horizontal"}>
            {(provided) => (
              <div className="SetlistRoute__droppable" ref={provided.innerRef} {...provided.droppableProps}>
                {setlistIds?.map((setlistId, index) => (
                  <Draggable key={setlistId} draggableId={setlistId} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Setlist
                          key={setlistId}
                          id={setlistId}
                          label={`${index+1}`}
                          dragHandle={
                            <div {...provided.dragHandleProps}>
                              <FontAwesomeIcon icon={faGripVertical} />
                            </div>
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </MaxHeightContainer>
    </div>
  )
}