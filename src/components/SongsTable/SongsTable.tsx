import { SongsContext } from "context";
import React, { useContext } from "react";
import {columns} from './columns'
import { useTable } from 'react-table'
import './SongsTable.scss'

export const SongsTable = () => {
  const {songs} = useContext(SongsContext)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ 
    columns, 
    // sort by title
    data: songs?.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
      } else {
          return 1
      }
    }) || []
  })

  return (
    <div className="SongsTable">
      <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr className="SongsTable__tr" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="SongsTable__th" {...column.getHeaderProps()}>
                    {column.render('Header')}
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