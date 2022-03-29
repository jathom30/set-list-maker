import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, GridBox, Modal, Setlist, SetlistForm } from "components";
import React, { useContext, useState } from "react";
import './SetlistRoute.scss'
import { SetlistContext } from "context/SetlistContext";

export const SetlistRoute = () => {
  const [showCreateSetlist, setShowCreateSetlist] = useState(false)
  const {setlistIds, createSetlist} = useContext(SetlistContext)

  const handleSave = (length: number, count: number) => {
    setShowCreateSetlist(false)
    createSetlist(length, count)
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
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
          {Object.keys(setlistIds)?.map((setlistId, index) => (
            <Setlist key={setlistId} id={setlistId} label={`${index+1}`} />
          ))}
        </GridBox>
      </FlexBox>
      {showCreateSetlist && (
        <Modal offClick={() => setShowCreateSetlist(false)}>
          <SetlistForm onSave={handleSave} />
        </Modal>
      )}
    </div>
  )
}