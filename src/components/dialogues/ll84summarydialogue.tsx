import DialogueContainer from './dialoguecontainer'

import { styled } from '@mui/material/styles'
import { formatNumber } from 'components/charts/d3helpers'
import { ll84_year_lookups } from 'locallaw/lookups'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ll84QueryActions } from 'store/ll84queryslice'
import { uiActions } from 'store/uislice'
import { ButtonSecondary } from 'styles/components'

const CloseButton = styled(ButtonSecondary)`
  margin-top: 20px;
  margin-left: 0px;
  border-radius: 0;
`

const End = styled('div')`
  font-family: CircularStd-Medium;
`
const List = styled('div')`
  font-family: CircularStd-Book;
  margin-bottom: 15px;
  margin-top: 15px;
  margin-left: 15px;
`
const Warning = styled('div')`
  color: red;
  margin-top: 10px;
  margin-bottom: 10px;
`

const WarningText = styled('span')`
  color: red;
`

const Intro = styled('div')`
  font-family: CircularStd-Medium;
  margin-bottom: 10px;
  margin-top: 10px;
`

const BuildingSummaryDialogue = () => {
  const dispatch = useAppDispatch()

  const handleCloseDialogue = () => {
    dispatch(uiActions.setCurrentView('chart_view'))
    dispatch(ll84QueryActions.setHasLL84SummaryBeenClosed(true))
  }

  const { ll84_selected_property, has_ll84_summary_been_closed, is_ll84_loaded } = useAppSelector(
    state => state.ll84_query
  )

  const formatIfAvailable = (e: string) => {
    if (e === 'Not Available') {
      return 'Not Available'
    } else {
      return formatNumber(+e)
    }
  }

  let ll84_year_map: { [key: string]: string } = {}
  ll84_year_lookups.forEach(d => {
    ll84_year_map[d.key] = d.label
  })

  let type_lookup_error_text = ''

  if ('type_lookup_error_building_types' in ll84_selected_property) {
  }

  const close_button_label = has_ll84_summary_been_closed || !is_ll84_loaded ? 'close' : 'next'

  return (
    <DialogueContainer
      closeCallback={handleCloseDialogue}
      title="Loaded LL84 Building Summary"
      closeButtonLabel={close_button_label}
    >
      {!is_ll84_loaded ? (
        <div>
          <Intro>
            LL84 Building has not been selected. click “find your building,” or enter building and
            utility information manually
          </Intro>
        </div>
      ) : (
        <div>
          {ll84_selected_property.is_other_lookup_error ? (
            <Warning>
              Warning: This building's LL87 query includes a property type of "Other," which is not
              included as a category in the most current LL97 rules. The "Other" type has been set
              to "Office." Please review and redefine the category or select one of the
              more-specific "Other" categories (i.e., "Other - Education", etc.).
            </Warning>
          ) : (
            ''
          )}

          {ll84_selected_property.is_type_lookup_error &&
          !ll84_selected_property.is_other_lookup_error ? (
            <Warning>
              Warning: your building's LL84 entry contains one or more building types not defined in
              LL97. Building type square footage has been populated from the LL84 entry, and all
              unrecognized building types have been set to "Office." Undefined building types are
              highlighted in red below. Please review and, if necessary, redefine using the building
              input dropdown menu.
            </Warning>
          ) : (
            ''
          )}
          <Intro>
            The following info has been loaded from the NYC LL84 Database. Note that inputs should
            be verified by the building owner / stakeholder for accuracy.
          </Intro>

          <List>
            <div>LL84 Year Queried: {ll84_year_map[ll84_selected_property.ll84_year]}</div>
            <div>Property Name: {ll84_selected_property.property_name}</div>
            <div>Property ID: {ll84_selected_property.property_id}</div>
            <div>NYC BBL: {ll84_selected_property.nyc_bbl}</div>
            <div>NYC BIN: {ll84_selected_property.nyc_bin}</div>
            <div>Address: {ll84_selected_property.address_1}</div>
            <div>
              {ll84_selected_property.type_lookup_error_building_ids.includes(0) ? (
                <WarningText>
                  1st property use type: {ll84_selected_property['1st_property_use_type']}
                </WarningText>
              ) : (
                <span>
                  1st property use type: {ll84_selected_property['1st_property_use_type']}
                </span>
              )}
            </div>
            <div>
              1st property use SF:{' '}
              {formatIfAvailable(ll84_selected_property['1st_property_use_sf'])}
            </div>
            <div>
              {ll84_selected_property.type_lookup_error_building_ids.includes(1) ? (
                <WarningText>
                  2nd property use type: {ll84_selected_property['2nd_property_use_type']}
                </WarningText>
              ) : (
                <span>
                  2nd property use type: {ll84_selected_property['2nd_property_use_type']}
                </span>
              )}
            </div>
            <div>
              2nd property use SF:{' '}
              {formatIfAvailable(ll84_selected_property['2nd_property_use_sf'])}
            </div>
            <div>
              {ll84_selected_property.type_lookup_error_building_ids.includes(2) ? (
                <WarningText>
                  3rd property use type: {ll84_selected_property['3rd_property_use_type']}
                </WarningText>
              ) : (
                <span>
                  3rd property use type: {ll84_selected_property['3rd_property_use_type']}
                </span>
              )}
            </div>
            <div>
              3rd property use SF:{' '}
              {formatIfAvailable(ll84_selected_property['3rd_property_use_sf'])}
            </div>
            <div>
              Fuel Oil 2 Consumption (kBtu):{' '}
              {formatIfAvailable(ll84_selected_property.fuel_oil_2_consumption_kbtu)}
            </div>
            <div>
              Fuel Oil 4 Consumption (kBtu){' '}
              {formatIfAvailable(ll84_selected_property.fuel_oil_4_consumption_kbtu)}
            </div>
            <div>
              District Steam Consumption (kBtu):{' '}
              {formatIfAvailable(ll84_selected_property.district_steam_consumption_kbtu)}
            </div>
            <div>
              Natural Gas Consumption (kBtu):{' '}
              {formatIfAvailable(ll84_selected_property.natural_gas_consumption_kbtu)}
            </div>
            <div>
              Electricity Consumption (kBtu):{' '}
              {formatIfAvailable(ll84_selected_property.electricity_consumption_kbtu)}
            </div>
            <div>
              Electricity Generated Onsite (kBtu):{' '}
              {formatIfAvailable(ll84_selected_property.electricity_onsite_generated_kbtu)}
            </div>
          </List>

          <End>
            Please verify the above lookups and make any changes necessary to areas and utility
            consumption in the "Building Inputs" section of the calculator.
          </End>
        </div>
      )}
    </DialogueContainer>
  )
}

export default BuildingSummaryDialogue
