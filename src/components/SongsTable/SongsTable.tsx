import { SongsContext } from "context";
import React, { useContext, useMemo } from "react";
import {columns} from './columns'
import { useSortBy, useTable } from 'react-table'
import './SongsTable.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FlexBox } from "components/Box";

export const SongsTable = () => {
  const {songs} = useContext(SongsContext)

  const memoizedData = useMemo(() => {
    return songs
    // ?.sort((a, b) => {
    //   if (a.name.toLowerCase() < b.name.toLowerCase()) {
    //       return -1
    //   }
    //   return 1
    // })
    || []
  }, [songs])

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