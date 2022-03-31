import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Button, Label } from "components";
import './LoginForm.scss'
import { FlexBox } from "components/Box";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const {loginUser, signupUser} = useIdentityContext()
  const formRef = useRef<HTMLFormElement>(null)
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const navigate = useNavigate()
  
  const handleSignin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const email = formRef.current?.email.value
    const password = formRef.current?.password.value

    if (showRegistration) {
      signupUser(email, password, {})
        .then(() => {
          loginUser(email, password, true)
          navigate('/setlists')
        })
        .catch((err) => {
          console.error(err)
        })
      return
    }
    loginUser(email, password, true)
      .then(() => {
        console.log('hello')
      })
      .catch((err) => {
        console.error(err)
        setHasError(true)
      })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = formRef.current?.email.value
    const password = formRef.current?.password.value
    const passwordRepeat = showRegistration ? formRef.current?.passwordRepeat.value : undefined
    setHasError(false)
    
    if (showRegistration && password && passwordRepeat) {
      setPasswordError(password !== passwordRepeat)
    }
    
    setIsDisabled(!(email && password))
  }

  return (
    <div className="LoginForm__wrapper">
      <div className="LoginForm">
        <h1 className="LoginForm__title">{showRegistration ? 'Register' : 'Login'}</h1>
        <form className="LoginForm__form" ref={formRef} onSubmit={handleSignin}>
          <label className="LoginForm__label" htmlFor="email">
            <Label>Email:</Label>
            <input className="LoginForm__input" name="email" onChange={handleChange} />
          </label>
          <label className="LoginForm__label" htmlFor="password">
            <Label>Password:</Label>
            <input className="LoginForm__input" type="password" name="password" onChange={handleChange} />
          </label>
          {showRegistration && (
            <label className="LoginForm__label" htmlFor="passwordRepeat">
              <Label>Repeat Password:</Label>
              <input className="LoginForm__input" type="password" name="passwordRepeat" onChange={handleChange} />
              {passwordError && <span className="LoginForm__password-error">Passwords do not match</span>}
            </label>
          )}
          <Button type="submit" kind="primary" isDisabled={isDisabled || hasError || passwordError}>{showRegistration ? 'Register' :  'Log in'}</Button>
          {hasError && <span className="LoginForm__error">The email and/or password seem to be incorrect.</span>}
        </form>
        {!showRegistration && (
          <FlexBox justifyContent="flex-end">
            <Button kind="secondary" onClick={() => setShowRegistration(true)}>Register Account</Button>
          </FlexBox>
        )}
      </div>
    </div>
  )
}