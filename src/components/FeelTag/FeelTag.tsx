import { capitalizeFirstLetter } from "helpers";
import React from "react";
import { Feel } from "types";
import './FeelTag.scss'

export const FeelTag = ({feel}: {feel: Feel}) => {
  return (
    <span className={`FeelTag FeelTag--${feel}`}>{capitalizeFirstLetter(feel)}</span>
  )
}