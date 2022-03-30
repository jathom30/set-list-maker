import { Button, FlexBox, GridBox, MaxHeightContainer, SongDisplay } from "components";
import { useNavigate } from 'react-router-dom'
import React, { useContext } from "react";
import './DashboardRoute.scss'
import { SongsContext } from "context";
import { faCheckCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export const DashboardRoute = () => {
  const navigate = useNavigate()

  const handleCreateNewSetlists = () => {
    navigate('set-lists')
  }

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
          {Array.from({length: 6}, (_, i) => i).map(setlist => (
            <SetlistsPreview key={setlist} id={setlist.toString()} />
          ))}
        </GridBox>
      </MaxHeightContainer>
    </div>
  )
}

const SetlistsPreview = ({id}: {id: string}) => {
  const {songs} = useContext(SongsContext)
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
                <SongDisplay song={songs[0]} setlistId={id} index={0} />
                <SongDisplay song={songs[1]} setlistId={id} index={1} />
                <SongDisplay song={songs[2]} setlistId={id} index={2} />
                <SongDisplay song={songs[3]} setlistId={id} index={3} />
                <SongDisplay song={songs[4]} setlistId={id} index={4} />
              </div>
            </FlexBox>
            <FlexBox gap=".25rem" flexDirection="column">
              <span>Set 2</span>
              <div>
                <SongDisplay song={songs[0]} setlistId={id} index={0} />
                <SongDisplay song={songs[1]} setlistId={id} index={1} />
                <SongDisplay song={songs[2]} setlistId={id} index={2} />
                <SongDisplay song={songs[3]} setlistId={id} index={3} />
                <SongDisplay song={songs[4]} setlistId={id} index={4} />
              </div>
            </FlexBox>
          </FlexBox>
        </div>
      </FlexBox>
    </div>
  )
}