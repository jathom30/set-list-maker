import React, { useContext, useState } from "react"
import { Feel, Song, SongPlacement, Tempo } from "types"
import { Column, Row } from 'react-table'
import { Dial, Button, FlexBox, Modal, SongForm, FeelTag } from "components"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { SongsContext } from "context"

export const columns: Column<Song>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({value, row}: {value: string; row: Row<Song>}) => {
      const [showEdit, setShowEdit] = useState(false)
      const {editSong} = useContext(SongsContext)
      return (
        <FlexBox alignItems="center" gap=".25rem">
          <Button icon={faEdit} isRounded kind="secondary" onClick={() => setShowEdit(true)} />
          <p className="Table__name">{value}</p>
          {showEdit && (
            <Modal offClick={() => setShowEdit(false)}>
              <SongForm
                label="Edit Song"
                onSave={(song) => {setShowEdit(false); editSong(song)}}
                onCancel={() => setShowEdit(false)}
                defaultSong={row.original}
              />
            </Modal>
          )}
        </FlexBox>
      )
    }
  },
  {
    Header: 'Time',
    accessor: 'length',
  },
  {
    Header: 'Tempo',
    accessor: 'tempo',
    Cell: ({value}: {value: Tempo}) => (
      <FlexBox justifyContent="center">
        <Dial tempo={value} />
      </FlexBox>
    )
  },
  {
    Header: 'Feel',
    accessor: 'feel',
    Cell: ({value}: {value: Feel[]}) => (
      <FlexBox flexWrap="wrap" gap=".25rem">
        {value?.map(v => <FeelTag key={v} feel={v} />)}
      </FlexBox>
    )
  },
  {
    Header: 'Placement',
    accessor: 'placement',
    Cell: ({value}: {value: SongPlacement}) => {
      switch (value) {
        case 'opener':
          return <span>Opener</span>
        case 'closer':
          return <span>Closer</span>
        default: 
          return ''
      }
    }
  },
  {
    Header: 'Cover',
    accessor: 'isCover',
    Cell: ({value}: {value: boolean}) => value ? 'Yes' : ''
  },
]