import { Song } from "types";

function randomIntFromMax(max: number) {
  return Math.floor(Math.random() * max)
}

const getSong = (songs: Song[]) => {
  const randomSong = songs[randomIntFromMax(songs.length)]
  const remainingSongs = songs.filter(song => song.id !== randomSong.id)
  return {
    randomSong,
    remainingSongs,
  }
}

export const createSetlistIds = (setlistLength: number, songs: Song[]) => {
  let setlist: Song[] = []
  let length = 0
  let openers = songs.filter(song => song.placement === 'opener')
  let closers = songs.filter(song => song.placement === 'closer')
  let others = songs.filter(song => song.placement === 'other')

  // getting opener
  // should be at least one opening song. If no openers are present, use a closer...
  // ...if no closers, use an other
  if (openers.length > 0) {
    const { randomSong, remainingSongs } = getSong(openers)
    setlist = [randomSong]
    openers = remainingSongs
    length += randomSong.length
  } else if (closers.length > 0) {
    const { randomSong, remainingSongs } = getSong(closers)
    setlist = [randomSong]
    closers = remainingSongs
    length += randomSong.length
  } else {
    const { randomSong, remainingSongs } = getSong(others)
    setlist = [randomSong]
    others = remainingSongs
    length += randomSong.length
  }
  
  // get closer
  if (closers.length > 0) {
    const { randomSong, remainingSongs } = getSong(closers)
    setlist = [...setlist, randomSong]
    closers = remainingSongs
    length += randomSong.length
  } else if (openers.length > 0) {
    const { randomSong, remainingSongs } = getSong(openers)
    setlist = [...setlist, randomSong]
    openers = remainingSongs
    length += randomSong.length
  } else {
    const { randomSong, remainingSongs } = getSong(others)
    setlist = [...setlist, randomSong]
    others = remainingSongs
    length += randomSong.length
  }

  // get others
  while (length < setlistLength && others.length > 0) {
    const { randomSong, remainingSongs } = getSong(others)
    const index = setlist?.findIndex(song => song.placement === 'closer')
    setlist = [...setlist.slice(0, index), randomSong, ...setlist.slice(index)]
    others = remainingSongs
    length += randomSong.length
  }

  // if out of others but setlist is not full, add more closers
  while (length < setlistLength && closers.length > 0) {
    const { randomSong, remainingSongs } = getSong(closers)
    const index = setlist?.findIndex(song => song.placement === 'closer')
    setlist = [...setlist.slice(0, index), randomSong, ...setlist.slice(index)]
    closers = remainingSongs
    length += randomSong.length
  }
  
  // if out of others and closers but setlist is not full, add more openers
  while (length < setlistLength && openers.length > 0) {
    const { randomSong, remainingSongs } = getSong(openers)
    const index = setlist?.findIndex(song => song.placement === 'other')
    setlist = [...setlist.slice(0, index), randomSong, ...setlist.slice(index)]
    openers = remainingSongs
    length += randomSong.length
  }

  // return ids
  return setlist.map(song => song.id)
}