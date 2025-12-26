import { styled } from '@mui/material/styles'
import { formatCurrency, formatNumber } from 'components/charts/d3helpers'
import React from 'react'
import { useAppSelector } from 'store/hooks'
import { colors } from 'styles/colors'
import { PrintLI, PrintUL } from 'styles/components'
import type { ResultsPeriodType } from 'types'
type PropTypes = {}

const HighlightWrapper = (props: any) => {
  return (
    <React.Fragment>
      {' '}
      <HighlightText>{props.children}</HighlightText>{' '}
    </React.Fragment>
  )
}

const HighlightText = styled('span')`
  /* font-family: CircularStd-Bold; */
  background-color: ${colors.primary.main};
  white-space: nowrap;
  /* padding-left: 2px; */
  /* padding-right: 2px; */
`

const DynamicText = (props: PropTypes) => {
  const building_outputs = useAppSelector(state => state.building_outputs)

  let { annual_result_array } = building_outputs

  let carbon_periods: ResultsPeriodType[] = []
  let year_filter = [2024, 2030, 2035, 2040, 2050]

  if ('annual_result_array' in building_outputs) {
    carbon_periods = building_outputs.annual_result_array.filter(d => year_filter.includes(d.year))
  }

  return (
    <PrintUL>
      <PrintLI>
        From 2024-29, a yearly penalty of
        <HighlightWrapper>
          {formatCurrency(carbon_periods[0]?.fine.absolute)} dollars
        </HighlightWrapper>
        will be incurred, based on
        <HighlightWrapper>
          {formatNumber(carbon_periods[1]?.carbon.absolute.total as number)} tCO2e/yr GHG
        </HighlightWrapper>
        emissions generated,
        <HighlightWrapper>
          {formatNumber(carbon_periods[0]?.excess_carbon.absolute)} tCO2e
        </HighlightWrapper>
        in excess of your 2024-29 emissions threshold.
      </PrintLI>
      <PrintLI>
        From 2030-34, a yearly penalty of
        <HighlightWrapper>
          {formatCurrency(carbon_periods[1]?.fine.absolute)} dollars
        </HighlightWrapper>
        dollars will be incurred, based on
        <HighlightWrapper>
          {formatNumber(carbon_periods[1]?.carbon.absolute.total as number)} tCO2e GHG
        </HighlightWrapper>
        emissions generated,
        <HighlightWrapper>
          {formatNumber(carbon_periods[1]?.excess_carbon.absolute)} tCO2e in excess
        </HighlightWrapper>
        of your 2030-34 emissions threshold.
      </PrintLI>
      <PrintLI>
        From 2035-39, a yearly penalty of
        <HighlightWrapper>
          {formatCurrency(carbon_periods[2]?.fine.absolute)} dollars
        </HighlightWrapper>
        will be incurred, based on
        <HighlightWrapper>
          {formatNumber(carbon_periods[2]?.carbon.absolute.total as number)} tCO2e GHG
        </HighlightWrapper>
        emissions generated,
        <HighlightWrapper>
          {formatNumber(carbon_periods[2]?.excess_carbon.absolute)} tCO2e in excess
        </HighlightWrapper>
        of your 2035-39 emissions threshold.
      </PrintLI>

      <PrintLI>
        From 2040-49, a yearly penalty of
        <HighlightWrapper>
          {formatCurrency(carbon_periods[3]?.fine.absolute)} dollars
        </HighlightWrapper>
        will be incurred, based on
        <HighlightWrapper>
          {formatNumber(carbon_periods[3]?.carbon.absolute.total as number)} tCO2e GHG
        </HighlightWrapper>
        emissions generated,
        <HighlightWrapper>
          {formatNumber(carbon_periods[3]?.excess_carbon.absolute)} tCO2e in excess
        </HighlightWrapper>
        of your 2040-49 emissions threshold.
      </PrintLI>

      <PrintLI>
        From 2050 onwards, a yearly penalty of
        <HighlightWrapper>
          {formatCurrency(carbon_periods[4]?.fine.absolute)} dollars
        </HighlightWrapper>
        will be incurred, based on
        <HighlightWrapper>
          {formatNumber(carbon_periods[4]?.carbon.absolute.total as number)} tCO2e GHG
        </HighlightWrapper>
        emissions generated,
        <HighlightWrapper>
          {formatNumber(carbon_periods[4]?.excess_carbon.absolute)} tCO2e in excess
        </HighlightWrapper>
        of your 2050 emissions threshold.
      </PrintLI>
    </PrintUL>
  )
}

export default DynamicText
