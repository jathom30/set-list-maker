import React, { ReactNode } from "react";
import { FlexBox } from "components";
import { Link } from "react-router-dom";
import './Breadcrumbs.scss'

export const Breadcrumbs = ({currentRoute}: {currentRoute?: ReactNode}) => {


  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        <Link to="/setlists" className={`Breadcrumbs__crumb ${currentRoute ? 'Breadcrumbs__crumb--not-active': ''}`}>
          Your setlists
        </Link>
        {currentRoute && (
          <>
            <span>{'/'}</span>
            {currentRoute}
          </>
        )}
      </FlexBox>
    </div>
  )
}