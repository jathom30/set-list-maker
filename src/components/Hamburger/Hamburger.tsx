import React from 'react';
import './Hamburger.scss'

export const Hamburger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className={`Hamburger ${isOpen ? 'Hamburger--is-open' : ''}`}>
      <div className={`Hamburger__bar ${isOpen ? 'Hamburger__bar--is-open' : ''}`} />
    </div>
  )
}
