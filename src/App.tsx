import { useState, useEffect } from 'react'
import './bootstrap.min.css'
import './style.css'
import QRCode from 'qrcode'
import * as OTPAuth from 'otpauth'
import i18n from 'i18next'
import { useTranslation, initReactI18next } from 'react-i18next'
import translations from './translations.json'

i18n.use(initReactI18next).init({
  resources: translations,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

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

const App = () => {
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [url1, setUrl1] = useState('')
  const [url2, setUrl2] = useState('')
  const [otp, setOtp] = useState('')
  const [remaining, setRemaining] = useState(-1)
  const [secretString, setSecretString] = useState('')
  const [intervalNumber, setIntervalNumber] = useState<NodeJS.Timeout | null>(
    null
  )
  const [qrSectionDisplay, setQrSectionDisplay] = useState('none')
  useEffect(() => {
    setSelectedLanguage(getPreferredLanguage())
    i18n.changeLanguage(getPreferredLanguage())
  }, [])

  const generateHandler = async () => {
    const secret = new OTPAuth.Secret({ size: 20 })
    setSecretString(secret.base32)
    const totp1 = new OTPAuth.TOTP({
      issuer: 'PeerAuth',
      label: encodeURIComponent(name1),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })
    const totp2 = new OTPAuth.TOTP({
      issuer: 'PeerAuth',
      label: encodeURIComponent(name2),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })
    setUrl1(await QRCode.toDataURL(totp1.toString()))
    setUrl2(await QRCode.toDataURL(totp2.toString()))
    function updateOtpDisplay() {
      const now = Math.floor(Date.now() / 1000)
      const remaining = totp1.period - (now % totp1.period)
      setOtp(`${totp1.generate()}`)
      setRemaining(remaining)
    }
    updateOtpDisplay()
    setQrSectionDisplay('block')
    if (intervalNumber) clearInterval(intervalNumber)
    setIntervalNumber(setInterval(updateOtpDisplay, 1000))
  }

  return (
    <>
      <div className='container mt-5'>
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
        <h1>PeerAuth</h1>
        <h2>{t('whatIsThis')}</h2>
        <p>{t('intro1')}</p>
        <p>
          <a
            href='https://x.com/ai_for_success/status/1886685232952435133'
            target='_blank'
          >
            <span>{t('discussionLink')}</span>
            <span>↗</span>
          </a>
        </p>
        <p>
          <a href='https://omnihuman-lab.github.io/' target='_blank'>
            <span>{t('paperLink')}</span>
            <span>↗</span>
          </a>
        </p>
        <p>{t('intro2')}</p>
        <p>{t('solutionDesc')}</p>
        <p>{t('howItWorks')}</p>
        <ol>
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
          <li>{t('step4')}</li>
          <li>{t('step5')}</li>
        </ol>
        <p>{t('securityNote')}</p>
        <p>
          <a
            href='https://news.ycombinator.com/item?id=42942854'
            target='_blank'
          >
            <span>{t('hn')}</span>
            <span>↗</span>
          </a>
        </p>
        <p>
          <a href='https://github.com/geoochi/PeerAuth' target='_blank'>
            <span>{t('srccode')}</span>
            <span>↗</span>
          </a>
        </p>
        <div className='row'>
          <div className='col'>
            <label className='form-label'>{t('person1')}</label>
          </div>
          <div className='col'>
            <label className='form-label'>{t('person2')}</label>
          </div>
          <div className='col'></div>
        </div>
        <div className='row'>
          <div className='col'>
            <input
              type='text'
              className='form-control'
              id='name1'
              required
              onChange={e => setName1(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type='text'
              className='form-control'
              id='name2'
              required
              onChange={e => setName2(e.target.value)}
            />
          </div>
          <div className='col'>
            <button
              id='generateBtn'
              className='btn btn-primary mb-4'
              disabled={!name1 || !name2}
              onClick={generateHandler}
            >
              {t('generate')}
            </button>
          </div>
        </div>
        <br />
        <div id='qrSection' style={{ display: qrSectionDisplay }}>
          <div className='row'>
            <div className='col mb-5 text-center align-content-center qr-column'>
              <p>
                <span id='label1'>{name1}</span>
                <span>{t('pleaseScan')}</span>
              </p>
              <div id='qrcode1' className='d-flex justify-content-center'>
                <img src={url1} />
              </div>
            </div>
            <div className='col mb-5 text-center align-content-center qr-column'>
              <p>
                <span id='label2'>{name2}</span>
                <span>{t('pleaseScan')}</span>
              </p>
              <div id='qrcode2' className='d-flex justify-content-center'>
                <img src={url2} />
              </div>
            </div>
            <div className='col mb-5 text-center align-content-center qr-column'>
              <h4>{t('verificationOTP')}</h4>
              <p id='otpDisplay1' className='h2'>
                {otp}
              </p>
              <p>
                <span>{t('expiresIn')}</span>
                <span id='countdown'>{remaining}</span>
                <span>{t('seconds')}</span>
              </p>
            </div>
          </div>
          <p>{t('base32secret')}</p>
          <p id='secret' className='font-monospace'>
            {secretString}
          </p>
          <br />
        </div>
      </div>
    </>
  )
}

export default App
