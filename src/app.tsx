import { useState, useEffect } from 'react'
import './bootstrap.min.css'
import './style.css'
import LanguageSwitcher from './components/language-switcher'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getPreferredLanguage } from './utils'
import translations from './translations.json'
import Article from './components/article'
import QrSection from './components/qrSection'

i18n.use(initReactI18next).init({
  resources: translations,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  useEffect(() => {
    setSelectedLanguage(getPreferredLanguage())
    i18n.changeLanguage(getPreferredLanguage())
  }, [])

  return (
    <>
      <div className='container mt-5'>
        <LanguageSwitcher
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <Article />
        <QrSection />
      </div>
    </>
  )
}

export default App
