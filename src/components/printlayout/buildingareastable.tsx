import * as d3 from "d3";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { SubHeaderLined } from "styles/typography";
import { PTable, PTD, PTR, PTDPrimary, PTDSecondary } from "styles/components";

import { useAppSelector } from "store/hooks";
import { formatNumber } from "components/charts/d3helpers";
import React from "react";

type PropTypes = {
  width?: number;
};

const BuildingAreasTable = (props: PropTypes) => {
  const building_inputs = useAppSelector((state) => state.building_inputs);
  let width = props.width ? props.width : 600;

  let { building_types } = building_inputs;

  return (
    <React.Fragment>
      <SubHeaderLined>Building Areas</SubHeaderLined>

      <PTable>
        <TableBody>
          <PTR>
            <PTDPrimary>Building Type</PTDPrimary>
            <PTDPrimary>Area (SF)</PTDPrimary>
          </PTR>
          {building_types.map((t, i) => {
            return (
              <PTR key={i}>
                <PTDSecondary>{t.building_type}</PTDSecondary>
                <PTDSecondary>{formatNumber(t.building_area)}</PTDSecondary>
              </PTR>
            );
          })}
          <PTR>
            <PTDPrimary>Total Area</PTDPrimary>
            <PTDPrimary>
              {formatNumber(d3.sum(building_types.map((t) => t.building_area)))}
            </PTDPrimary>
          </PTR>
        </TableBody>
      </PTable>
    </React.Fragment>
  );
};

export default BuildingAreasTable;
