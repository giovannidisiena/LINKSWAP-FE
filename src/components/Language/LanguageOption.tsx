import React from 'react'
import styled from 'styled-components'
import i18next from 'i18next'
import ReactGA from 'react-ga'

export const LanguageOptionBody = styled.div`
  padding: 0.5rem;
  padding-inline-start: 1rem;
  padding-inline-end: 0;
  text-align: start;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid-column;
  display: inline-grid;
  font-size: 14px;
  height: 33px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
  :hover,
  :focus {
    cursor: pointer;
    background: ${({ theme }) => theme.modalSecondaryBG};
  }
`

const LanguageOption = styled.div`
  flex: 0 0 100%;
  flex-wrap: wrap;
  display: flex;
`

const LanguageShortCode = styled.span`
  text-transform: uppercase;
`

function setLang(lang?: string | 'en') {
  i18next.changeLanguage(lang!, () => {
    ReactGA.event({
      category: 'Language',
      action: 'Change language',
      label: lang
    })
  })
  document.body.dir = i18next.dir(lang!)
}

export default function LanguageOptionHelper(props: {
  languageString: string
  shortCode: string
  fullWidth?: boolean
}) {
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)
  const fontWeight = lang === props.shortCode ? 'bold' : 'normal'
  const width = props.fullWidth ? '100%' : '8.7rem'

  return (
    <LanguageOptionBody style={{ fontWeight: fontWeight, width: width }} onClick={() => setLang(props.shortCode)}>
      <LanguageOption>
        <LanguageShortCode>{props.shortCode}</LanguageShortCode>&nbsp;-&nbsp;{props.languageString}
      </LanguageOption>
    </LanguageOptionBody>
  )
}
