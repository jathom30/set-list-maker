import { SongWithId } from 'types'
import {v4 as uuid} from 'uuid'

function randomIntFromMax(max: number) {
  return Math.floor(Math.random() * max)
}

const getRandomSong = (songs: SongWithId[]) => {
  const randomSong = songs[randomIntFromMax(songs.length)]
  const remainingSongs = songs.filter(song => song.id !== randomSong.id)
  return {
    randomSong,
    remainingSongs,
  }
}

export const createSetlists = (setlistLength: number, numberOfSetlists: number, songs: SongWithId[]) => {
  // exclude songs marked as excluded
  const includedSongs = songs.filter(song => !song.exclude)
  // create array of keys based on number of setlists needed
  const setlistKeys = Array.from({length: numberOfSetlists}, () => uuid())
  
  // organize songs by placement, when a song is selected, it is removed from the list so it can't get used again
  let openers = includedSongs.filter(song => song.placement === 'opener')
  let closers = includedSongs.filter(song => song.placement === 'closer')
  let others = includedSongs.filter(song => song.placement === 'other')

  // Preference is to fill sets with openers and closers, but there should be enough for each set
  const preferredOpenerCount = Math.floor(openers.length / numberOfSetlists)
  const preferredCloserCount = Math.floor(closers.length / numberOfSetlists)

  // build the setlists
  const setlists: {[key: string]: string[]} = setlistKeys.reduce((acc, setlistId) => {
    // length keeps track of a set's time so the loop knows when the set is long enough
    let length = 0
    let openersInSet = 0
    let closersInSet = 0
    let setlist: SongWithId[] = []
    
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

    // check that only one ballad exists in the set, replace any additional ballads
    let balladCount = setlist.filter(song => song.tempo === 'ballad')?.length || 0
    let othersSansBallads = others.filter(song => song.tempo !== 'ballad')
    const balladsPerHour = 1
    const recommendedBalladsPerSet = Math.round(setlistLength / 60 / balladsPerHour)
    while (balladCount > recommendedBalladsPerSet) {
      const {randomSong, remainingSongs} = getRandomSong(othersSansBallads)
      // get first ballad index
      const balladIndex = setlist.findIndex(song => song?.tempo === 'ballad')
      // subract its length from overall set length
      length -= setlist[balladIndex]?.length
      setlist = [...setlist.slice(0, balladIndex), randomSong, ...setlist.slice(balladIndex + 1)]
      othersSansBallads = remainingSongs
      // add length back with replacement song
      length += randomSong?.length
      // recalc ballad count to update while loop
      balladCount = setlist.filter(song => song.tempo === 'ballad')?.length || 0
    }

    return {
      ...acc,
      // map setlist to ids so we can pull the actual song to the user instead of a copy
      [setlistId]: setlist.map(song => song.id),
    }
  }, {})

  return {
    setlists,
    ids: setlistKeys,
  }
}
