import React from 'react'
import type {
  ColumnNameMapType,
  LL84QueryObjTypes,
  LL84QueryPropertyTypes,
  LL84YearTypes,
  StringObjectType,
} from 'types'
import { building_type_co2_coefficients, ll84_year_lookups } from './lookups'

const sanitizeLL84QueryResultsObject = (
  pobj: StringObjectType,
  colnamemap: ColumnNameMapType,
  ll84_year: LL84YearTypes
) => {
  let pobj_length = Object.keys(pobj).length

  let sanitized_obj: { [key: string]: any } = {}

  Object.keys(pobj).forEach((pobj_key, i) => {
    let pobj_val = pobj[pobj_key]

    //@ts-ignore
    let sanitized_key = colnamemap.find(d => pobj_key === d[1])[0]
    //@ts-ignore
    sanitized_obj[sanitized_key as keyof LL84QueryPropertyTypes] = pobj_val
  })
  let sanitized_obj_length = Object.keys(sanitized_obj).length

  if (pobj_length !== sanitized_obj_length) {
    console.error(pobj)
    console.error(sanitized_obj)
    let err = new Error('Parsing Error. Requested LL84 data not able to be relabeled / sanitized')
    throw err
  }

  sanitized_obj.ll84_year = ll84_year

  // check that each column name is mapped, otherwise enter "Not Available"
  colnamemap.forEach(c => {
    let v = sanitized_obj[c[0] as keyof typeof sanitized_obj]
    if (v === undefined) {
      sanitized_obj[c[0]] = 'Not Available'
      console.warn('parsing error')
      console.warn(sanitized_obj)
      console.warn(c[0])
      console.warn(
        'key not found. this may happen in ll84 / cal year 2017 parsing. Query values not found have been set to "Not Available"'
      )
    }
  })

  sanitized_obj.type_lookup_error_building_types = []
  sanitized_obj.type_lookup_error_building_ids = []

  // catch any types that are 'Other' and flag them

  let is_other_lookup_error = false
  let is_type_lookup_error = false

  // handle known 'other' case
  if (sanitized_obj['1st_property_use_type'] === 'Other') {
    is_other_lookup_error = true
    sanitized_obj['1st_property_use_type'] = 'Office'
  }
  if (sanitized_obj['2nd_property_use_type'] === 'Other') {
    is_other_lookup_error = true
    sanitized_obj['2nd_property_use_type'] = 'Office'
  }
  if (sanitized_obj['3rd_property_use_type'] === 'Other') {
    is_other_lookup_error = true
    sanitized_obj['3rd_property_use_type'] = 'Office'
  }
  sanitized_obj.is_other_lookup_error = is_other_lookup_error

  // handle any other missing cases

  let valid_building_types = building_type_co2_coefficients.map(e => e.building_type)

  if (
    !valid_building_types.includes(sanitized_obj['1st_property_use_type']) &&
    sanitized_obj['1st_property_use_type'] !== 'Not Available'
  ) {
    is_type_lookup_error = true
    sanitized_obj.type_lookup_error_building_types.push(sanitized_obj['1st_property_use_type'])
    sanitized_obj['1st_property_use_type'] = 'Office'
    sanitized_obj.type_lookup_error_building_ids.push(0)
  }
  if (
    !valid_building_types.includes(sanitized_obj['2nd_property_use_type']) &&
    sanitized_obj['2nd_property_use_type'] !== 'Not Available'
  ) {
    is_type_lookup_error = true
    sanitized_obj.type_lookup_error_building_types.push(sanitized_obj['2nd_property_use_type'])
    sanitized_obj.type_lookup_error_building_ids.push(1)

    sanitized_obj['2nd_property_use_type'] = 'Office'
  }
  if (
    !valid_building_types.includes(sanitized_obj['3rd_property_use_type']) &&
    sanitized_obj['3rd_property_use_type'] !== 'Not Available'
  ) {
    is_type_lookup_error = true
    sanitized_obj.type_lookup_error_building_types.push(sanitized_obj['3rd_property_use_type'])
    sanitized_obj.type_lookup_error_building_ids.push(2)

    sanitized_obj['3rd_property_use_type'] = 'Office'
  }
  sanitized_obj.is_type_lookup_error = is_type_lookup_error

  return sanitized_obj as LL84QueryPropertyTypes
}

const handleLL84QueryResponse = async (
  val: string,
  year: LL84YearTypes,
  callback: (e: LL84QueryPropertyTypes[]) => void,
  isLoadingCallback: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (val === '') {
    isLoadingCallback(false)
    return
  }

  isLoadingCallback(true)

  let ll84_year_obj = ll84_year_lookups.find(e => e.key === year) as LL84QueryObjTypes

  let { endpoint, column_name_map, query_columns } = ll84_year_obj

  let all_columns_string = column_name_map.map(d => d[1])

  let column_query_string = query_columns
    .map(
      (c, i) =>
        `UPPER(${c}) LIKE '%25${val.toUpperCase()}%25' ${
          i + 1 === query_columns.length ? '' : 'OR '
        }`
    )
    .join('')

  let report_filter = ''
  if (ll84_year_obj.key == 'll84_2023_cal_2022') {
    report_filter = "AND report_year = '2022'"
  }
  if (ll84_year_obj.key == 'll84_2024_cal_2023') {
    report_filter = "AND report_year = '2023'"
  }
  if (ll84_year_obj.key == 'll84_2025_cal_2024') {
    report_filter = "AND report_year = '2024'"
  }

  let query = `
    ${endpoint}?$query=SELECT ${all_columns_string} WHERE (${column_query_string}) ${report_filter}LIMIT 8
    `

  try {
    const response = await fetch(query)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()

    if (text === '') {
      isLoadingCallback(false)
      callback([])
    } else {
      let parsed: StringObjectType[]
      try {
        parsed = JSON.parse(text)
      } catch {
        parsed = JSON.parse(`"${text}"`)
      }

      let sanitized_array: LL84QueryPropertyTypes[] = []

      parsed.forEach(pobj => {
        let sanitized_object = sanitizeLL84QueryResultsObject(pobj, column_name_map, year)
        sanitized_array.push(sanitized_object)
      })

      callback(sanitized_array)
      isLoadingCallback(false)
    }
  } catch (error) {
    console.error('Error fetching LL84 data:', error)
    isLoadingCallback(false)
    callback([])
  }
}

export { handleLL84QueryResponse }
