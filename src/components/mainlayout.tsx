import ChartViewContainer from './chartviewcontainer'
import Footer from './footer'
import Header from './header'
import Sidebar from './sidebar'

import NoFineLanguage from './dialogues/nofinelanguage'
import NoInputLanguage from './dialogues/noinputlanguage'

import BuildingSummaryDialogue from './dialogues/ll84summarydialogue'
// import NoSummaryDialogue from "./dialogues/nosummarydialogue";
import CalcInfoDialogue from './dialogues/calcinfodialogue'
import LoadBuildingDialogue from './dialogues/loadbuildingdialogue'

import { styled } from '@mui/material/styles'
import { useAppSelector } from 'store/hooks'
import { chart_background_color, colors } from 'styles/colors'

const sidebar_width = '350px'
const border_color = colors.secondary.main

const border_width = '4px'

const MainContainer = styled('div')`
  width: calc(100% - ${sidebar_width});
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  background-color: ${chart_background_color};
`

const SidebarContainer = styled('div')`
  width: ${sidebar_width};
  height: 100%;
  border-right: ${border_width} solid ${border_color};
  padding: 10px;
  display: inline-block;
  box-sizing: border-box;
  overflow-y: scroll;
`

const FooterContainer = styled('div')`
  width: 100%;
  height: 50px;
  border-top: ${border_width} solid ${border_color};
  box-sizing: border-box;
`

const MiddleContainer = styled('div')`
  width: 100%;
  height: calc(100% - 100px - 50px);
  box-sizing: border-box;
`

const HeaderContainer = styled('div')`
  width: 100%;
  height: 100px;
  border-bottom: ${border_width} solid ${border_color};
  box-sizing: border-box;
`

const Root = styled('div')`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
`

const MainLayout = () => {
  const { is_greater_than_25k_sf, is_input_info_missing } = useAppSelector(
    state => state.building_outputs
  )
  const { current_view } = useAppSelector(state => state.ui)

  const ChartViewComponent = () => {
    return is_input_info_missing ? (
      <NoInputLanguage />
    ) : !is_greater_than_25k_sf ? (
      <NoFineLanguage />
    ) : (
      <ChartViewContainer />
    )
  }

  const CurrentViewComponent = () => {
    switch (current_view) {
      case 'building_summary_dialogue':
        return <BuildingSummaryDialogue />

      case 'load_building_dialogue':
        return <LoadBuildingDialogue />

      case 'chart_view':
        return <ChartViewComponent />

      case 'calc_info_dialogue':
        return <CalcInfoDialogue />

      default:
        return <ChartViewComponent />
    }
  }

  return (
    <Root>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <MiddleContainer>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <MainContainer>
          <CurrentViewComponent />
        </MainContainer>
      </MiddleContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Root>
  )
}

export default MainLayout
