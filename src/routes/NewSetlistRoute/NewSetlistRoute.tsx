import { faGripVertical, faRotate, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumbs, Button, FlexBox, Input, LabelInput, MaxHeightContainer, Modal, Setlist } from "components";
import { SetlistContext } from "context";
import React, { useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { reorder } from "routes/SetlistRoute";
import './NewSetlistRoute.scss'

export const NewSetlistRoute = ({isMobile}: {isMobile: boolean}) => {
  const [showSaveSetlist, setShowSaveSetlist] = useState(false)
  const {name, setName, setlistIds, setSetlistIds, setSetlists, saveSetlists, removeSetlist, createSetlist} = useContext(SetlistContext)
  const params = useParams()

  const handleSave = () => {
    saveSetlists(name)
    setShowSaveSetlist(false)
  }

  const handleRefresh = () => {
    const {length, count, covers} = params
    const includeCovers = covers === 'true'
    setName('New setlist')
    createSetlist(parseInt(length || ''), parseInt(count || ''), includeCovers)
  }

  const handleRemoveSetlist = (setlistId: string) => {
    removeSetlist(setlistId)
  }

  const handleAddSong = (setlistId: string, songId: string) => {
    setSetlists(prevSetlists => {
      return {
        ...prevSetlists,
        [setlistId]: [...prevSetlists[setlistId], songId]
      }
    })
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

  return (
    <div className="NewSetlistRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding="1rem" alignItems="center" justifyContent="space-between">
            <Breadcrumbs currentRoute={
              <LabelInput value={name} onSubmit={val => setName(val.toString())}>
                <span className="Breadcrumbs__crumb">{name}</span>
              </LabelInput>
            } />
            <Button kind="secondary" isRounded onClick={handleRefresh}>
              <FlexBox paddingLeft="0.25rem" paddingRight="0.25rem" gap=".5rem">
              <FontAwesomeIcon icon={faRotate}/>
              <span className="Breadcrumbs__back--desktop">Refresh</span>
              </FlexBox>
            </Button>
          </FlexBox>
        }
        footer={
          <div className="SetlistRoute__footer">
            <Button onClick={() => setShowSaveSetlist(true)} icon={faSave} kind="primary">
              <span className="Breadcrumbs__back--desktop">Save</span>
            </Button>
            {showSaveSetlist && (
              <Modal>
                <div className="SetlistRoute__save-list-modal">
                  <Input label="Setlist Name" value={name} onChange={val => setName(val)} name="setlist-name" />
                  <FlexBox justifyContent="flex-end" gap="1rem">
                    <Button onClick={() => setShowSaveSetlist(false)} kind="text">Cancel</Button>
                    <Button onClick={handleSave} icon={faSave} kind="primary">Save</Button>
                  </FlexBox>
                </div>
              </Modal>
            )}
          </div>
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
                          onRemoveSetlist={handleRemoveSetlist}
                          onAddSong={handleAddSong}
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