import React, { ChangeEvent, useState } from "react";
import { FlexBox, Input, Label, Button } from "components";
import './SongForm.scss'
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Tempo, SongPlacement, Feel, BasicSong, SongWithId } from "types";
import { GridBox } from "components/Box";
import { capitalizeFirstLetter } from "helpers";
import { UpDownInput } from "components/UpDownInput";

const songTempos: Tempo[] = ['ballad', 'chill', 'medium', 'up', 'burner']
const songFeels: Feel[] = ['blues', 'country', 'funk', 'latin', 'rock', 'swing', 'other']
const songPlacements: SongPlacement[] = ['opener', 'closer', 'other']

const songKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb']
export const majorAndMinorKeys = songKeys.reduce((acc: string[], key) => ([...acc, key, `${key}-`]), [])

export const SongForm = (
  {label, onSave, onCancel, onDelete, defaultSong}:
  {
    label: string;
    onSave: (song: BasicSong | SongWithId) => void;
    onCancel: () => void;
    onDelete?: (id: string) => void;
    defaultSong?: SongWithId;
  }
) => {
  const [name, setName] = useState(defaultSong?.name || '')
  const [length, setLength] = useState(defaultSong?.length || 0)
  const [placement, setPlacement] = useState<SongPlacement | undefined>(defaultSong?.placement)
  const [tempo, setTempo] = useState<Tempo>(defaultSong?.tempo || 'medium')
  const [feel, setFeel] = useState<Feel[]>(defaultSong?.feel || [])
  const [isCover, setIsCover] = useState(defaultSong?.isCover || false)
  const [exclude, setExclude] = useState(defaultSong?.exclude || false)
  const [key, setKey] = useState<string | undefined>(defaultSong?.key)

  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const isValid = name !== '' && length > 0 && placement

  const handleSave = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave({
      ...defaultSong,
      name,
      length,
      placement: placement || 'other',
      tempo,
      feel,
      isCover,
      exclude,
      key,
    })
  }

  const handleDelete = () => {
    if (!(defaultSong?.id && onDelete)) return
    onDelete(defaultSong.id)
  }

  return (
    <div className="SongForm">
      <form onSubmit={handleSave}>
        <FlexBox flexDirection="column" padding="1rem" gap="1rem">
          <FlexBox alignItems="center" justifyContent="space-between">
            <h3>{label}</h3>
            {!showDeleteWarning && defaultSong?.id ? <Button onClick={() => setShowDeleteWarning(true)} kind="danger">Delete from library</Button> : null}
          </FlexBox>
          {showDeleteWarning ? (
            <FlexBox gap="1rem" flexDirection="column">
              <FlexBox gap=".5rem" flexDirection="column" alignItems="center">
                <p><strong>Are you sure?</strong></p>
                <p>This will delete this song from your library.</p>
              </FlexBox>
              <FlexBox>
                <Button width="100%" onClick={() => setShowDeleteWarning(false)} kind="text">Cancel</Button>
                <Button width="100%" onClick={handleDelete} kind="danger" icon={faTrash}>DELETE</Button>
              </FlexBox>
            </FlexBox>
          ) : (
            <>
              <Input label="Song name" value={name} onChange={(val) => setName(val)} name="song-name" />
              <FlexBox gap="2rem">
                <label htmlFor="exclude">
                  <FlexBox alignItems="center" gap="0.25rem">
                    <Label>Exclude from set creation</Label>
                    <input id="exclude" type="checkbox" checked={exclude} onChange={(e) => setExclude(e.target.checked)} />
                  </FlexBox>
                </label>
                <label htmlFor="cover">
                  <FlexBox alignItems="center" gap="0.25rem">
                    <Label>Is a cover</Label>
                    <input id="cover" type="checkbox" checked={isCover} onChange={(e) => setIsCover(e.target.checked)} />
                  </FlexBox>
                </label>
              </FlexBox>
              <UpDownInput label="Approx. song length (in minutes)" initialValue={length} onChange={setLength} name="song-length" />
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
                <Label>Key</Label>
                <Select
                  defaultValue={key && {label: key, value: key}}
                  onChange={(newValue) => {
                    if (newValue) setKey(newValue.value)
                  }}
                  options={majorAndMinorKeys.map(key => ({label: key, value: key}))}
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
                <Button isDisabled={!isValid} kind="primary" type="submit">
                  <FlexBox gap=".5rem">
                    <FontAwesomeIcon icon={faSave} />
                    Save
                  </FlexBox>
                </Button>
              </GridBox>
            </>
          )}
        </FlexBox>
      </form>
    </div>
  )
}
