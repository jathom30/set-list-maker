import { Breadcrumbs, Button, FlexBox, GridBox, MaxHeightContainer, Modal, SetlistForm, SongDisplay } from "components";
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from "react";
import './DashboardRoute.scss'
import { useQuery } from "react-query";
import { getParentList } from "api";
import { ParentSetlistType, Song } from "types";
import { SetlistContext, SongsContext } from "context";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const DashboardRoute = () => {
  const [showSetlistForm, setShowSetlistForm] = useState(false)
  const navigate = useNavigate()

  const {createSetlist, setParentId} = useContext(SetlistContext)

  const handleCreateNewSetlists = (length: number, count: number) => {
    createSetlist(length, count)
    setParentId(undefined)
    navigate('new-setlist')
  }

  const parentListQuery = useQuery('parent-list', getParentList, {retry: false})

  const parentLists = parentListQuery.data?.map(record => ({...record.fields, setlists: JSON.parse(record.fields.setlists as string), setlistIds: JSON.parse(record.fields.setlistIds as string)})) as ParentSetlistType[]

  return (
    <div className="DashboardRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox justifyContent="space-between" alignItems="center" gap="1rem" padding="1rem">
            <Breadcrumbs />
            <Button kind="primary" onClick={() => setShowSetlistForm(true)}>Create New Setlist(s)</Button>
          </FlexBox>
        }
      >
        {(parentListQuery.isSuccess && parentLists.length < 1) && (
          <FlexBox gap=".25rem" flexDirection="column" alignItems="center" paddingTop="3rem">
            <h2>You have no known setlists</h2>
            <p>Click "Create New Setlist(s)" above to get started.</p>
          </FlexBox>
        )} 
        <GridBox padding="1rem" gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
          {parentListQuery.isLoading
            ? 'loading...'
            : parentListQuery.isSuccess
            ? parentLists.map(list => <SetlistsPreview key={list.id} list={list} />)
            : null}
        </GridBox>
      </MaxHeightContainer>
      {showSetlistForm && (
        <Modal offClick={() => setShowSetlistForm(false)}>
            <SetlistForm onSave={handleCreateNewSetlists} />
        </Modal>
      )}
    </div>
  )
}

const SetlistsPreview = ({list}: {list: ParentSetlistType}) => {
  const {setlistIds, setlists, name} = list
  const navigate = useNavigate()
  const {songs} = useContext(SongsContext)
  const {setSetlistIds, setSetlists, setParentId, deleteSetlists} = useContext(SetlistContext)
  const getSong = (id: string) => songs.find(song => song.localId === id)

  const handleSelect = () => {
    setSetlistIds(setlistIds)
    setSetlists(setlists)
    if (list?.id) {
      setParentId(list.id)
    }
    navigate(list.name)
  }

  const handleDelete = () => list?.id && deleteSetlists(list.id)

  const readableDate = new Date(list.dateModified).toLocaleDateString()

  if (songs.length < 1) {
    return (
      <p>loading...</p>
    )
  }

  return (
    <div className="SetlistsPreview">
      <FlexBox flexDirection="column">
        <FlexBox padding="1rem" paddingBottom="0.5rem" alignItems="center" justifyContent="space-between">
          <Button onClick={handleSelect} kind="secondary">
            <h3>{name}</h3>
          </Button>
          <Button isRounded kind="danger" icon={faTrash} onClick={handleDelete} />
        </FlexBox>
        <div className="SetlistsPreview__preview">
          <FlexBox gap=".5rem" flexDirection="column">
            {setlistIds.map((id, index) => (
              <FlexBox key={id} gap=".25rem" flexDirection="column">
                <span>Set {index + 1}</span>
                <div>
                  {setlists[id].map((songId, i) => {
                    console.log(getSong(songId), songId, i)
                    const song = getSong(songId)
                    if (song) {
                      return (
                        <SongDisplay key={songId} song={song} setlistId={id} index={i} isDisabled />
                      )
                    }
                    return <span key={songId}>{songId}</span>
                  })}
                </div>
              </FlexBox>
            ))}
          </FlexBox>
        </div>
        <FlexBox padding="1rem" paddingTop="0" justifyContent="space-between">
          <p className="SetlistsPreview__date">{setlistIds.length} set(s)</p>
          <p className="SetlistsPreview__date">Last updated: {readableDate}</p>
        </FlexBox>
      </FlexBox>
    </div>
  )
}

// TODO better loading
// TODO delete setlists
// TODO select setlist to view full page