import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Button, FlexBox, Hamburger } from 'components';
import { useOnClickOutside } from 'hooks';
import React, { useRef, useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { NavLink } from 'react-router-dom';
import './Header.scss'

const links = ['setlists', 'songs']

export const Header = ({isMobile}: {isMobile: boolean}) => {
  const {logoutUser} = useIdentityContext()
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(headerRef, () => setMenuIsOpen(false))

  return (
    <div className="Header" ref={headerRef}>
      <FlexBox padding='1rem' gap="1rem" alignItems="center" justifyContent="space-between">
        {isMobile ? (
          <button className='Header__hamburger-btn' onClick={() => setMenuIsOpen(!menuIsOpen)}>
            <Hamburger isOpen={menuIsOpen} />
          </button>
        ) : (
          <FlexBox flexDirection='row' gap="1rem">
            {links.map(link => <NavLink key={link} className={(navData) => `Header__link Header__link--${navData.isActive ? 'is-active' : ''}`} to={link}>{link}</NavLink>)}
          </FlexBox>
        )}
        <Button isRounded onClick={logoutUser} icon={faSignOut}>Log out</Button>
      </FlexBox>
      {isMobile && menuIsOpen && (
        <FlexBox flexDirection='column' gap="1rem" padding='1rem'>
          {links.map(link => <NavLink key={link} onClick={() => setMenuIsOpen(false)} className={(navData) => `Header__link Header__link--${navData.isActive ? 'is-active' : ''}`} to={link}>{link}</NavLink>)}
        </FlexBox>
      )}
    </div>
  )
}
