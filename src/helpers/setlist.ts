import { Song } from "types";
import {v4 as uuid} from 'uuid'

function randomIntFromMax(max: number) {
  return Math.floor(Math.random() * max)
}

const getRandomSong = (songs: Song[]) => {
  const randomSong = songs[randomIntFromMax(songs.length)]
  const remainingSongs = songs.filter(song => song.id !== randomSong.id)
  return {
    randomSong,
    remainingSongs,
  }
}

export const createSetlistIds = (setlistLength: number, numberOfSetlists: number, songs: Song[]) => {
  // create array of keys based on number of setlists needed
  const setlistKeys = Array.from({length: numberOfSetlists}, () => uuid())
  
  // organize songs by placement, when a song is selected, it is removed from the list so it can't get used again
  let openers = songs.filter(song => song.placement === 'opener')
  let closers = songs.filter(song => song.placement === 'closer')
  let others = songs.filter(song => song.placement === 'other')

  // Preference is to fill sets with openers and closers, but there should be enough for each set
  const preferredOpenerCount = Math.floor(openers.length / numberOfSetlists)
  const preferredCloserCount = Math.floor(closers.length / numberOfSetlists)

  // build the setlists
  const setlists: {[key: string]: string[]} = setlistKeys.reduce((acc, setlistId) => {
    // length keeps track of a set's time so the loop knows when the set is long enough
    let length = 0
    let openersInSet = 0
    let closersInSet = 0
    let setlist: Song[] = []
    
    // add closets first to back fill
    while (closers.length > 0 && closersInSet <= preferredCloserCount && length < setlistLength) {
      const { randomSong, remainingSongs } = getRandomSong(closers)
      setlist = [...setlist, randomSong]
      closers = remainingSongs
      closersInSet += 1
      length += randomSong.length
    }
    // then add openers
    while (openers.length > 0 && openersInSet < preferredOpenerCount && length < setlistLength) {
      const { randomSong, remainingSongs } = getRandomSong(openers)
      setlist = [randomSong, ...setlist]
      openers = remainingSongs
      openersInSet += 1
      length += randomSong.length
    }
    // fill remaining space with "others"
    while (others.length > 0 && length < setlistLength) {
      const { randomSong, remainingSongs } = getRandomSong(others)
      // insert "other" songs before closers
      const closerIndex = setlist.findIndex(song => song.placement === 'closer')
      setlist = [...setlist.slice(0, closerIndex), randomSong, ...setlist.slice(closerIndex)]
      others = remainingSongs
      length += randomSong.length
    }
    return {
      ...acc,
      // map setlist to ids so we can pull the actual song to the user instead of a copy
      [setlistId]: setlist.map(song => song.id),
    }
  }, {})

  return setlists
}
