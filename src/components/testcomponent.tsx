import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";

import { buildingInputActions } from "store/buildinginputslice";
import { LL84SelectionToLL97Inputs } from "locallaw/ll84_query_to_ll97_inputs";
import { ll84QueryActions } from "store/ll84queryslice";
import { sample_ll84_data } from "locallaw/lookups";
import { uiActions } from "store/uislice";
const TestComponent = () => {
  // testing component, can do anything in here
  // without rerendering unnecessary children.

  const dispatch = useAppDispatch();

  const { is_dev_mode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (is_dev_mode) {
      dispatch(uiActions.setCurrentView("chart_view"));

      dispatch(ll84QueryActions.setSelectedLL84Property(sample_ll84_data));
      let ll97_conversion = LL84SelectionToLL97Inputs(sample_ll84_data);

      if (ll97_conversion.bldg_type_one_type !== undefined) {
        dispatch(
          buildingInputActions.setBuildingInputsFromLL84Results(ll97_conversion)
        );
      }
    }

    // dispatch loaded inputs to building inputs.
  }, [dispatch, is_dev_mode]);

  return <div style={{ display: "none" }}></div>;
};

export default TestComponent;
