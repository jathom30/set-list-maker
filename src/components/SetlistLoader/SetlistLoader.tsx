import React from "react";
import { createPortal } from "react-dom";
import './SetlistLoader.scss'

export const SetlistLoader = () => {
  return createPortal(
    <div className="SetlistLoader">
      <h1>Generating your setlist</h1>
      <SetlistIcon />
    </div>,
    document.body
  )
}

const groups = 7;

const SetlistIcon = () => {
  return (
    <div className="SetlistIcon">
      {Array.from({length: groups}, (_, i) => (
        <div className={`SetlistIcon__song-group SetlistIcon__song-group--${i}`}>
          <div className="SetlistIcon__dot" />
          <div className="SetlistIcon__bar" />
        </div>
      ))}
    </div>
  )
}