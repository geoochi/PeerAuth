import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

const QrSection: React.FC = () => {
  const { t } = useTranslation()
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [url1, setUrl1] = useState('')
  const [url2, setUrl2] = useState('')
  const [token, setToken] = useState('')
  const [remaining, setRemaining] = useState(-1)
  const [secret, setSecret] = useState('')
  const [isDisplay, setIsDisplay] = useState(false)
  const [intervalNumber, setIntervalNumber] = useState<NodeJS.Timeout | null>(
    null
  )

  const generateHandler = async () => {
    const secret = new OTPAuth.Secret({ size: 20 }).base32
    setSecret(secret)
    const totp1 = new OTPAuth.TOTP({
      issuer: 'PeerAuth',
      label: encodeURIComponent(name2),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })
    const totp2 = new OTPAuth.TOTP({
      issuer: 'PeerAuth',
      label: encodeURIComponent(name1),
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
      setToken(`${totp1.generate()}`)
      setRemaining(remaining)
    }
    updateOtpDisplay()
    setIsDisplay(true)
    if (intervalNumber) clearInterval(intervalNumber)
    setIntervalNumber(setInterval(updateOtpDisplay, 1000))
  }

  return (
    <>
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
      {isDisplay && (
        <div id='qrSection'>
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
                {token}
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
            {secret}
          </p>
          <br />
        </div>
      )}
    </>
  )
}

export default QrSection
