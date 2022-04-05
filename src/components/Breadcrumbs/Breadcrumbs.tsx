import React, { ReactNode } from "react";
import { FlexBox } from "components";
import { Link } from "react-router-dom";
import './Breadcrumbs.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export const Breadcrumbs = ({currentRoute}: {currentRoute?: ReactNode}) => {
  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        <Link to="/setlists" className={`Breadcrumbs__crumb ${currentRoute ? 'Breadcrumbs__crumb--not-active': ''}`}>
          <span className="Breadcrumbs__back--mobile">
            <FontAwesomeIcon icon={faFolder} />
          </span>
          <span className="Breadcrumbs__back--desktop">
            Your setlists
          </span>
        </Link>
        {currentRoute && (
          <>
            <span className="Breadcrumbs__back--desktop">{'/'}</span>
            {currentRoute}
          </>
        )}
      </FlexBox>
    </div>
  )
}