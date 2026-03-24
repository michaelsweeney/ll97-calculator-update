import * as React from 'react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { uiActions } from 'store/uislice'

import { colors } from 'styles/colors'

import { InfoIconButton, PrintIconButton, ShareIconButton } from './iconbuttons'
import { encodeScenario } from '../shared/urlState'
import { toScenario } from '../lib/scenarioAdapter'
import NavMenu from './navmenu'
import ModalWrapper from './modals/modalwrapper'

import { styled } from '@mui/material/styles'
import CalcLogo from './calclogo'

const left_width = '350px'
const right_width = '200px'

const HeaderBuildingTitle = styled('div')`
  display: block;
  text-align: left;
  color: ${colors.grays.dark};
  font-size: 36px;
  font-family: CircularStd-Medium;
  cursor: pointer;
  &:hover {
    color: ${colors.grays.light};
  }
`

const HeaderLL84Label = styled('div')`
  display: block;
  text-align: left;
  color: ${colors.grays.dark};
  font-size: 20px;
  font-family: CircularStd-Book;
  margin-left: 5px;
  letter-spacing: 0.1em;
  cursor: pointer;
  &:hover {
    color: ${colors.grays.light};
  }
`

const HeaderBuildingTitleGray = styled(HeaderBuildingTitle)`
  font-family: CircularStd-Book;
  color: rgb(180, 180, 180);
  cursor: pointer;
  transition: color 200ms;
  &:hover {
    color: ${colors.grays.light};
  }
`

const Right = styled('div')`
  width: ${right_width};
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  box-sizing: border-box;
`

const Middle = styled('div')`
  width: calc(100% - ${left_width} - ${right_width});
  text-align: left;
  display: inline-block;
  vertical-align: middle;
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
`

const Left = styled('div')`
  width: ${left_width};
  display: inline-block;
  vertical-align: middle;
  padding-left: 25px;
  padding-right: 15px;
  box-sizing: border-box;
`

const TitleContainer = styled('div')``

const ShareDialogLabel = styled('div')`
  font-family: CircularStd-Bold;
  font-size: 12px;
  color: ${colors.grays.light};
  margin-top: 16px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const ShareDialogValue = styled('div')`
  font-family: monospace;
  font-size: 13px;
  background: ${colors.grays.extralight};
  border: 1px solid #d0d0d0;
  border-radius: 2px;
  padding: 10px 12px;
  word-break: break-all;
  color: ${colors.grays.dark};
`

const ShareDialogCopied = styled('div')`
  font-family: CircularStd-Book;
  font-size: 14px;
  color: ${colors.secondary.main};
  margin-bottom: 8px;
`

const PrintButtonWrapper = styled('div')`
  display: inline-block;
  position: relative;
  left: 45px;
  top: -5px;
`
const ShareButtonWrapper = styled('div')`
  display: inline-block;
  position: relative;
  left: 35px;
  top: -5px;
`
const InfoIconButtonWrapper = styled('div')`
  display: inline-block;
  position: relative;
  left: 40px;
  top: -5px;
`
const NavButtonWrapper = styled('div')`
  display: inline-block;
  position: relative;
  left: 50px;
`

const Header = () => {
  const dispatch = useAppDispatch()
  const [shareDialog, setShareDialog] = useState<{ url: string; blob: string } | null>(null)
  const { is_ll84_loaded, ll84_year_label, ll84_building_name } = useAppSelector(
    state => state.ll84_query
  )
  const building_inputs = useAppSelector(state => state.building_inputs)
  const ll84_query = useAppSelector(state => state.ll84_query)

  const handleLL84NameClick = () => {
    dispatch(uiActions.setCurrentView('load_building_dialogue'))
  }

  const handleLL84YearClick = () => {
    dispatch(uiActions.setCurrentView('building_summary_dialogue'))
  }

  const handleInfoClick = () => {
    dispatch(uiActions.setCurrentView('calc_info_dialogue'))
  }

  const handleShare = () => {
    const scenario = toScenario(building_inputs, ll84_query)
    const encoded = encodeScenario(scenario)
    const url = new URL(window.location.href)
    url.searchParams.set('state', encoded)
    const fullUrl = url.toString()
    navigator.clipboard.writeText(fullUrl)
    setShareDialog({ url: fullUrl, blob: encoded })
  }

  return (
    <React.Fragment>
      <ModalWrapper
        isOpen={shareDialog !== null}
        exitCallback={() => setShareDialog(null)}
        modalTitle="Link copied to clipboard"
        closable={true}
      >
        <ShareDialogCopied>URL copied to clipboard.</ShareDialogCopied>
        <ShareDialogLabel>URL</ShareDialogLabel>
        <ShareDialogValue>{shareDialog?.url}</ShareDialogValue>
        <ShareDialogLabel>State blob</ShareDialogLabel>
        <ShareDialogValue>{shareDialog?.blob}</ShareDialogValue>
      </ModalWrapper>

      <Left>
        <CalcLogo />
      </Left>
      <Middle>
        <div>
          {is_ll84_loaded ? (
            <TitleContainer>
              <HeaderBuildingTitle onClick={handleLL84NameClick}>
                {ll84_building_name}
              </HeaderBuildingTitle>
              <HeaderLL84Label onClick={handleLL84YearClick}>{ll84_year_label}</HeaderLL84Label>
            </TitleContainer>
          ) : (
            <HeaderBuildingTitleGray onClick={handleLL84NameClick}>
              find your building
            </HeaderBuildingTitleGray>
          )}
        </div>
      </Middle>
      <Right>
        <ShareButtonWrapper>
          <ShareIconButton width={25} height={25} active={shareDialog !== null} clickCallback={handleShare} />
        </ShareButtonWrapper>

        <InfoIconButtonWrapper>
          <InfoIconButton width={25} height={25} clickCallback={handleInfoClick} />
        </InfoIconButtonWrapper>

        <PrintButtonWrapper>
          <PrintIconButton width={25} height={25} clickCallback={() => window.print()} />
        </PrintButtonWrapper>

        <NavButtonWrapper>
          <NavMenu />
        </NavButtonWrapper>
      </Right>
    </React.Fragment>
  )
}

export default Header
