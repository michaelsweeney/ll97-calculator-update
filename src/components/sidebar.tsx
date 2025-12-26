import InputBuilding from './inputbuilding'
import InputOnsiteGeneration from './inputonsitegeneration'
import InputUtilities from './inpututilities'
// import CoefficientSelector from "./coefficientselector";
import { styled } from '@mui/material/styles'
import { SubHeaderLined } from 'styles/typography'

const SidebarSubHeader = styled(SubHeaderLined)`
  margin-left: 15px;
`

const Sidebar = () => {
  return (
    <div>
      <SidebarSubHeader>Building Inputs</SidebarSubHeader>
      <InputBuilding />
      <SidebarSubHeader>Utility Inputs</SidebarSubHeader>
      <InputUtilities />
      <SidebarSubHeader>Carbon Deductions</SidebarSubHeader>
      <InputOnsiteGeneration />
    </div>
  )
}

export default Sidebar
