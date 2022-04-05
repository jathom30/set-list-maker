import { useLocalStorage } from "hooks/useLocalStorage"
import { useEffect } from "react"

const lightTheme: {[key: string]: string} = {
  '--color-background': '#f3f3f3',
  '--color-component-background': '#ffffff',
  '--color-component-background-alt': '#e6e6e6',
  '--color-text': '#000000',
}

const darkTheme: {[key: string]: string} = {
  '--color-background': '#1f1f1f',
  '--color-component-background': '#5a5a5a',
  '--color-component-background-alt': '#313131',
  '--color-text': '#ffffff',
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