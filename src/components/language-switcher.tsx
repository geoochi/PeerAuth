import i18n from 'i18next'

const LanguageSwitcher = ({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
}) => {
  return (
    <div className='language-switcher'>
      <select
        id='languageSelect'
        className='form-select'
        value={selectedLanguage}
        onChange={e => {
          setSelectedLanguage(e.target.value)
          i18n.changeLanguage(e.target.value)
        }}
      >
        <option value='en'>English</option>
        <option value='de'>Deutsch</option>
        <option value='zh-CN'>简体中文</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
