import * as React from "react";
import { colors } from "styles/colors";

import { styled } from "@mui/material/styles";

const border_color = colors.secondary.main;

type ToggleButtonProps = {
  is_active: boolean;
  label: string;
  view_key: string;
  callback: (d: string) => void;
  size?: "small" | "regular";
  className?: string;
};

const ToggleButton = (props: ToggleButtonProps) => {
  const { callback, view_key, className, label } = props;
  const handleClick: (d: React.MouseEvent<HTMLElement>) => void = (d) => {
    callback(view_key);
  };
  return (
    <div onClick={handleClick} className={className}>
      {label}
    </div>
  );
};

const StyledToggleButton = styled(ToggleButton)`
  font-size: ${(props) => (props.size === "small" ? "12px" : "16px")};
  background-color: ${(props) =>
    props.is_active ? colors.secondary.main : "white"};
  color: ${(props) => (props.is_active ? "white" : colors.secondary.dark)};
  display: inline-block;
  min-width: 60px;
  border: ${(props) =>
    props.is_active
      ? `1px solid ${border_color}`
      : `1px solid ${colors.secondary.light}`};
  border-radius: 0px;
  margin-right: ${(props) => (props.size === "small" ? "10px" : "10px")};
  padding: ${(props) => (props.size === "small" ? "7.5px" : "10px")};
  text-align: center;
  cursor: pointer;
  transition: background-color 200ms, color 200ms, border-color 200ms;
  &:hover {
    border-color: ${(props) =>
      props.is_active ? colors.secondary.dark : "black"};
    background-color: ${(props) =>
      props.is_active ? colors.grays.dark : colors.grays.extralight};
    color: ${(props) => (props.is_active ? "white" : "black")};
  }
`;

StyledToggleButton.defaultProps = {
  size: "regular",
};

export default StyledToggleButton;
