import type {
  CarbonChartDataTypes,
  ChartViewStackType,
  ChartViewUnitType,
  ChartViewViewType,
  CostChartDataTypes,
} from 'types'
import { formatCurrency, formatNumber } from './d3helpers'

import { bar_keys_to_labels } from 'locallaw/lookups'

import * as d3 from 'd3'

const createRowMarkup = (label: string, val: string) => {
  return `
  <tr class='hover-table-row'>
    <td class='hover-td-label'>${label}
    </td>
    <td class='hover-td-value'>${val}
    </td>
  </tr>
  `
}

export const getHoverText = (
  data: CarbonChartDataTypes | CostChartDataTypes,
  unit_type: ChartViewUnitType,
  stack_type: ChartViewStackType,
  view_type: ChartViewViewType
) => {
  let text: string

  if (view_type === 'carbon') {
    if (stack_type === 'summary') {
      text = getCarbonSummaryHoverText(data as CarbonChartDataTypes, unit_type)
    } else {
      text = getCarbonEnduseHoverText(data as CarbonChartDataTypes, unit_type)
    }
  } else {
    if (stack_type === 'summary') {
      text = getCostSummaryHoverText(data as CostChartDataTypes, unit_type)
    } else {
      text = getCostEnduseHoverText(data as CostChartDataTypes, unit_type)
    }
  }

  return text
}

export const getCarbonSummaryHoverText = (
  data_filter: CarbonChartDataTypes,
  unit_type: ChartViewUnitType
) => {
  const carbon_units = unit_type === 'absolute' ? 'tCO2e/yr' : 'tCO2e/sf/yr'
  const cost_units = unit_type === 'absolute' ? '$/yr' : '$/sf/yr'
  const decimal_places = unit_type === 'absolute' ? 0 : 4

  return `
    <div>
      <div class='hover-title'>${data_filter.period}</div>
      <table>
        ${createRowMarkup(
          `Emissions (${carbon_units}):`,
          formatNumber(data_filter.total_carbon as number, decimal_places)
        )}
        ${createRowMarkup(
          `Emissions Threshold(${carbon_units}):`,
          data_filter.threshold_carbon !== null
            ? formatNumber(data_filter.threshold_carbon as number, decimal_places)
            : 'n/a'
        )}
        ${createRowMarkup(
          `Excess Emissions(${carbon_units}):`,
          data_filter.threshold_carbon !== null
            ? formatNumber(
                d3.max([data_filter.total_carbon - data_filter.threshold_carbon, 0]) as number,
                decimal_places
              )
            : 'n/a'
        )}
        ${createRowMarkup(`Est Penalty(${cost_units}):`, formatCurrency(data_filter.fine))}
      </table>
    </div>  
  `
}

export const getCostSummaryHoverText = (
  data_filter: CostChartDataTypes,
  unit_type: ChartViewUnitType
) => {
  const cost_units = unit_type === 'absolute' ? '$/yr' : '$/sf/yr'
  const decimal_places = unit_type === 'absolute' ? 0 : 4

  return `
    <div class='hover-container'>
      <div class='hover-title'>${data_filter.period}</div>
      <table>
      ${createRowMarkup(
        `Utility Cost(${cost_units}):`,
        formatCurrency(data_filter.total_cost as number, decimal_places)
      )}
      ${createRowMarkup(
        `Est Penalty(${cost_units}):`,
        data_filter.fine ? formatCurrency(data_filter.fine as number, decimal_places) : 'n/a'
      )}
      ${createRowMarkup(
        `Total Cost(${cost_units}):`,
        formatCurrency(data_filter.total_cost + data_filter.fine, decimal_places)
      )}
      </table>
    </div>
  `
}

const getFuelEnduseData = (data: CarbonChartDataTypes | CostChartDataTypes) => {
  let enduse_array: { label: string; value: number }[] = []
  ;['elec', 'fuel_two', 'fuel_four', 'gas', 'steam'].forEach(fuel => {
    let label = bar_keys_to_labels[fuel as keyof typeof bar_keys_to_labels]
    let fuel_val = data[fuel as keyof typeof data]
    if (fuel_val !== null) {
      if (fuel_val > 0) {
        enduse_array.push({
          label: label,
          value: fuel_val as number,
        })
      }
    }
  })
  return enduse_array
}

export const getCarbonEnduseHoverText = (
  data_filter: CarbonChartDataTypes,
  unit_type: ChartViewUnitType
) => {
  const carbon_units = unit_type === 'absolute' ? 'tCO2e/yr' : 'tCO2e/sf/yr'
  const decimal_places = unit_type === 'absolute' ? 0 : 4
  const enduse_fuels = getFuelEnduseData(data_filter)

  return `
    <div>
      <div class='hover-title'>${data_filter.period}</div>
      <table>
        ${enduse_fuels
          .map(f => {
            return createRowMarkup(
              `${f.label} (${carbon_units}): `,
              formatNumber(f.value, decimal_places)
            )
          })
          .join('')}

        ${createRowMarkup(
          `Total Emissions (${carbon_units}): `,
          formatNumber(data_filter.total_carbon, decimal_places)
        )}

        ${createRowMarkup(
          `Emissions Threshold (${carbon_units}):`,
          data_filter.threshold_carbon !== null
            ? formatNumber(data_filter.threshold_carbon as number, decimal_places)
            : 'n/a'
        )}

        ${createRowMarkup(
          `Excess Emissions (${carbon_units}):`,
          data_filter.threshold_carbon !== null
            ? formatNumber(
                d3.max([data_filter.total_carbon - data_filter.threshold_carbon, 0]) as number,
                decimal_places
              )
            : 'n/a'
        )}
      </table>
    </div>  
  `
}

export const getCostEnduseHoverText = (
  data_filter: CostChartDataTypes,
  unit_type: ChartViewUnitType
) => {
  const carbon_units = unit_type === 'absolute' ? 'tCO2e/yr' : 'tCO2e/sf/yr'
  const cost_units = unit_type === 'absolute' ? '$/yr' : '$/sf/yr'
  const decimal_places = unit_type === 'absolute' ? 0 : 4
  const enduse_fuels = getFuelEnduseData(data_filter)
  return `
    <div>
      <div class='hover-title'>${data_filter.period}</div>
      <table>
        ${enduse_fuels
          .map(f => {
            return createRowMarkup(
              `${f.label} (${cost_units}): `,
              formatNumber(f.value, decimal_places)
            )
          })
          .join('')}

        ${createRowMarkup(
          `Total Utility Cost (${cost_units}): `,
          formatNumber(data_filter.total_cost, decimal_places)
        )}

        ${createRowMarkup(
          `Estimated Penalty (${cost_units}):`,
          formatNumber(data_filter.fine, decimal_places)
        )}
        ${createRowMarkup(
          `Utility Costs + Penalty (${cost_units}):`,
          formatNumber(data_filter.fine + data_filter.total_cost, decimal_places)
        )}

      </table>
    </div>  
  `
}
