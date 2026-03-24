import { useEffect, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { decodeScenario } from '../shared/urlState'
import { fromScenario } from '../lib/scenarioAdapter'
import { buildingInputActions } from 'store/buildinginputslice'
import { ll84QueryActions } from 'store/ll84queryslice'
import { uiActions } from 'store/uislice'
import { handleLL84QueryResponse } from 'locallaw/ll84_query'
import { LL84SelectionToLL97Inputs } from 'locallaw/ll84_query_to_ll97_inputs'
import type { LL84QueryPropertyTypes, LL84YearTypes } from 'types'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const UrlStateLoader = () => {
  const dispatch = useAppDispatch()
  const [, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const bbl = params.get('bbl')
    const bin = params.get('bin')
    const year = params.get('year') as LL84YearTypes | null

    if (bbl && year) {
      // Reconstruct dashed BBL format (B-BBBBB-LLLL) from 10-digit no-dash param
      const dashedBbl = bbl.length === 10
        ? `${bbl.slice(0, 1)}-${bbl.slice(1, 6)}-${bbl.slice(6, 10)}`
        : bbl

      // Search with BIN when available (unique per building, no format ambiguity).
      // Fall back to dashed BBL otherwise.
      const searchValue = bin ?? dashedBbl

      const onResults = (results: LL84QueryPropertyTypes[]) => {
        const match =
          results.find(r => r.nyc_bbl === dashedBbl) ??
          (bin ? results.find(r => r.nyc_bin === bin) : undefined) ??
          results[0]

        if (!match) {
          setError(`No LL84 record found for BBL ${dashedBbl}${bin ? ` / BIN ${bin}` : ''}.`)
          return
        }

        dispatch(ll84QueryActions.setSelectedLL84Property(match))
        dispatch(ll84QueryActions.setHasLL84SummaryBeenClosed(false))
        const ll97_inputs = LL84SelectionToLL97Inputs(match)
        dispatch(buildingInputActions.setBuildingInputsFromLL84Results(ll97_inputs))
        dispatch(uiActions.setCurrentView('building_summary_dialogue'))
        setSuccess(`Loaded: ${match.property_name}`)
      }

      handleLL84QueryResponse(searchValue, year, onResults, setIsLoading)

      const clean = new URL(window.location.href)
      clean.searchParams.delete('bbl')
      clean.searchParams.delete('bin')
      clean.searchParams.delete('year')
      window.history.replaceState({}, '', clean.toString())
      return
    }

    // Blob mode: decode full scenario from ?state=
    const stateParam = params.get('state')
    if (!stateParam) return

    const scenario = decodeScenario(stateParam)
    if (!scenario) {
      setError('Could not decode the shared link. It may be invalid or outdated.')
      return
    }

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

  return (
    <>
      <Snackbar
        open={success !== null}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 0 }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 0 }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UrlStateLoader
