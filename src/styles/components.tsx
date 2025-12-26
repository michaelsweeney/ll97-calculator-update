import { Button, Input, TableCell } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from './colors'
import { SubHeaderLined } from './typography'

export const StyledInput = styled(Input)`
  input[type='number'] {
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const ButtonSecondary = styled(Button)<{}>`
  font-family: CircularStd-Bold;
  border-radius: 0;
  &:hover {
    box-shadow: 0;
  }
`

export const RemoveTypeButton = styled('button')`
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  color: ${colors.secondary.main};
  overflow: hidden;
  font-family: CircularStd-Bold;
  font-size: '14px';
  font-weight: 700;
  transition: color 250ms;
  &:hover {
    background-color: white;
    color: ${colors.secondary.dark};
  }
`

export const AddBuildingTypeButton = styled('button')`
  background-color: ${colors.secondary.main};
  color: white;
  border: none;

  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
  font-family: CircularStd-Bold;
  font-size: '20px';
  font-weight: 700;
  height: 20px;
  width: 20px;
  transition:
    background-color 250ms,
    color 250ms;
  &:hover {
    background-color: ${colors.secondary.dark};
  }
`

export const PTable = styled('table')`
  border-top: 2px solid ${colors.secondary.main};
  border-bottom: 2px solid ${colors.secondary.main};
  width: 100%;
  border-collapse: collapse;
`

export const PTR = styled('tr')``

export const PTD = styled('td')`
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 3px;
  padding-bottom: 3px;
  min-width: 75px;
`
export const PTDSecondary = styled(PTD)`
  border-bottom: 1px solid ${colors.secondary.main};
`

export const PTDPrimary = styled(PTD)`
  text-align: left;
  color: ${colors.primary.main};
  font-family: CircularStd-Bold;
  border-bottom: 2px solid ${colors.primary.main};
`

export const UL = styled('ul')`
  padding-left: 0px;
`

export const LI = styled('li')`
  margin-bottom: 5px;
`

export const PrintUL = styled('ul')`
  padding-left: 0px;
  font-family: CircularStd-Bold;
`

export const PrintLI = styled('li')`
  margin-bottom: 5px;
  font-family: CircularStd-Bold;
`

export const PrintH1 = styled('div')`
  font-size: 36px;
  font-family: CircularStd-Bold;
`

export const PrintH2 = styled(SubHeaderLined)`
  margin-bottom: 24px;
  font-size: 24px;
  font-family: CircularStd-Bold;
`

export const PrintH3 = styled(SubHeaderLined)`
  font-size: 20px;
  font-family: CircularStd-Bold;
`

export const TableCellNoBorder = styled(TableCell)`
  border: none;
`
