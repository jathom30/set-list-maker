import React, { useContext, useState } from "react"
import { Feel, Song, SongPlacement } from "types"
import { Column, Row } from 'react-table'
import { Dial, Button, FlexBox, Modal, SongForm } from "components"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { SongsContext } from "context"

export const columns: Column<Song>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({value, row}: {value: string; row: Row<Song>}) => {
      const [showEdit, setShowEdit] = useState(false)
      const {updateSong} = useContext(SongsContext)
      return (
        <FlexBox alignItems="center" gap=".25rem">
          <Button icon={faEdit} isRounded kind="secondary" onClick={() => setShowEdit(true)} />
          <p className="Table__name">{value}</p>
          {showEdit && (
            <Modal offClick={() => setShowEdit(false)}>
              <SongForm
                label="Edit Song"
                onSave={(song) => {setShowEdit(false); updateSong(song)}}
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
    Header: 'Time (minutes)',
    accessor: 'length',
  },
  {
    Header: 'Feel',
    accessor: 'feel',
    Cell: ({value}: {value: Feel}) => (
      <FlexBox alignItems="center" gap="1rem">
        <Dial feel={value} />
        <span style={{textTransform: 'capitalize'}}>{value}</span>
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