import { useAppSelector } from 'store/hooks'
import type { D3WrapperCallbackPropTypes } from 'types'
import SVGWrapper from './svgwrapper'

import { setupSVGComponents } from './setupsvgcomponents'
import { getCarbonChartData, getCostChartData } from './transformdata'

import { createCarbonChart } from './createcarbonchart'
import { createCostChart } from './createcostchart'
import { createLegend } from './createlegend'
import { createTable } from './createtable'

import type { ChartViewStackType, ChartViewUnitType, ChartViewViewType } from 'types'
import './hoverstyles.css'

type ChartViewPropTypes = {
  view_type?: ChartViewViewType
  unit_type?: ChartViewUnitType
  stack_type?: ChartViewStackType
  container_padding?: { [key: string]: number }
  show_title?: boolean
}

const ChartView = (props: ChartViewPropTypes) => {
  const { chart_view } = useAppSelector(state => state.ui)

  let view_type = props.view_type ? props.view_type : chart_view.view_type
  let unit_type = props.unit_type ? props.unit_type : chart_view.unit_type
  let stack_type = props.stack_type ? props.stack_type : chart_view.stack_type

  let show_title = props.show_title !== undefined ? props.show_title : true

  const { window_size } = useAppSelector(state => state.ui)
  const building_outputs = useAppSelector(state => state.building_outputs)

  const createLayout = (callback_config: D3WrapperCallbackPropTypes) => {
    const { container_dimensions, container_ref } = callback_config

    let container_padding = props.container_padding
      ? props.container_padding
      : {
          t: 60,
          l: 100,
          r: 75,
          b: 25,
        }

    let y_padding = 1.15
    let legend_height = 40
    let table_height = 130

    if (Object.keys(building_outputs).length === 0) {
      return <div>No Data</div>
    } else {
      let svg_components = setupSVGComponents(
        container_dimensions,
        container_ref,
        container_padding,
        y_padding,
        legend_height,
        table_height
      )

      let cost_chart_data = getCostChartData(building_outputs, stack_type, unit_type)

      let carbon_chart_data = getCarbonChartData(building_outputs, stack_type, unit_type)

      let { width_per_year } = svg_components

      let { is_input_info_missing } = building_outputs
      if (
        width_per_year < 0 ||
        is_input_info_missing ||
        (container_dimensions.width === 50 && container_dimensions.height === 50)
      ) {
        return
      }

      if (view_type === 'cost') {
        createCostChart({
          chart_data: cost_chart_data.chart_data,
          stack_data: cost_chart_data.stack_data,
          svg_components,
          unit_type,
          stack_type,
        })
        createLegend({
          legend_data: cost_chart_data.legend_data,
          svg_components,
        })

        createTable({
          chart_data: cost_chart_data.chart_data,
          svg_components,
          stack_type,
          view_type,
          unit_type,
          window_size,
        })
      } else {
        createCarbonChart({
          chart_data: carbon_chart_data.chart_data,
          stack_data: carbon_chart_data.stack_data,
          svg_components,
          unit_type,
          stack_type,
        })

        createLegend({
          legend_data: carbon_chart_data.legend_data,
          svg_components,
        })

        createTable({
          chart_data: cost_chart_data.chart_data,
          svg_components,
          stack_type,
          view_type,
          unit_type,
          window_size,
        })
      }

      if (!show_title) {
        svg_components.title_text.text('')
      }
    }
  }

  return <SVGWrapper createChartCallback={createLayout} />
}

export default ChartView
