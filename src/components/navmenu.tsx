import * as React from 'react'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { LL84SelectionToLL97Inputs } from 'locallaw/ll84_query_to_ll97_inputs'
import { sample_ll84_data } from 'locallaw/lookups'
import { buildingInputActions } from 'store/buildinginputslice'
import { useAppDispatch } from 'store/hooks'
import { ll84QueryActions } from 'store/ll84queryslice'
import { uiActions } from 'store/uislice'
import type { InlineStylesType } from 'types'
import { BurgerMenuIconButton } from './iconbuttons'

const styles: InlineStylesType = {
  nav: {
    border: '1px solid black',
    '& .MuiPaper-root': {
      paddingLeft: '10px',
      paddingRight: '10px',
      border: 'gray 1px solid',
    },
  },
}

const NavMenu = () => {
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenLoadModal = () => {
    dispatch(uiActions.setCurrentView('load_building_dialogue'))
    handleClose()
  }

  const handleOpenInfoModal = () => {
    dispatch(uiActions.setCurrentView('calc_info_dialogue'))
    handleClose()
  }

  const handleOpenBuildingSummaryModal = () => {
    dispatch(uiActions.setCurrentView('building_summary_dialogue'))
    handleClose()
  }

  const handleLoadDemoBuildling = () => {
    dispatch(ll84QueryActions.setSelectedLL84Property(sample_ll84_data))
    let ll97_conversion = LL84SelectionToLL97Inputs(sample_ll84_data)

    if (ll97_conversion.bldg_type_one_type !== undefined) {
      dispatch(buildingInputActions.setBuildingInputsFromLL84Results(ll97_conversion))
    }
    dispatch(uiActions.setCurrentView('chart_view'))
  }

  return (
    <div style={{ width: '10px' }}>
      <BurgerMenuIconButton active={open} clickCallback={handleClick} width={35} height={35} />

      <Menu sx={styles.nav} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleOpenLoadModal}>Find Your Building</MenuItem>
        <MenuItem onClick={handleOpenBuildingSummaryModal}>About Loaded Building</MenuItem>
        <MenuItem onClick={handleOpenInfoModal}>About This Calculator</MenuItem>
        <MenuItem onClick={handleLoadDemoBuildling}>Load Sample Building</MenuItem>
      </Menu>
    </div>
  )
}

export default NavMenu
