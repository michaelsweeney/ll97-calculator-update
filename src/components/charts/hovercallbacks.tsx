import * as d3 from "d3";

import { getHoverText } from "./hovertext";
import { getHoverPosition } from "./d3helpers";

function handleBarMouseover(
  event: any,
  data: any,
  stacked_rects: any,
  table_g: any,
  hover_div: any,
  colorScaleHover: any,
  chart_data: any,
  unit_type: any,
  stack_type: any,
  view_type: any
) {
  let { year } = data.data;

  /* ---- set other rect styles in year-group ---- */
  stacked_rects.nodes().forEach((node: any) => {
    let node_data = JSON.parse(node.getAttribute("data-object"));
    if (year === node_data.year) {
      //@ts-ignore
      d3.select(node).attr("fill", (d: any) => colorScaleHover(node_data.key));
    }
  });

  /* ---- set table styles in year-group ---- */
  table_g
    .selectAll(".table-column-g")
    .nodes()
    .forEach((el: any) => {
      let node_year = +el.getAttribute("data-year");
      if (year === node_year) {
        // restyle table columns
        d3.select(el)
          .selectAll(".table-val-text")
          .style("font-family", "CircularStd-Bold");
        d3.select(el)
          .selectAll(".period-title-text")
          .style("font-family", "CircularStd-Black");
      }
    });

  /* ---- set hover style and position ---- */
  hover_div.style("visibility", "visible");

  let { left_position, top_position } = getHoverPosition(event, "top");

  hover_div.style("left", left_position).style("top", top_position);
  let data_filter = chart_data.find(
    (d: any) => d.year === year
  ) as typeof chart_data[0];

  hover_div.html(() =>
    getHoverText(data_filter, unit_type, stack_type, view_type)
  );
}

function handleBarMouseout(
  data: any,
  stacked_rects: any,
  table_g: any,
  hover_div: any,
  colorScale: any
) {
  let { year } = data.data;

  /* ---- reset other rect styles in year-group ---- */
  stacked_rects.nodes().forEach((node: any) => {
    let node_data = JSON.parse(node.getAttribute("data-object"));
    if (year === node_data.year) {
      //@ts-ignore
      d3.select(node).attr("fill", (d: any) => colorScale(node_data.key));
    }
  });

  /* ---- reset table styles in year-group ---- */
  table_g
    .selectAll(".table-column-g")
    .nodes()
    .forEach((el: any) => {
      let node_year = +el.getAttribute("data-year");
      if (year === node_year) {
        d3.select(el)
          .selectAll(".table-val-text")
          .style("font-family", "CircularStd-Book");
        d3.select(el)
          .selectAll(".period-title-text")
          .style("font-family", "CircularStd-Bold");
      }
    });

  /* ---- set hover style and position ---- */
  hover_div.style("visibility", "hidden");
}

function handleTableMouseover(
  el: any,
  event: any,
  plot_g: any,
  colorScaleHover: any,
  hover_div: any,
  chart_data: any,
  unit_type: any,
  stack_type: any,
  view_type: any
) {
  //@ts-ignore
  let year = +el.getAttribute("data-year");

  /* ---- set table column styles ---- */
  d3.select(el)
    .selectAll(".table-val-text")
    .style("font-family", "CircularStd-Bold");
  d3.select(el)
    .selectAll(".period-title-text")
    .style("font-family", "CircularStd-Black");

  /* ---- set bar styles in year-group ---- */
  plot_g
    .selectAll(".stacked-rect")
    .nodes()
    .forEach((node: any) => {
      let node_data = JSON.parse(node.getAttribute("data-object"));
      if (+year === +node_data.year) {
        //@ts-ignore
        d3.select(node).attr("fill", (d: any) =>
          colorScaleHover(node_data.key)
        );
      }
    });

  /* ---- set hover style and position ---- */
  hover_div.style("visibility", "visible");
  let { left_position, top_position } = getHoverPosition(event, "bottom");

  hover_div.style("left", left_position).style("top", top_position);

  let data_filter = chart_data.find(
    (d: any) => d.year === +year
  ) as typeof chart_data[0];

  hover_div.html(() =>
    getHoverText(data_filter, unit_type, stack_type, view_type)
  );
}

function handleTableMouseout(
  el: any,
  plot_g: any,
  hover_div: any,
  colorScale: any
) {
  let year = +el.getAttribute("data-year");

  /* ---- set table column styles ---- */
  d3.select(el)
    .selectAll(".table-val-text")
    .style("font-family", "CircularStd-Medium");
  d3.select(el)
    .selectAll(".period-title-text")
    .style("font-family", "CircularStd-Bold");

  /* ---- reset bar styles in year-group ---- */
  plot_g
    .selectAll(".stacked-rect")
    .nodes()
    .forEach((node: any) => {
      let node_data = JSON.parse(node.getAttribute("data-object"));
      if (year === +node_data.year) {
        //@ts-ignore
        d3.select(node).attr("fill", (d: any) => colorScale(node_data.key));
      }
    });
  /* ---- set hover style and position ---- */
  hover_div.style("visibility", "hidden");
}

function handleMouseMove(
  event: any,
  hover_div: any,
  direction: "top" | "bottom"
) {
  let { left_position, top_position } = getHoverPosition(event, direction);
  hover_div.style("left", left_position).style("top", top_position);
}

export {
  handleBarMouseout,
  handleBarMouseover,
  handleTableMouseout,
  handleTableMouseover,
  handleMouseMove,
};
