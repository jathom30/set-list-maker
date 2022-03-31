import { Button, FlexBox, GridBox, MaxHeightContainer, SongDisplay } from "components";
import { useNavigate } from 'react-router-dom'
import React, { useContext } from "react";
import './DashboardRoute.scss'
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import { getParentList } from "api";
import { ParentSetlistType, SetlistType, Song } from "types";
import { SongsContext } from "context";

export const DashboardRoute = () => {
  const navigate = useNavigate()

  const handleCreateNewSetlists = () => {
    navigate('/set-lists')
  }

  const parentListQuery = useQuery('parent-list', getParentList, {retry: false})

  const parentLists = parentListQuery.data?.map(record => ({...record.fields, setlists: JSON.parse(record.fields.setlists as string), setlistIds: JSON.parse(record.fields.setlistIds as string)})) as ParentSetlistType[]

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
            ? parentLists.map(list => <SetlistsPreview key={list.id} list={list} />)
            : null}
        </GridBox>
      </MaxHeightContainer>
    </div>
  )
}

const SetlistsPreview = ({list}: {list: ParentSetlistType}) => {
  const {setlistIds, setlists, name} = list
  const {songs} = useContext(SongsContext)
  const getSong = (id: string) => songs.find(song => song.localId === id) as Song

  return (
    <div className="SetlistsPreview">
      <FlexBox flexDirection="column">
        <FlexBox padding="1rem" paddingBottom="0.5rem" alignItems="center" justifyContent="space-between">
          <Button onClick={() => []} kind="secondary" icon={faCheckCircle}>
            <h3>{name}</h3>
          </Button>
          <p>{setlistIds.length} set(s)</p>
        </FlexBox>
        <div className="SetlistsPreview__preview">
          <FlexBox gap=".5rem" flexDirection="column">
            {setlistIds.map(id => (
              <FlexBox key={id} gap=".25rem" flexDirection="column">
                <span>Set 1</span>
                <div>
                  {setlists[id].map((songId, i) => (
                    <SongDisplay key={songId} song={getSong(songId)} setlistId={id} index={i} isDisabled />
                  ))}
                </div>
              </FlexBox>
            ))}
          </FlexBox>
        </div>
      </FlexBox>
    </div>
  )
}