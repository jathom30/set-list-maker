import React, { useState } from "react";
import { FlexBox, Input, Label, Button } from "components";
import './SongForm.scss'
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Feel, Song, SongPlacement } from "types";
import {v4 as uuid} from 'uuid'
import { GridBox } from "components/Box";

const songFeels: Feel[] = ['ballad', 'chill', 'medium', 'up', 'burner']
const songPlacements: SongPlacement[] = ['opener', 'closer', 'other']

export const SongForm = ({label, onSave, defaultSong}: {label: string; onSave: (song: Song) => void; defaultSong?: Song}) => {
  const [name, setName] = useState(defaultSong?.name || '')
  const [length, setLength] = useState(defaultSong?.length || 0)
  const [placement, setPlacement] = useState<SongPlacement | undefined>(defaultSong?.placement)
  const [feel, setFeel] = useState<Feel>(defaultSong?.feel || 'medium')
  const [isCover, setIsCover] = useState(defaultSong?.isCover || false)

  const isValid = name !== '' && length > 0 && placement

  const handleSave = () => {
    onSave({
      name,
      length,
      placement: placement || 'other',
      feel,
      isCover,
      id: defaultSong?.id || uuid()
    })
  }

  return (
    <div className="SongForm">
      <FlexBox flexDirection="column" padding="1rem" gap="1rem">
        <FlexBox alignItems="center" justifyContent="space-between">
          <h3>{label}</h3>
          <label htmlFor="cover">
            <FlexBox alignItems="center" gap="0.25rem">
              <Label>Cover</Label>
              <input id="cover" type="checkbox" checked={isCover} onChange={(e) => setIsCover(e.target.checked)} />
            </FlexBox>
          </label>
        </FlexBox>
        <Input label="Song name" value={name} onChange={(val) => setName(val)} name="song-name" />
        <Input label="Approx. song length (in minutes)" value={length} onChange={(val) => setLength(parseFloat(val))} name="song-length" />
        <FlexBox flexDirection="column" gap="0.25rem">
          <Label>Preferred placement</Label>
          <Select
            defaultValue={placement && {label: placement, value: placement}}
            onChange={(newValue) => newValue && setPlacement(newValue.value)}
            options={songPlacements.map(songPlacement => ({label: songPlacement, value: songPlacement}))}
            menuPortalTarget={document.body}
          />
        </FlexBox>
        <FlexBox flexDirection="column" gap="0.25rem">
          <Label>Feel</Label>
          <FlexBox gap="1rem" justifyContent="space-between">
            {songFeels.map(songFeel => (
              <label key={songFeel} htmlFor={songFeel}>
                <input id={songFeel} type="radio" checked={feel === songFeel} onChange={() => setFeel(songFeel)} />
                {songFeel}
              </label>
            ))}
          </FlexBox>
        </FlexBox>
        <GridBox gap="1rem" gridTemplateColumns="1fr 1fr">
          <Button kind="text" onClick={() => {}}>
              Cancel
          </Button>
          <Button isDisabled={!isValid} kind="primary" onClick={handleSave}>
            <FlexBox gap=".5rem">
              <FontAwesomeIcon icon={faSave} />
              Save
            </FlexBox>
          </Button>
        </GridBox>
      </FlexBox>
    </div>
  )
}
