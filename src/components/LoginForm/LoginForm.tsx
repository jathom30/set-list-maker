import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Button, Label } from "components";
import './LoginForm.scss'
import { FlexBox } from "components/Box";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const {loginUser, signupUser, loginProvider} = useIdentityContext()
  const formRef = useRef<HTMLFormElement>(null)
  const [isDisabled, setIsDisabled] = useState(true)
  // const [hasError, setHasError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState<string>()
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
        navigate('/setlists')
      })
      .catch((err) => {
        const {...all} = err
        console.log(all)
        setApiErrorMessage(err.json.error_description)
      })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = formRef.current?.email.value
    const password = formRef.current?.password.value
    const passwordRepeat = showRegistration ? formRef.current?.passwordRepeat.value : undefined
    setApiErrorMessage(undefined)
    
    if (showRegistration && password && passwordRepeat) {
      setPasswordError(password !== passwordRepeat)
    }
    
    setIsDisabled(!(email && password))
  }

  const handleGoogleAuth = () => {
    loginProvider('google')
    navigate('/setlists')
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
          <Button type="submit" kind="primary" isDisabled={isDisabled || !!apiErrorMessage || passwordError}>{showRegistration ? 'Register' :  'Log in'}</Button>
        </form>
        <Button onClick={handleGoogleAuth} kind="secondary">
          <FlexBox alignItems="center" gap=".5rem">
            <GoogleSVG />
            <span>Log in with Google</span>
          </FlexBox>
        </Button>
        {!showRegistration && (
          <FlexBox justifyContent="flex-end">
            <Button kind="text" onClick={() => setShowRegistration(true)}>Register Account</Button>
          </FlexBox>
        )}
        {apiErrorMessage && <span className="LoginForm__error">{apiErrorMessage}</span>}
      </div>
    </div>
  )
}

export const GoogleSVG = () => {
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"/>
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z"/>
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"/>
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"/>
    </svg>
  )
}