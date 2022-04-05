import { useLocalStorage } from "hooks/useLocalStorage"
import { useEffect } from "react"

const lightTheme: {[key: string]: string} = {
  '--color-background': '#f3f3f3',
  '--color-component-background': '#ffffff',
  '--color-component-background-alt': '#e6e6e6',
  '--color-component-background-darken': '#cbcbcb',
  '--color-text': '#000000',
  '--color-text-subdued': '#808080',
  '--color-success': '#90ee90',
  '--color-success-text': '#008000',
  '--color-danger': '#ff4400',
}

const darkTheme: {[key: string]: string} = {
  '--color-background': '#1f1f1f',
  '--color-component-background': '#5a5a5a',
  '--color-component-background-alt': '#313131',
  '--color-component-background-darken': '#1a1a1a',
  '--color-text': '#ffffff',
  '--color-text-subdued': '#a6a6a6',
  '--color-success': '#008000',
  '--color-success-text': '#90ee90',
  '--color-danger': '#ff4400',
}

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(true, 'color-theme')

  useEffect(() => {
    const doc = document.documentElement
    const { style } = doc
    
    const setTheme = (theme: {[key: string]: string}) => {
      Object.keys(theme).forEach(key => {
        style.setProperty(key, theme[key])
      })
    }

    if (isDarkMode) {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }

  }, [isDarkMode])

  return [isDarkMode, setIsDarkMode]
}