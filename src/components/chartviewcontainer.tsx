import * as React from 'react'
import { colors } from 'styles/colors'

import { styled } from '@mui/material/styles'
import ChartOptionSelector from './chartoptionselector'
import ChartView from './charts/chartview'
import ChartViewSelector from './chartviewselector'

const top_height = '60px'
const bottom_height = '60px'

const Top = styled('div')`
  height: ${top_height};
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`

const Main = styled('div')`
  height: calc(100% - ${top_height} - ${bottom_height});
  width: 100%;
  display: inline-block;
  border-top: 1px solid ${colors.grays.light};
  border-bottom: 1px solid ${colors.grays.light};
`
const Bottom = styled('div')`
  height: ${bottom_height};
  width: '100%';
  display: 'inline-block';
  white-space: 'nowrap';
  overflow: 'hidden';
`

const ChartViewContainer = () => {
  return (
    <React.Fragment>
      <Top>
        <ChartViewSelector />
      </Top>
      <Main>
        <ChartView />
      </Main>
      <Bottom>
        <ChartOptionSelector />
      </Bottom>
    </React.Fragment>
  )
}

export default ChartViewContainer
