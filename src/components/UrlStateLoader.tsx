import { useEffect, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { decodeScenario } from '../shared/urlState'
import { fromScenario } from '../lib/scenarioAdapter'
import { buildingInputActions } from 'store/buildinginputslice'
import { ll84QueryActions } from 'store/ll84queryslice'
import { handleLL84QueryResponse } from 'locallaw/ll84_query'
import { LL84SelectionToLL97Inputs } from 'locallaw/ll84_query_to_ll97_inputs'
import type { LL84QueryPropertyTypes, LL84YearTypes } from 'types'

const UrlStateLoader = () => {
  const dispatch = useAppDispatch()
  const [, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const bbl = params.get('bbl')
    const year = params.get('year') as LL84YearTypes | null

    if (bbl && year) {
      // BBL + year mode: re-fetch from LL84 API
      handleLL84QueryResponse(
        bbl,
        year,
        (results: LL84QueryPropertyTypes[]) => {
          const match = results.find(r => r.nyc_bbl === bbl) ?? results[0]
          if (!match) return

          dispatch(ll84QueryActions.setSelectedLL84Property(match))
          dispatch(ll84QueryActions.setHasLL84SummaryBeenClosed(false))
          const ll97_inputs = LL84SelectionToLL97Inputs(match)
          dispatch(buildingInputActions.setBuildingInputsFromLL84Results(ll97_inputs))
        },
        setIsLoading
      )

      const clean = new URL(window.location.href)
      clean.searchParams.delete('bbl')
      clean.searchParams.delete('year')
      window.history.replaceState({}, '', clean.toString())
      return
    }

    // Blob mode: decode full scenario from ?state=
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

    const clean = new URL(window.location.href)
    clean.searchParams.delete('state')
    window.history.replaceState({}, '', clean.toString())
  }, [dispatch])

  return null
}

export default UrlStateLoader
