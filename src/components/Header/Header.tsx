import { FlexBox, Hamburger } from 'components';
import { useOnClickOutside } from 'hooks';
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss'

const links = ['setlists', 'songs']

export const Header = ({isMobile}: {isMobile: boolean}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(headerRef, () => setMenuIsOpen(false))

  return (
    <div className="Header" ref={headerRef}>
      <FlexBox padding='.5rem' gap="1rem" alignItems="center" justifyContent="space-between">
        {isMobile ? (
          <button className='Header__hamburger-btn' onClick={() => setMenuIsOpen(!menuIsOpen)}>
            <Hamburger isOpen={menuIsOpen} />
          </button>
        ) : (
          <FlexBox flexDirection='row' gap="1rem" padding='1rem'>
            {links.map(link => <NavLink key={link} className={(navData) => `Header__link Header__link--${navData.isActive ? 'is-active' : ''}`} to={link}>{link}</NavLink>)}
          </FlexBox>
        )}
      </FlexBox>
      {isMobile && menuIsOpen && (
        <FlexBox flexDirection='column' gap="1rem" padding='1rem'>
          {links.map(link => <NavLink key={link} onClick={() => setMenuIsOpen(false)} className={(navData) => `Header__link Header__link--${navData.isActive ? 'is-active' : ''}`} to={link}>{link}</NavLink>)}
        </FlexBox>
      )}
    </div>
  )
}
