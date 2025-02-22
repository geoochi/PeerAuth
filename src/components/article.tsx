import { useTranslation } from 'react-i18next'

const Article = () => {
  const { t } = useTranslation()
  return (
    <>
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
        <a href='https://news.ycombinator.com/item?id=42942854' target='_blank'>
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
    </>
  )
}

export default Article
