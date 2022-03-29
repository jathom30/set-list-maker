import { Song } from "types";

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
  let setlist: Song[] = []
  let length = 0
  let openers = songs.filter(song => song.placement === 'opener')
  let closers = songs.filter(song => song.placement === 'closer')
  let others = songs.filter(song => song.placement === 'other')

  const preferredOpenerCount = Math.floor(openers.length / numberOfSetlists)
  const preferredCloserCount = Math.floor(closers.length / numberOfSetlists)

  let openersInSet = 0
  let closersInSet = 0

  // add closets first to back fill
  while (closers.length > 0 && closersInSet <= preferredCloserCount && length < setlistLength) {
    const { randomSong, remainingSongs } = getRandomSong(closers)
    setlist = [...setlist, randomSong]
    closers = remainingSongs
    closersInSet += 1
    length += randomSong.length
  }
  // then add openers
  while (openers.length > 0 && openersInSet <= preferredOpenerCount && length < setlistLength) {
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

  // return ids
  return setlist.map(song => song.id)
}