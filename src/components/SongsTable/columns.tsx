import React, { useContext, useState } from "react"
import { BasicSong, Feel, SongPlacement, SongWithId, Tempo } from "types"
import { Column, Row } from 'react-table'
import { Dial, Button, FlexBox, Modal, SongForm, FeelTag } from "components"
import { faBackwardStep, faEdit, faForwardStep } from "@fortawesome/free-solid-svg-icons"
import { SongsContext } from "context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const columns: Column<SongWithId>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({value, row}: {value: string; row: Row<SongWithId>}) => {
      const [showEdit, setShowEdit] = useState(false)
      const {editSong, removeSong} = useContext(SongsContext)

      const handleDelete = (id: string) => {
        removeSong(id)
        setShowEdit(false)
      }

      const handleEdit = (song: BasicSong | SongWithId) => {
        const songWithId = song as SongWithId
        if (songWithId?.id) {
          editSong(songWithId)
        }
        setShowEdit(false)
      }

      return (
        <FlexBox alignItems="center" gap=".25rem">
          <Button icon={faEdit} isRounded kind="secondary" onClick={() => setShowEdit(true)} />
          <p className="Table__name">{value}</p>
          {showEdit && (
            <Modal offClick={() => setShowEdit(false)}>
              <SongForm
                label="Edit Song"
                onSave={handleEdit}
                onCancel={() => setShowEdit(false)}
                onDelete={handleDelete}
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
          return (
            <FlexBox justifyContent="center" alignItems="center" gap="0.5rem">
              <FontAwesomeIcon icon={faBackwardStep} />
              <span>Opener</span>
            </FlexBox>
          )
        case 'closer':
          return (
            <FlexBox justifyContent="center" alignItems="center" gap="0.5rem">
              <span>Closer</span>
              <FontAwesomeIcon icon={faForwardStep} />
            </FlexBox>
          )
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