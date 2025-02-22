import QRCode from 'qrcode'
import { useState } from 'react'
import * as OTPAuth from 'otpauth'

const App = () => {
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [intervalNumber, setIntervalNumber] = useState<NodeJS.Timeout | null>(
    null
  )
  const generateHandler = async () => {
    const secret = new OTPAuth.Secret({ size: 20 })
    const totp = new OTPAuth.TOTP({
      issuer: 'PeerAuth',
      label: encodeURIComponent('test'),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })
    setUrl(await QRCode.toDataURL(totp.toString()))
    function updateOtpDisplay() {
      const now = Math.floor(Date.now() / 1000)
      const remaining = totp.period - (now % totp.period)

      setText(`${totp.generate()} (expires in ${remaining} seconds)`)
    }
    updateOtpDisplay()
    if (intervalNumber) clearInterval(intervalNumber)
    setIntervalNumber(setInterval(updateOtpDisplay, 1000))
  }

  return (
    <>
      <button onClick={generateHandler}>Generate</button>
      <img src={url} />
      <p>{text}</p>
    </>
  )
}

export default App
