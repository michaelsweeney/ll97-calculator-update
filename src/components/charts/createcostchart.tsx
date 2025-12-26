import * as d3 from 'd3'
import { bar_colors, darkened_bar_colors } from 'styles/colors'
import type { ChartViewStackType, ChartViewUnitType, CostChartDataTypes, D3StackType } from 'types'
import { getMaxValFromStack } from './d3helpers'

import { handleBarMouseout, handleBarMouseover } from './hovercallbacks'

export const createCostChart = (props: {
  chart_data: CostChartDataTypes[]
  stack_data: D3StackType
  svg_components: { [key: string]: any }
  unit_type: ChartViewUnitType
  stack_type: ChartViewStackType
}) => {
  let { chart_data, stack_data, svg_components, unit_type, stack_type } = props

  let { xScale, title_text, hover_div, table_g } = svg_components

  title_text.text('Annual Cost Summary')

  let yScale = d3
    .scaleLinear()
    .range([svg_components.plot_dims.height, 0])
    .domain([0, (getMaxValFromStack(stack_data) as number) * svg_components.y_padding])

  let colorScale = d3
    .scaleOrdinal()
    .domain(chart_data[0].stack_keys)
    .range(chart_data[0].stack_keys.map(d => bar_colors[d]))
  let colorScaleHover = d3
    .scaleOrdinal()
    .domain(chart_data[0].stack_keys)
    .range(chart_data[0].stack_keys.map(d => darkened_bar_colors[d]))
  let yaxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickFormat(d3.format(unit_type === 'absolute' ? '$~s' : '.1'))
  svg_components.y_axis_g.call(yaxis)
  svg_components.y_axis_g.selectAll('line').remove()
  svg_components.y_axis_g.selectAll('.domain').remove()

  svg_components.gridlines_g
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-svg_components.plot_dims.width))
    .style('stroke-dasharray', '1 1')
  svg_components.gridlines_g.selectAll('text').remove()
  svg_components.gridlines_g.selectAll('.domain').remove()

  svg_components.y_label.text(() => {
    return unit_type === 'absolute' ? '$/yr' : '$/sf/yr'
  })

  let stacked_group_g = svg_components.bar_g
    .selectAll('.stacked-group-g')
    .data(stack_data)
    .join('g')
    .attr('class', 'stacked-group-g')
    .attr('fill', (d: any, i: number) => colorScale(d.key))
    .attr('data-key', (d: any) => d.key)

  let stacked_rects = stacked_group_g
    .selectAll('.stacked-rect')
    .data((d: any, i: number) => d)
    .join('rect')
    .attr('class', 'stacked-rect')
    .attr('data-object', function (d: any) {
      let obj = {
        year: d.data.year,
        bottom: d[0],
        top: d[1],
        //@ts-ignore
        key: this.parentNode.getAttribute('data-key'),
      }
      return JSON.stringify(obj)
    })
    .attr('x', (d: any) => xScale(d.data.year))
    .attr('y', (d: any) => yScale(d[1]))
    .attr('height', (d: any) => {
      return yScale(d[0]) - yScale(d[1])
    })
    .attr('width', (d: any) => {
      return d.data.period_length * svg_components.width_per_year
    })
    .style('cursor', 'pointer')
    .on('mouseover', (event: any, data: any) => {
      handleBarMouseover(
        event,
        data,
        stacked_rects,
        table_g,
        hover_div,
        colorScaleHover,
        chart_data,
        unit_type,
        stack_type,
        'cost'
      )
    })
    .on('mouseout', (event: any, data: any) => {
      handleBarMouseout(data, stacked_rects, table_g, hover_div, colorScale)
    })
    .on('mousemove', function (event: any) {
      // handleMouseMove(event, hover_div, "top");
    })

  svg_components.threshold_g.remove()
}
