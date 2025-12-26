import { fuel_keys_to_labels } from "locallaw/lookups";

import * as d3 from "d3";
import { Table, TableBody, TableContainer } from "@mui/material";
import { SubHeaderLined } from "styles/typography";

import { useAppSelector } from "store/hooks";
import { formatNumber, formatCurrency } from "components/charts/d3helpers";
import React from "react";
import { PTable, PTD, PTR, PTDPrimary, PTDSecondary } from "styles/components";

type PropTypes = {
  width?: number;
};

const UtilityInputsTable = (props: PropTypes) => {
  const building_inputs = useAppSelector((state) => state.building_inputs);

  let width = props.width ? props.width : 600;

  let { utilities, electric_onsite_generation } = building_inputs;

  const utility_array = Object.keys(utilities)
    .map((k) => {
      let val = utilities[k as keyof typeof utilities];
      return {
        fuel_type: fuel_keys_to_labels[k as keyof typeof fuel_keys_to_labels],
        fuel_consumption: val.consumption,
        utility_rate: val.rate,
        cost_per_year: val.consumption * val.rate,
      };
    })
    .filter((d) => d.fuel_consumption !== 0);

  if (electric_onsite_generation.photovoltaic.consumption !== 0) {
    utility_array.push({
      fuel_type: "Solar PV (kWh)",
      fuel_consumption: electric_onsite_generation.photovoltaic.consumption,
      utility_rate: utilities.elec.rate,
      cost_per_year:
        electric_onsite_generation.photovoltaic.consumption *
        utilities.elec.rate,
    });
  }

  return (
    <React.Fragment>
      <SubHeaderLined>Utility Inputs</SubHeaderLined>
      <PTable>
        <TableBody>
          <PTR>
            <PTDPrimary> Fuel Type</PTDPrimary>
            <PTDPrimary> Consumption</PTDPrimary>
            <PTDPrimary> Utility Rate</PTDPrimary>
            <PTDPrimary> Annual Cost ($/yr)</PTDPrimary>
          </PTR>

          {utility_array.map((d, i) => {
            return (
              <PTR key={i}>
                <PTDSecondary>{d.fuel_type}</PTDSecondary>
                <PTDSecondary>{formatNumber(d.fuel_consumption)}</PTDSecondary>
                <PTDSecondary>{formatCurrency(d.utility_rate, 2)}</PTDSecondary>
                <PTDSecondary>{formatCurrency(d.cost_per_year)}</PTDSecondary>
              </PTR>
            );
          })}

          <PTR>
            <PTDPrimary colSpan={3}>Total Cost</PTDPrimary>
            <PTDPrimary>
              {`${formatCurrency(
                d3.sum(utility_array.map((d) => d.cost_per_year))
              )}`}
            </PTDPrimary>
          </PTR>
        </TableBody>
      </PTable>
    </React.Fragment>
  );
};

export default UtilityInputsTable;
