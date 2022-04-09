import { SongsContext } from "context";
import React, { useContext, useMemo, useState } from "react";
import {columns} from './columns'
import { useSortBy, useTable } from 'react-table'
import './SongsTable.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, Input } from "components";

export const SongsTable = () => {
  const {songs} = useContext(SongsContext)
  const [filter, setFilter] = useState('')
  const memoizedData = useMemo(() => songs?.filter(song => song.name.toLowerCase().includes(filter.toLowerCase())) || [], [songs, filter])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { 
      columns, 
      data: memoizedData,
      initialState: {
        sortBy: [{
          id: 'name'
        }]
      }
    },
    useSortBy,
  )

  return (
    <div className="SongsTable">
      <div className="SongsTable__search">
        <Input name="filter" value={filter} onChange={val => setFilter(val)} label="Search by name" />
        <Button kind="default" icon={faTimesCircle} isRounded onClick={() => setFilter('')}/>
      </div>
      <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr className="SongsTable__tr" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="SongsTable__th" {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <FlexBox alignItems="center" gap=".5rem">
                      {column.render('Header')}
                      {column.isSorted && <FontAwesomeIcon icon={column.isSortedDesc ? faCaretUp : faCaretDown} />}
                    </FlexBox>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr className="SongsTable__tr" {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td style={typeof cell.value === 'number' ? {textAlign: 'right'} : {}} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
    </div>
  )
}