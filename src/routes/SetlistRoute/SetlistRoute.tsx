import React, { useContext, useState } from "react";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, GridBox, Modal, Setlist, SetlistForm } from "components";
import './SetlistRoute.scss'
import { SetlistContext } from "context";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const SetlistRoute = () => {
  const [showCreateSetlist, setShowCreateSetlist] = useState(false)
  const {setlistIds, setSetlistIds, createSetlist} = useContext(SetlistContext)

  const handleSave = (length: number, count: number) => {
    setShowCreateSetlist(false)
    createSetlist(length, count)
  }

  const handleDragEnd = (result: DropResult) => {
    setSetlistIds(prevSetlists => {
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
            result.destination?.index
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
          <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
            {Object.keys(setlistIds)?.map((setlistId, index) => (
              <Setlist key={setlistId} id={setlistId} label={`${index+1}`} />
            ))}
          </GridBox>
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