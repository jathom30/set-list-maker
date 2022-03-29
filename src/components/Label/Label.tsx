import React from "react";
import './Label.scss'

export const Label: React.FC = ({children}) => {
  return (
    <span className="Label">{children}</span>
  )
}