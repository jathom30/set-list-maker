import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexBox, Button, Label, UpDownInput } from "components";
import React, { ChangeEvent, useState } from "react";
import './SetlistForm.scss'

export const SetlistForm = ({onSave}: {onSave: (length: number, count: number, covers: boolean) => void}) => {
  const [includeCovers, setIncludeCovers] = useState(true)
  const [length, setLength] = useState(45)
  const [count, setCount] = useState(1)

  const handleSave = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(length, count, includeCovers)
  }

  const isValid = length > 0 && count > 0
  return (
    <div className="SetlistForm">
      <form onSubmit={handleSave}>
        <FlexBox flexDirection="column" padding="1rem" gap="1rem">
          <h3>Create Setlist</h3>
          <UpDownInput label="Set length (in minutes)" initialValue={length} onChange={setLength} name="set-length" />
          <UpDownInput label="Number of sets" initialValue={count} onChange={setCount} name="set-count" />
          <label htmlFor="covers">
            <FlexBox alignItems="center" gap=".5rem">
              <Label>Include Covers?</Label>
              <input id="covers" type="checkbox" checked={includeCovers} onChange={e => setIncludeCovers(e.target.checked)} />
            </FlexBox>
          </label>
          <Button isDisabled={!isValid} kind="primary" type="submit">
            <FlexBox gap=".5rem">
              <FontAwesomeIcon icon={faSave} />
              Create
            </FlexBox>
          </Button>
        </FlexBox>
      </form>
    </div>
  )
}