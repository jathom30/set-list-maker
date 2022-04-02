import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, Label } from "components";
import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from "react";
import './UpDownInput.scss'

export const UpDownInput = ({label, name, initialValue, onChange}: {label: string; name: string; initialValue: number; onChange: (val: number) => void}) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    onChange(value)
  }, [value, onChange])

  const handleDecrease = () => {
    setValue(prevVal => {
      if (prevVal <= 0) return 0
      return prevVal - 1
    })
  }

  const handleIncrease = () => {
    setValue(prevVal => prevVal + 1)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Math.abs(parseInt(e.target.value)) || 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
      case 'ArrowUp':
        handleIncrease()
        break;
      case 'ArrowDown':
        handleDecrease()
        break;
      default:
        break;
    }
  }

  return (
    <div className="UpDownInput">
      <FlexBox flexDirection="column" gap="0.5rem">
        <Label>{label}</Label>
        <FlexBox gap="0.25rem">
          <Button isDisabled={value <= 0} onClick={handleDecrease} kind="secondary" isRounded icon={faAngleLeft} />
          <input
            name={name}
            className="UpDownInput__input"
            value={value}
            type="text" onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleIncrease} kind="secondary" isRounded icon={faAngleRight} />
        </FlexBox>
      </FlexBox>
    </div>
  )
}