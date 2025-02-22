function getPreferredLanguage() {
  const supportedLanguages = ['en', 'de', 'zh-CN']
  const browserLanguages = navigator.languages || [navigator.language]

  for (let lang of browserLanguages) {
    if (supportedLanguages.includes(lang)) {
      return lang
    }
    const langPrefix = lang.split('-')[0]
    if (supportedLanguages.includes(langPrefix)) {
      return langPrefix
    }
  }
  return 'en'
}

export { getPreferredLanguage }
