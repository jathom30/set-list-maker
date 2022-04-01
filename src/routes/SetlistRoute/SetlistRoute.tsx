import React, { useContext, useState } from "react";
import { faClone, faGripVertical, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumbs, Button, FlexBox, Input, LabelInput, Loader, MaxHeightContainer, Modal, Setlist } from "components";
import './SetlistRoute.scss'
import { SetlistContext, SongsContext } from "context";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getParentList } from "api";

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


export const SetlistRoute = ({isMobile}: {isMobile: boolean}) => {
  const {id} = useParams()
  const {isSuccess} = useContext(SongsContext)
  const {setlistIds, setSetlistIds, setSetlists, saveSetlists, updateSetlists, removeSetlist} = useContext(SetlistContext)
  const [showSaveSetlist, setShowSaveSetlist] = useState(false)
  const [setlistName, setSetlistName] = useState('')
  const [detectChange, setDetectChange] = useState(false)
    
  const parentListQuery = useQuery(['parent-list', id], () => getParentList(id || ''), {
    enabled: isSuccess,
    onSuccess: (data) => {
      const parentList = data.fields 
      const setlists = JSON.parse((parentList?.setlists || '' ) as string)
      setSetlists(setlists)
      const ids: string[] = JSON.parse((parentList?.setlistIds || '') as string)
      setSetlistIds(ids)
      const name = parentList?.name as string | undefined
      setSetlistName(name || '')
    }
  })
  
  const handleRemoveSetlist = (setlistId: string) => {
    removeSetlist(setlistId)
    setDetectChange(true)
  }

  const handleAddSong = (setlistId: string, songId: string) => {
    if (!id) return
    setSetlists(prevSetlists => {
      return {
        ...prevSetlists,
        [setlistId]: [...prevSetlists[setlistId], songId]
      }
    })
    setDetectChange(true)
  }

  const handleCancelChange = () => {
    parentListQuery.refetch()
    setDetectChange(false)
  }

  const handleSave = () => {
    saveSetlists(setlistName)
    setDetectChange(false)
  }

  const handleReplace = () => {
    if (!id) return
    updateSetlists(id, setlistName)
    setDetectChange(false)
  }

  const handleEditName = (val: string | number) => {
    setSetlistName(val.toString())
    if (!id) return
    updateSetlists(id, val.toString())
  }

  // handles both SETLIST and SONG drag and drop
  const handleDragEnd = (result: DropResult) => {
    const {type} = result
    if (type === 'SETLIST') {
      setSetlistIds(prevIds => {
        if (!(result.destination && prevIds)) {
          return prevIds
        }
        const newOrder = reorder(
          prevIds,
          result.source.index,
          result.destination.index,
        )
        // if original lists dont match new lists, a change occured, ask user if they want to save change
        setDetectChange(JSON.stringify(newOrder) !== JSON.stringify(prevIds))
        return newOrder
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
          const newLists = {
            ...prevSetlists,
            [sourceSetlistId]: reorder(
              prevSetlists[sourceSetlistId],
              result.source.index,
              result.destination.index
            )
          }
          // if original lists dont match new lists, a change occured, ask user if they want to save change
          setDetectChange(JSON.stringify(newLists) !== JSON.stringify(prevSetlists))
          return newLists
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
        const newLists = {
          ...prevSetlists,
          [sourceSetlistId]: updatedSourceList,
          [destinationSetlistId]: updatedDestinationList,
        }
        // if original lists dont match new lists, a change occured, ask user if they want to save change
        setDetectChange(JSON.stringify(newLists) !== JSON.stringify(prevSetlists))
        return newLists
      })
    }
  }

  if (parentListQuery.isLoading) {
    return (
      <div className="SetlistRoute">
        <FlexBox alignItems="center" justifyContent="center" padding="3rem">
          <Loader size="l" />
        </FlexBox>
      </div>
    )
  }
  if (parentListQuery.isSuccess) {
    return (
      <div className="SetlistRoute">
        <MaxHeightContainer
          fullHeight
          header={
            <FlexBox padding="1rem" alignItems="center" justifyContent="space-between">
              <Breadcrumbs currentRoute={
                <LabelInput value={setlistName} onSubmit={handleEditName}>
                  <span className="Breadcrumbs__crumb">{setlistName}</span>
                </LabelInput>
              } />
            </FlexBox>
          }
          footer={detectChange &&
            <div className="SetlistRoute__footer">
              <FlexBox gap="1rem" justifyContent="flex-end">
                <Button onClick={handleCancelChange}>Cancel</Button>
                <Button onClick={handleReplace} icon={faSave} kind="primary">Save</Button>
                <Button onClick={() => setShowSaveSetlist(true)} icon={faClone} kind="secondary">Save as New</Button>
              </FlexBox>
              {showSaveSetlist && (
                <Modal>
                  <div className="SetlistRoute__save-list-modal">
                    <Input value={setlistName} onChange={(val) => setSetlistName(val)} name="setlist-name" label="Name" />
                    <FlexBox justifyContent="flex-end" gap="1rem">
                      <Button onClick={() => setShowSaveSetlist(false)} kind="text">Cancel</Button>
                      <Button isDisabled={setlistName === ''} onClick={handleSave} icon={faSave} kind="primary">Save</Button>
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
  return <div />
}
