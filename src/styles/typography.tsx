import { styled } from "@mui/material/styles";
import { colors } from "./colors";

export const SubHeaderLined = styled("div")`
  font-family: CircularStd-Black;
  font-size: 16px;
  margin-top: 10px;
  /* margin-left: 10px; */
  margin-bottom: 10px;
`;

export const ChartHeaderLined = styled("div")`
  display: inline-block;
  font-family: CircularStd-Black;
  font-size: 16px;
  margin-bottom: 10px;
  margin-right: 10px;
`;

export const MenuTitle = styled("div")`
  font-size: 20px;
  font-family: CircularStd-Bold;
  color: ${colors.secondary.dark};
  border-top: 4px solid ${colors.secondary.main};
  border-bottom: 4px solid ${colors.secondary.main};
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
`;

export const FooterTextAccelerator = styled("div")`
  font-family: CircularStd-Black;
  color: ${colors.primary.main};
  font-size: "16px";
  font-weight: "700";
  & a {
    color: black;
    text-decoration: none;
  }
`;

export const FooterTextAKF = styled(FooterTextAccelerator)`
  color: ${colors.grays.dark};
  & a {
    color: ${colors.akf.red};
  }
  & span {
    color: ${colors.akf.red};
  }
`;
