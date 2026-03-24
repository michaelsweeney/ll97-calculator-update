import { useEffect } from 'react'
import { useAppDispatch } from 'store/hooks'
import { decodeScenario } from '../shared/urlState'
import { fromScenario } from '../lib/scenarioAdapter'
import { buildingInputActions } from 'store/buildinginputslice'
import { ll84QueryActions } from 'store/ll84queryslice'

const UrlStateLoader = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stateParam = params.get('state')
    if (!stateParam) return

    const scenario = decodeScenario(stateParam)
    if (!scenario) return

    const { inputs, ll84Meta } = fromScenario(scenario)

    dispatch(buildingInputActions.setBuildingInputsFromScenario(inputs))

    if (ll84Meta.is_ll84_loaded) {
      dispatch(ll84QueryActions.setIsLL84Loaded(true))
      if (ll84Meta.ll84_building_name) {
        dispatch(ll84QueryActions.setLL84BuildingName(ll84Meta.ll84_building_name))
      }
      if (ll84Meta.ll84_year_label) {
        dispatch(ll84QueryActions.setLL84YearLabel(ll84Meta.ll84_year_label))
      }
      if (ll84Meta.ll84_year_selection) {
        dispatch(ll84QueryActions.setLL84YearSelection(ll84Meta.ll84_year_selection))
      }
    }

    // Strip ?state from URL so back button works cleanly
    const clean = new URL(window.location.href)
    clean.searchParams.delete('state')
    window.history.replaceState({}, '', clean.toString())
  }, [dispatch])

  return null
}

export default UrlStateLoader
