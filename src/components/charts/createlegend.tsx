import * as d3 from "d3";

import { bindD3Element } from "./d3helpers";
import { bar_colors } from "styles/colors";
import { bar_keys_to_labels } from "locallaw/lookups";

export const createLegend = (props: {
  svg_components: { [key: string]: any };
  legend_data: string[];
}) => {
  let { legend_data, svg_components } = props;

  let { legend_g } = svg_components;

  let rect_size = 18;
  let text_padding = 5;
  let group_padding = 15;
  let top_padding = 25;
  let left_padding = 0;

  const legend_obj = legend_data.map((d) => {
    return {
      key: d,
      label: bar_keys_to_labels[d as keyof typeof bar_keys_to_labels],
      color: bar_colors[d as keyof typeof bar_colors],
    };
  });

  let legend_item = legend_g
    .selectAll(".legend-g")
    .data(legend_obj)
    .join("g")
    .attr("class", "legend-g");

  let current_position = 0;

  legend_item.each(function (d: any, i: any) {
    //@ts-ignore
    let el = d3.select(this);

    bindD3Element(el, "text", "legend-text")
      .text(d.label)
      .attr("alignment-baseline", "center")
      .attr("x", rect_size + text_padding)
      .attr("y", rect_size / 2 + 5)
      .style("font-size", 14);

    bindD3Element(el, "rect", "legend-rect")
      .attr("width", rect_size)
      .attr("height", rect_size)
      .attr("fill", d.color)
      .attr("x", 0)
      .attr("y", 0);

    let text_width = el.node().getBBox().width;

    el.attr(
      "transform",
      `translate(${left_padding + current_position},${top_padding})`
    );
    current_position += text_width + group_padding;
  });
};
