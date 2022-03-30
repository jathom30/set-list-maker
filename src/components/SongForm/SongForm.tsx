import React, { useState } from "react";
import { FlexBox, Input, Label, Button } from "components";
import './SongForm.scss'
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Tempo, Song, SongPlacement, Feel } from "types";
import { GridBox } from "components/Box";
import {v4 as uuid} from 'uuid'
import { capitalizeFirstLetter } from "helpers";

const songTempos: Tempo[] = ['ballad', 'chill', 'medium', 'up', 'burner']
const songFeels: Feel[] = ['blues', 'funk', 'latin', 'rock', 'swing', 'other']
const songPlacements: SongPlacement[] = ['opener', 'closer', 'other']

export const SongForm = ({label, onSave, onCancel, defaultSong}: {label: string; onSave: (song: Song) => void; onCancel: () => void; defaultSong?: Song}) => {
  const [name, setName] = useState(defaultSong?.name || '')
  const [length, setLength] = useState(defaultSong?.length || 0)
  const [placement, setPlacement] = useState<SongPlacement | undefined>(defaultSong?.placement)
  const [tempo, setTempo] = useState<Tempo>(defaultSong?.tempo || 'medium')
  const [feel, setFeel] = useState<Feel[]>(defaultSong?.feel || [])
  const [isCover, setIsCover] = useState(defaultSong?.isCover || false)

  const isValid = name !== '' && length > 0 && placement

  const handleSave = () => {
    onSave({
      ...defaultSong,
      name,
      length,
      placement: placement || 'other',
      tempo,
      feel,
      isCover,
      localId: defaultSong?.localId || uuid()
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
          <Label>Tempo</Label>
          <Select
            defaultValue={tempo && {label: capitalizeFirstLetter(tempo), value: tempo}}
            onChange={(newValue) => newValue && setTempo(newValue.value)}
            options={songTempos.map(songTempo => ({label: capitalizeFirstLetter(songTempo), value: songTempo}))}
            menuPortalTarget={document.body}
          />
        </FlexBox>
        <FlexBox flexDirection="column" gap="0.25rem">
          <Label>Feel</Label>
          <Select
            isMulti
            defaultValue={feel && feel.map(f => ({label: capitalizeFirstLetter(f), value: f}))}
            onChange={(newValue) => {
              setFeel(newValue.map(v => v.value))
            }}
            options={songFeels.map(songFeel => ({label: capitalizeFirstLetter(songFeel), value: songFeel}))}
            menuPortalTarget={document.body}
          />
        </FlexBox>
        <FlexBox flexDirection="column" gap="0.25rem">
          <Label>Preferred placement</Label>
          <FlexBox gap="1rem" justifyContent="space-between">
            {songPlacements.map(songPlacement => (
              <label key={songPlacement} htmlFor={songPlacement}>
                <input id={songPlacement} type="radio" checked={placement === songPlacement} onChange={() => setPlacement(songPlacement)} />
                {songPlacement}
              </label>
            ))}
          </FlexBox>
        </FlexBox>
        <GridBox gap="1rem" gridTemplateColumns="1fr 1fr">
          <Button kind="text" onClick={onCancel}>
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
