import { TableBody } from '@mui/material'
import { SubHeaderLined } from 'styles/typography'

import { formatCurrency, formatNumber } from 'components/charts/d3helpers'
import React from 'react'
import { useAppSelector } from 'store/hooks'
import { PTable, PTDPrimary, PTDSecondary, PTR } from 'styles/components'
import type { ResultsPeriodType } from 'types'

type PropTypes = {
  width?: number
}

const LL97SummaryTable = (props: PropTypes) => {
  const building_outputs = useAppSelector(state => state.building_outputs)
  let width = props.width ? props.width : 600

  let carbon_periods: ResultsPeriodType[] = []
  let year_filter = [2024, 2030, 2035, 2040, 2050]

  if ('annual_result_array' in building_outputs) {
    carbon_periods = building_outputs.annual_result_array.filter(d => year_filter.includes(d.year))
  }
  return (
    <React.Fragment>
      <SubHeaderLined>LL97 Threshold Summary</SubHeaderLined>

      <PTable>
        <TableBody>
          <PTR>
            <PTDPrimary>Year</PTDPrimary>
            <PTDPrimary>Threshold (tCO2e/yr)</PTDPrimary>
            <PTDPrimary>GHG Emissions (tCO2e/yr)</PTDPrimary>
            <PTDPrimary>Penalty ($/yr)</PTDPrimary>
          </PTR>

          {carbon_periods.length === 0 ? (
            <PTR></PTR>
          ) : (
            carbon_periods.map((period, i) => {
              return (
                <PTR key={i}>
                  <PTDSecondary>{period.year}</PTDSecondary>
                  <PTDSecondary>
                    {period.threshold.absolute
                      ? formatNumber(period.threshold.absolute)
                      : period.threshold.absolute}
                  </PTDSecondary>
                  <PTDSecondary>
                    {formatNumber(period.carbon.absolute.total as number)}
                  </PTDSecondary>
                  <PTDSecondary>{formatCurrency(period.fine.absolute)}</PTDSecondary>
                </PTR>
              )
            })
          )}
        </TableBody>
      </PTable>
    </React.Fragment>
  )
}

export default LL97SummaryTable
