import * as d3 from "d3";
type ColorGroupTypes = {
  [key: string]: string;
};

type ColorTypes = {
  primary: ColorGroupTypes;
  secondary: ColorGroupTypes;
  reds: ColorGroupTypes;
  greens: ColorGroupTypes;
  blues: ColorGroupTypes;
  grays: ColorGroupTypes;
  whites: ColorGroupTypes;
  akf: ColorGroupTypes;
};

export const colors: ColorTypes = {
  primary: {
    light: "#dcea9a",
    main: "#BAD636",
    dark: "#9CB62A",
  },
  secondary: {
    light: "#878787",
    main: "#595954",
    dark: "#282826",
  },
  reds: {
    light: "rgb(178,50,50)",
    medium: "rgb(161,46,46)",
    dark: "rgb(131,37,37)",
  },
  greens: {
    light: "rgb(110,177,44)",
    medium: "rgb(95,153,38)",
    dark: "rgb(79,127,32)",
  },
  blues: {
    light: "rgb(53,143,180)",
    medium: "rgb(44,122,156)",
    dark: "rgb(35,103,133)",
  },
  grays: {
    extralight: "rgb(235,235,235)",
    light: "#878787",
    medium: "#595954",
    dark: "#3B3B3B",
  },
  whites: {
    medium: "#fff",
  },
  akf: {
    red: "#cf202e",
    gray: "gray",
  },
};

export const bar_colors: { [key: string]: string } = {
  elec: "#358FB4",
  gas: "#6EB12C",
  steam: "#B23232",
  fuel_two: "#A644E2",
  fuel_four: "#62009E",
  fine: colors.grays.medium,
  threshold_carbon: colors.primary.main,
  under_carbon: colors.primary.main,
  excess_carbon: colors.grays.medium,
  total_carbon: colors.primary.main,
  total_cost: colors.primary.main,
};

const lightened_bar_colors: { [key: string]: string } = {};
const darkened_bar_colors: { [key: string]: string } = {};

Object.keys(bar_colors).forEach((key) => {
  let val = bar_colors[key];
  lightened_bar_colors[key] = d3.color(val)?.brighter().toString() as string;
  darkened_bar_colors[key] = d3.color(val)?.darker().toString() as string;
});

export { lightened_bar_colors };
export { darkened_bar_colors };

export const threshold_line_color = "#FF5C00";

export const chart_background_color = "rgb(240,240,240)";
