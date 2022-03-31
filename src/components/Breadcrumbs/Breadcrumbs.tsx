import React, { useContext, useState } from "react";
import { FlexBox, LabelInput } from "components";
import { Link, useLocation, useParams } from "react-router-dom";
import './Breadcrumbs.scss'
import { SetlistContext } from "context";

export const Breadcrumbs = () => {
  const {name} = useParams()
  const [setlistName, setSetlistName] = useState(name)
  const {pathname} = useLocation()
  const {updateSetlists} = useContext(SetlistContext)

  const isNewSetlist = pathname.includes('new-setlist')

  const handleEditName = (val: string | number) => {
    setSetlistName(val.toString())
    updateSetlists(val.toString())
  }

  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        {pathname === '/setlists' ? (
          <span className={`Breadcrumbs__crumb ${name ? 'Breadcrumbs__crumb--not-active': ''}`}>Your setlists</span>
        ) : (
          <Link to="/setlists" className={`Breadcrumbs__crumb ${name ? 'Breadcrumbs__crumb--not-active': ''}`}>
            Your setlists
          </Link>
        )}
        {isNewSetlist && (
          <>
            <span>{'/'}</span>
            <span className="Breadcrumbs__crumb">New setlist</span>
          </>
        )}
        {setlistName && (
          <>
            <span>{'/'}</span>
            <LabelInput value={setlistName} onSubmit={handleEditName}>
              <span className="Breadcrumbs__crumb">{setlistName}</span>
            </LabelInput>
          </>
        )}
      </FlexBox>
    </div>
  )
}