import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexBox } from 'components/Box';
import * as React from 'react';
import './Button.scss'

export const Button: React.FC<{
  onClick: () => void,
  isRounded?: boolean,
  isDisabled?: boolean
  kind?: 'default' | 'primary' | 'danger' | 'text' | 'secondary'
  width?: string
  icon?: IconDefinition
}> = ({children, onClick, isRounded = false, kind = 'default', isDisabled = false, width, icon}) => {
  const buttonKindClass = `Button__${kind}`
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{width}}
      className={`Button ${isRounded ? 'Button--rounded' : ''} ${isDisabled ? 'Button--disabled' : ''} ${buttonKindClass}`}
    >
      <FlexBox gap="0.5rem">
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </FlexBox>
    </button>
  )
}