import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'

import Web3ReactManager from '../components/Web3ReactManager'
import ThemeQueryParamReader from '../theme/ThemeQueryParamReader'

import Swap from './Swap'
import {
  RedirectPathToSwapOnly,
  RedirectToSwap,
  RedirectThemeOutputToSwap,
  RedirectThemeInputOutputToSwap
} from './Swap/redirects'

import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'

import Buy from './Buy'

import Pool from './Pool'
import PoolFinder from './PoolFinder'

import Ren from './Bridges/ren'

import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'

import CreatePair from './CreatePair'
import { CreatePairRedirectOldPathStructure, CreatePairRedirectDuplicateTokenIds } from './CreatePair/redirects'

import PreviewListing from './PreviewListing'

import Analyze from './Analyze'

import StakeOverview from './Stake'
import { RedirectToStake, RedirectToUnstake } from './Stake/redirects'

import { ExternalLink } from 'react-feather'
import Navigation from '../components/Navigation'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100%;
  min-height: calc(100vh - 190px);
  padding-bottom: 40px;
  background: ${({ theme }) => theme.layerBG};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    background: ${({ theme }) => theme.layerBGTablet};
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: ${({ theme }) => theme.layerBGMobile};
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  min-height: calc(100vh - 190px);
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 90px;
  box-sizing: content-box;
  align-items: center;
  flex: 1;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 0 16px;
  `};-
`

const NavigationWrapper = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  width: 15rem;
  display: flex;
  flex: 0 0 15rem;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.modalBG};
  border-left: 1px solid ${({ theme }) => theme.modalBorder};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  overflow-x: hidden;
  overflow-y: auto;
`

const FooterWrapper = styled.div`
  position: fixed;
  height: 32px;
  margin-top: -32px;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  z-index: 1;
  padding: 5px 0;
  background-color: ${({ theme }) => theme.footerBG};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.footerTextColor};
    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

const NewWindowIcon = styled(ExternalLink)`
  display: inline-block;
  margin-inline-start: 5px;
  margin-bottom: -1px;
  width: 15px;
  height: 15px;

  > * {
    stroke: ${({ theme }) => theme.footerTextColor};
  }
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={ThemeQueryParamReader} />
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            {/* <Popups /> */}
            <Web3ReactManager>
              <>
                <Switch>
                  <Route exact strict path="/buy" component={Buy} />
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact strict path="/swap/:inputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/swap/:theme/:outputCurrency" component={RedirectThemeOutputToSwap} />
                  <Route
                    exact
                    strict
                    path="/swap/:theme/:inputCurrency/:outputCurrency"
                    component={RedirectThemeInputOutputToSwap}
                  />
                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact path="/add" component={AddLiquidity} />
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  <Route exact strict path="/create" component={CreatePair} />
                  <Route exact strict path="/stake" component={StakeOverview} />
                  <Route exact strict path="/unstake" component={StakeOverview} />
                  <Route exact strict path="/stake/:currencyIdA/:currencyIdB" component={RedirectToStake} />
                  <Route exact strict path="/unstake/:currencyIdA/:currencyIdB" component={RedirectToUnstake} />
                  <Route exact path="/create/:currencyIdA" component={CreatePairRedirectOldPathStructure} />
                  <Route
                    exact
                    path="/create/:currencyIdA/:currencyIdB"
                    component={CreatePairRedirectDuplicateTokenIds}
                  />
                  <Route exact strict path="/previewlisting" component={PreviewListing} />{' '}
                  <Route exact strict path="/analyze" component={Analyze} />
                  <Route exact strict path="/ren" component={Ren} />
                  <Route component={RedirectPathToSwapOnly} />
                </Switch>
                <NavigationWrapper>
                  <Navigation />
                </NavigationWrapper>
              </>
            </Web3ReactManager>
          </BodyWrapper>
          <FooterWrapper>
            <a target="_blank" rel="noopener noreferrer" href="https://certificate.quantstamp.com/full/linkswap">
              Quantstamp Audit Report - LINKSWAP <NewWindowIcon />
            </a>
          </FooterWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
