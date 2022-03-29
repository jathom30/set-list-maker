import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexBox, Input, Button } from "components";
import React, { useState } from "react";
import './SetlistForm.scss'

export const SetlistForm = ({onSave}: {onSave: (length: number, count: number) => void}) => {
  const [length, setLength] = useState(45)
  const [count, setCount] = useState(1)

  const handleSave = () => {
    onSave(length, count)
  }

  const isValid = length > 0 && count > 0
  return (
    <div className="SetlistForm">
      <FlexBox flexDirection="column" padding="1rem" gap="1rem">
        <h3>Create Setlist</h3>
        <Input label="Set length (in minutes)" value={length} onChange={(val) => setLength(parseInt(val))} name="set-length" />
        <Input label="Number of sets" value={count} onChange={(val) => setCount(parseInt(val))} name="set-length" />
        <Button isDisabled={!isValid} kind="primary" onClick={handleSave}>
          <FlexBox gap=".5rem">
            <FontAwesomeIcon icon={faSave} />
            Create
          </FlexBox>
        </Button>
      </FlexBox>
    </div>
  )
}