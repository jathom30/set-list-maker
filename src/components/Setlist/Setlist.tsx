import React from 'react';

export const Setlist = ({songs}: {songs: string[]}) => {
  return (
    <div className="Setlist">
      {songs.map(song => (
        <p key={song}>{song}</p>
      ))}
    </div>
  )
}