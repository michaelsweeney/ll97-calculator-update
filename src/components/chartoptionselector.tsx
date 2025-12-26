import { useAppDispatch, useAppSelector } from 'store/hooks'
import { uiActions } from 'store/uislice'

import { styled } from '@mui/material/styles'
import { colors } from 'styles/colors'
import ChartToggleButton from './charttogglebutton'

const MainContainer = styled('div')`
  margin-left: 20px;
  margin-right: 0px;
  padding-top: 7px;
  padding-bottom: 0px;
  box-sizing: border-box;
`

const ToggleContainer = styled('div')`
  display: inline-block;
  margin-right: 10px;
`

const ToggleLabel = styled('div')`
  display: inline-block;
  margin-right: 7.5px;
  font-size: 12px;
  color: ${colors.secondary.dark};
`

const ChartOptionSelector = () => {
  const { stack_type, unit_type } = useAppSelector(state => state.ui.chart_view)
  const dispatch = useAppDispatch()

  const changeUnitCallback = (d: string) => {
    dispatch(
      uiActions.setChartView({
        view_key: 'unit_type',
        view_value: d,
      })
    )
  }

  const changeStackCallback = (d: string) => {
    dispatch(
      uiActions.setChartView({
        view_key: 'stack_type',
        view_value: d,
      })
    )
  }

  return (
    <MainContainer>
      <ToggleContainer>
        <ToggleLabel>units</ToggleLabel>
        <ChartToggleButton
          size="small"
          label="absolute"
          view_key="absolute"
          is_active={unit_type === 'absolute'}
          callback={changeUnitCallback}
        />
        <ChartToggleButton
          size="small"
          label="normalized"
          view_key="normalized"
          is_active={unit_type === 'normalized'}
          callback={changeUnitCallback}
        />
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>group</ToggleLabel>
        <ChartToggleButton
          size="small"
          label="summary"
          view_key="summary"
          is_active={stack_type === 'summary'}
          callback={changeStackCallback}
        />
        <ChartToggleButton
          size="small"
          label="end uses"
          view_key="enduse"
          is_active={stack_type === 'enduse'}
          callback={changeStackCallback}
        />
      </ToggleContainer>
    </MainContainer>
  )
}

export default ChartOptionSelector
