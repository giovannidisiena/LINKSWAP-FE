import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import logo from '../../assets/svg/logo.png'

import { YellowCard } from '../Card'
import Theme from '../Theme'
import Settings from '../Settings'
import Language from '../Language'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: relative;
  z-index: 2;
  background-color: ${({ theme }) => theme.headerBG};
  color: ${({ theme }) => theme.headerTextColor};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementMobile = styled.div`
  display: flex;
  align-items: flex-start;
  @media (max-width: 699px) {
    display: none;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 0.5rem 0;
`};
`

const Logo = styled.img`
  height: 30px;
  margin-inline-end: 8px;
`

const Title = styled.a`
  display: flex;
  align-items: flex-start;
  color: #ffffff;
  text-decoration: none;
  pointer-events: auto;
  :hover {
    cursor: pointer;
  }
`

const TitleText = styled.h1`
  margin: 0;
  padding: 0;
  font-family: 'Formular Thin', sans-serif;
  font-size: 24px;
  font-weight: 100;
  letter-spacing: 0.3em;
  color: ${({ theme }) => theme.headerTextColor};
`

const MenuText = styled.h3`
  margin: 0;
  padding: 0;
  font-family: 'Work Sans Thin', sans-serif;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.06em;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  color: ${({ theme }) => theme.headerTextColor};

  :hover {
    border-bottom: 2px solid ${({ theme }) => theme.headerTextColor};
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.modalBG : theme.headerButtonBG)};
  border-radius: 6px;
  white-space: nowrap;
  width: 100%;
  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-inline-start: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-inline-end: 10px;
  border-radius: 6px;
  padding: 8px 12px;
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.headerButtonIconColor}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'center' }} padding="1rem">
        <HeaderElement>
          <Title href="https://yflink.io">
            <Logo src={logo}></Logo>
            <TitleText>YFLINK</TitleText>
          </Title>{' '}
          {!isMobile && (
            <HeaderElementMobile>
              <Title
                style={{ marginTop: 4, marginInlineStart: 24 }}
                target="_blank"
                href="https://rewards.linkswap.app/"
              >
                <MenuText>LP Rewards</MenuText>
              </Title>
              <Title style={{ marginTop: 4, marginInlineStart: 36 }} target="_blank" href="https://yflink.io/#/vote">
                <MenuText>VOTE</MenuText>
              </Title>
              <Title
                style={{ marginTop: 4, marginInlineStart: 24 }}
                href="https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
              >
                <MenuText>Buy YFL</MenuText>
              </Title>
            </HeaderElementMobile>
          )}
        </HeaderElement>
        <HeaderControls>
          <HeaderElementWrap>
            <Language />
            <Theme />
            <Settings />
          </HeaderElementWrap>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
