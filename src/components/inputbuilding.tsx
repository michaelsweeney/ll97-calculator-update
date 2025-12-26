import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { building_type_co2_coefficients } from 'locallaw/lookups'
import { AddBuildingTypeButton, RemoveTypeButton, TableCellNoBorder } from 'styles/components'
import type { InlineStylesType } from 'types'
import FocusNumberInput from './focusnumberinput'
import SingleSelect from './singleselect'

import { buildingInputActions } from 'store/buildinginputslice'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ll84QueryActions } from 'store/ll84queryslice'
import { uiActions } from 'store/uislice'

const defaultPadding = '5px'
const styles: InlineStylesType = {
  root: { marginBottom: '30px' },
  table_container: { overflowX: 'hidden', marginBottom: '10px' },
  table: {
    tableLayout: 'fixed',
    width: '300px',
    marginTop: '5px',
    marginBottom: '5px',
  },

  bldg_id_col: {
    width: '10px',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
    textAlign: 'center',
  },

  input_select_col: {
    width: '70px',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
  },
  input_area_col: {
    width: '50px',
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
  },
  rm_btn_col: {
    width: '10px',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  add_button: {
    marginRight: '5px',
    width: '10px',
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 0,
  },
  add_button_container: {
    marginLeft: '40px',
    marginTop: '0px',
    marginBottom: '15px',
  },
  add_button_text: {
    position: 'relative',
    fontSize: '14px',
    fontFamily: 'CircularStd-Medium',
    marginLeft: 8,
    top: 1,
  },
}

const InputBuilding = () => {
  const { building_types } = useAppSelector(state => state.building_inputs)
  const { has_ll84_summary_been_closed } = useAppSelector(state => state.ll84_query)

  const dispatch = useAppDispatch()

  const handleBuildingAreaChange = (id: number, value: number) => {
    dispatch(buildingInputActions.setBuildingArea({ id, value }))
    if (has_ll84_summary_been_closed) {
      dispatch(ll84QueryActions.setIsLL84Overriden(true))
      dispatch(uiActions.setCurrentView('chart_view'))
    }
  }

  const handleBuildingTypeChange = (id: number, value: string) => {
    dispatch(buildingInputActions.setBuildingType({ id, value }))
    if (has_ll84_summary_been_closed) {
      dispatch(ll84QueryActions.setIsLL84Overriden(true))
      dispatch(uiActions.setCurrentView('chart_view'))
    }
  }

  const handleRemoveBuildingType = (id: number) => {
    dispatch(buildingInputActions.removeBuildingType({ id }))
    if (has_ll84_summary_been_closed) {
      dispatch(ll84QueryActions.setIsLL84Overriden(true))
      dispatch(uiActions.setCurrentView('chart_view'))
    }
  }

  const handleAddBuildingType = () => {
    dispatch(buildingInputActions.addBuildingType({}))
    if (has_ll84_summary_been_closed) {
      dispatch(ll84QueryActions.setIsLL84Overriden(true))
      dispatch(uiActions.setCurrentView('chart_view'))
    }
  }

  return (
    <div style={styles.root}>
      <TableContainer sx={styles.table_container}>
        <Table sx={styles.table} size="small">
          <TableBody>
            <TableRow>
              <TableCellNoBorder sx={styles.bldg_id_col}></TableCellNoBorder>
              <TableCell sx={styles.input_select_col} variant="head">
                Building Input
              </TableCell>
              <TableCell sx={styles.input_area_col} variant="head">
                Area (SF)
              </TableCell>
              <TableCellNoBorder sx={styles.rm_btn_col}></TableCellNoBorder>
            </TableRow>

            {building_types.map((bldg_type, i) => {
              return (
                <TableRow key={i}>
                  <TableCellNoBorder sx={styles.bldg_id_col}>{i + 1}</TableCellNoBorder>
                  <TableCellNoBorder sx={styles.input_select_col}>
                    <SingleSelect
                      value={bldg_type.building_type}
                      callback={v => {
                        handleBuildingTypeChange(bldg_type.building_id, v as string)
                      }}
                      option_values={building_type_co2_coefficients.map(e => e.building_type)}
                      option_titles={building_type_co2_coefficients.map(e => e.building_type)}
                    />
                  </TableCellNoBorder>
                  <TableCellNoBorder sx={styles.input_area_col}>
                    <FocusNumberInput
                      value={bldg_type.building_area}
                      callback={v => {
                        handleBuildingAreaChange(bldg_type.building_id, v as number)
                      }}
                    />
                  </TableCellNoBorder>
                  <TableCellNoBorder sx={styles.rm_btn_col}>
                    {building_types.length === 1 ? (
                      <span></span>
                    ) : (
                      <RemoveTypeButton
                        onClick={() => handleRemoveBuildingType(bldg_type.building_id)}
                      >
                        X
                      </RemoveTypeButton>
                    )}
                  </TableCellNoBorder>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={styles.add_button_container}>
        <AddBuildingTypeButton onClick={() => handleAddBuildingType()}>+</AddBuildingTypeButton>
        <span style={styles.add_button_text}>Add Building Type</span>
      </div>
    </div>
  )
}

export default InputBuilding
