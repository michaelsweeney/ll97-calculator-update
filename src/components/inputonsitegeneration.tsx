import { styled } from '@mui/material/styles'
import { buildingInputActions } from 'store/buildinginputslice'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import FocusNumberInput from './focusnumberinput'

const InputContainer = styled('div')`
  margin-left: 15px;
  width: 125px;
  display: inline-block;
`

const Text = styled('div')`
  width: 100px;
  vertical-align: middle;
  position: relative;
  top: 5px;
  margin-left: 25px;
  font-family: CircularStd-Book;
  font-size: 14px;
  font-weight: 400;
  display: inline-block;
`

const InputOnsiteGeneration = () => {
  const dispatch = useAppDispatch()
  const building_inputs = useAppSelector(state => state.building_inputs)

  const handleElectricOnsitePVConsumptionChange = (v: number) => {
    dispatch(buildingInputActions.setElectricOnsitePVConsumptionChange(v))
  }
  return (
    <div>
      <Text>Solar PV (kWh)</Text>
      <InputContainer>
        <FocusNumberInput
          value={building_inputs.electric_onsite_generation.photovoltaic.consumption}
          callback={v => {
            handleElectricOnsitePVConsumptionChange(v as number)
          }}
        ></FocusNumberInput>
      </InputContainer>
    </div>
  )
}

export default InputOnsiteGeneration
