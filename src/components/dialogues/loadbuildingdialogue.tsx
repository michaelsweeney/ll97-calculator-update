import { styled } from '@mui/material/styles'

import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'

import { CircularProgress, MenuItem, TextField } from '@mui/material'
import { handleLL84QueryResponse } from 'locallaw/ll84_query'
import { ll84_year_lookups } from 'locallaw/lookups'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ll84QueryActions } from 'store/ll84queryslice'
import { uiActions } from 'store/uislice'
import type { LL84QueryPropertyTypes, LL84YearTypes } from 'types'
import DialogueContainer from './dialoguecontainer'
import LoadModalResults from './ll84resultstable'

const SearchContainer = styled('div')`
  /* background-color: white; */
  height: 100%;
  /* padding: 20px; */
  margin-top: 20px;
  box-sizing: border-box;
`

const ControlWrapper = styled('div')`
  margin-bottom: 15px;
  height: 80px;
`
const SelectWrapper = styled(Select)`
  vertical-align: top;
  background-color: white;
  border-radius: 0px;
`

const InputWrapper = styled(TextField)`
  background-color: white;
  margin-left: 10px;

  & fieldset {
    border-radius: 0px;
  }
`

const LoadingProgressWrapper = styled('div')`
  display: inline-block;
  position: relative;
  top: 7.5px;
  left: 15px;
`

const LoadBuildingDialogue = () => {
  const { ll84_query_input, ll84_year_selection } = useAppSelector(state => state.ll84_query)
  const [queryLoading, setQueryLoading] = useState(false)

  const dispatch = useAppDispatch()

  const handleCloseDialogue = () => {
    dispatch(uiActions.setCurrentView('chart_view'))
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    let querytext = e.target.value
    dispatch(ll84QueryActions.setLL84QueryInput(querytext))
  }

  const handleYearSelection = (e: SelectChangeEvent<unknown>) => {
    let year = e.target.value as LL84YearTypes
    dispatch(ll84QueryActions.setLL84YearSelection(year))
  }

  const inputref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputref) {
      if (inputref.current) {
      }
    }
  }, [])

  useEffect(() => {
    const ll84QueryResponseCallback = (e: LL84QueryPropertyTypes[]) => {
      dispatch(ll84QueryActions.setLL84QueryResultsResponse(e))
    }

    handleLL84QueryResponse(
      ll84_query_input,
      ll84_year_selection,
      ll84QueryResponseCallback,
      setQueryLoading
    )
  }, [ll84_query_input, ll84_year_selection, dispatch])

  return (
    <DialogueContainer closeCallback={handleCloseDialogue} title="Load LL84 Building Info">
      <div>
        <p>
          This form queries NYC’s “Energy and Water Data Disclosure” database to load building
          characteristics and utility information.
        </p>
        <p>
          To find your building, select reporting year, then input BBL ID number, property name, or
          address.
        </p>

        <SearchContainer>
          <ControlWrapper>
            <SelectWrapper
              color="secondary"
              onChange={handleYearSelection}
              value={ll84_year_selection}
            >
              {ll84_year_lookups.map((e, i) => {
                return (
                  <MenuItem color="secondary" key={i} value={e.key}>
                    {e.label}
                  </MenuItem>
                )
              })}
            </SelectWrapper>
            <InputWrapper
              color="secondary"
              autoFocus
              inputRef={inputref}
              onChange={handleSearchChange}
              value={ll84_query_input}
            />
            <LoadingProgressWrapper>
              {queryLoading ? <CircularProgress color="secondary" /> : ''}
            </LoadingProgressWrapper>
          </ControlWrapper>

          <div>
            <LoadModalResults />
          </div>
        </SearchContainer>
      </div>
    </DialogueContainer>
  )
}

export default LoadBuildingDialogue
