import React from "react";
import './Label.scss'

export const Label: React.FC<{required?: boolean}> = ({required = false, children}) => {
  return (
    <span className="Label">
      {children}
      {required && (
        <>
          {' '}
          <span className="Label__required">[Required]</span>
        </>
      )}
    </span>
  )
}