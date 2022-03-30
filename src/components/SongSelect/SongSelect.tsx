import React, { useContext } from "react";
import { Label } from "components";
import Select from "react-select";
import { SetlistContext } from "context";
import './SongSelect.scss'

export const SongSelect = ({label, onChange}: {label: string; onChange: (id: string) => void}) => {
  const {availableSongs} = useContext(SetlistContext)

  return (
    <div className="SongSelect">
      <Label>{label}</Label>
      <Select
        getOptionLabel={(option) => option.name}
        getOptionValue={option => option.localId}
        options={availableSongs}
        onChange={(newValue) => newValue && onChange(newValue.localId)}
        autoFocus
      />
    </div>
  )
}