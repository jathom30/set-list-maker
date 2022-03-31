import { Button, FlexBox, GridBox, MaxHeightContainer, SongDisplay } from "components";
import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect } from "react";
import './DashboardRoute.scss'
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import { getParentList, getSetlist } from "api";
import { ParentSetlistType, SetlistType, Song } from "types";
import { SongsContext } from "context";

export const DashboardRoute = () => {
  const navigate = useNavigate()

  const handleCreateNewSetlists = () => {
    navigate('set-lists')
  }

  const parentListQuery = useQuery('parent-list', getParentList, {retry: false})

  const parentList = parentListQuery.data?.map(record => ({...record.fields, childIds: JSON.parse(record.fields.childIds as string)})) as ParentSetlistType[]

  return (
    <div className="DashboardRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox justifyContent="space-between" alignItems="center" gap="1rem" padding="1rem">
            <h1>Welcome back</h1>
            <Button kind="primary" onClick={handleCreateNewSetlists}>Create New Setlist(s)</Button>
          </FlexBox>
        }
      >
        <GridBox padding="1rem" gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
          {parentListQuery.isLoading
            ? '...loading...'
            : parentListQuery.isSuccess
            ? parentList.map(list => <SetlistsPreview key={list.id} childIds={list.childIds} />)
            : null}
        </GridBox>
      </MaxHeightContainer>
    </div>
  )
}

const SetlistsPreview = ({childIds}: {childIds: string[]}) => {
  console.log(childIds)
  const setlistQuery = useQuery(['setlist', childIds], async () => {
    return await getSetlist(childIds[0])
  })
  const {songs} = useContext(SongsContext)
  const getSong = (id: string) => songs.find(song => song.localId === id) as Song

  const setlist = setlistQuery.data?.fields as SetlistType | undefined

  return (
    <div className="SetlistsPreview">
      <FlexBox flexDirection="column">
        <FlexBox padding="1rem" paddingBottom="0.5rem" alignItems="center" justifyContent="space-between">
          <Button onClick={() => []} kind="secondary" icon={faCheckCircle}>
            <h3>Setlists' name</h3>
          </Button>
          <p>2 sets</p>
        </FlexBox>
        <div className="SetlistsPreview__preview">
          <FlexBox gap=".5rem" flexDirection="column">
            <FlexBox gap=".25rem" flexDirection="column">
              <span>Set 1</span>
              <div>
                {setlist?.songIds?.map(songId => 
                  <SongDisplay key={songId} song={getSong(songId)} setlistId={childIds[0]} index={setlist.index} />
                )}
              </div>
            </FlexBox>
            {/* <FlexBox gap=".25rem" flexDirection="column">
              <span>Set 2</span>
              <div>
                <SongDisplay song={songs[0]} setlistId={id} index={0} />
                <SongDisplay song={songs[1]} setlistId={id} index={1} />
                <SongDisplay song={songs[2]} setlistId={id} index={2} />
                <SongDisplay song={songs[3]} setlistId={id} index={3} />
                <SongDisplay song={songs[4]} setlistId={id} index={4} />
              </div>
            </FlexBox> */}
          </FlexBox>
        </div>
      </FlexBox>
    </div>
  )
}

// TODO make "disabled" SongDisplay