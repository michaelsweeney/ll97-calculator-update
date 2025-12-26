import ChartView from 'components/charts/chartview'

import { NotesAndClarifications } from './printnotesandclarifications'

import BuildingAreasTable from './buildingareastable'
import LL97SummaryTable from './ll97summarytable'
import UtilityInputsTable from './utilityinputstable'

import { styled } from '@mui/material/styles'
import DynamicText from './dynamictext'

import { useAppSelector } from 'store/hooks'
import WhatNow from './whatnow'

import { PrintH1, PrintH2, PrintH3 } from 'styles/components'

const Paragraph = styled('div')`
  /* margin: 20px; */
  font-family: CircularStd-Bold;
`
const RootContainer = styled('div')`
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
  font-family: CircularStd-Bold;
`

const Block = styled('div')`
  page-break-inside: avoid;
  margin-bottom: 25px;
`

const ChartContainer = styled('div')`
  vertical-align: left;
  margin-top: 25px;
  width: 850px;
  height: 600px;
`

const chartContainerPadding = {
  t: 25,
  l: 75,
  r: 75,
  b: 50,
}

const PageBreakAfter = styled('div')`
  page-break-before: always;
  visibility: hidden;
  @media print {
    break-after: always;
    visibility: hidden;
  }
`

const PrintContent = () => {
  const building_inputs = useAppSelector(state => state.building_inputs)
  const building_outputs = useAppSelector(state => state.building_outputs)
  const ll84_query = useAppSelector(state => state.ll84_query)

  let no_print = building_outputs.is_input_info_missing || !building_outputs.is_greater_than_25k_sf

  let address = ll84_query.ll84_building_name
  let querylabel = `${ll84_query.ll84_year_label} data`

  return no_print ? (
    <div>
      there is a problem with your building input data (either input data is missing, or the
      building is less than 25,000 SF and not subject to LL97 fines). please revise and retry.
    </div>
  ) : (
    <RootContainer>
      <Block>
        <PrintH1>{address}</PrintH1>
        <PrintH2>{querylabel}</PrintH2>
        <PrintH3>Introduction</PrintH3>
        <Paragraph>
          This report provides a summary for "{address}" and its standing with respect to NYC Local
          Law 97. Building inputs should be checked for accurarcy. The calculator assumes that the
          entered utility inputs remain the same for every year from 2024 to 2050. Visit
          be-exchange.org/calculator for more information, and refer to the Notes and Clarifications
          section in the appendix of this report for additional context.
        </Paragraph>
      </Block>

      <Block>
        <LL97SummaryTable />
        <DynamicText />
      </Block>
      {/* <PageBreakAfter>i</PageBreakAfter> */}
      <Block>
        <PrintH1>{address}</PrintH1>
        <PrintH2>{querylabel}</PrintH2>
        <PrintH3>Carbon Threshold Summary</PrintH3>

        <Paragraph>
          The below summary details building carbon emissions across each LL97 compliance period in
          relation to your building’s emissions threshold. If your building uses electricity, yearly
          emissions will decline between 2029 and 2030, due to a lower carbon coefficient for
          electricity consumption starting in 2030. This coefficient was established to reflect New
          York’s commitment to adding renewable energy sources to the electric grid.
        </Paragraph>
        <ChartContainer>
          <ChartView
            view_type="carbon"
            unit_type="absolute"
            stack_type="summary"
            container_padding={chartContainerPadding}
            show_title={false}
          />
        </ChartContainer>
      </Block>
      {/* <PageBreakAfter>i</PageBreakAfter> */}

      <Block>
        <PrintH1>{address}</PrintH1>
        <PrintH2>{querylabel}</PrintH2>
        <PrintH3>Utility and Penalty Cost Summary</PrintH3>
        <Paragraph>
          The below summary details utility costs and estimated penalties across each LL97
          compliance period. Estimated yearly utility costs are found at the first row of the table.
          Estimated yearly penalties for each compliance period are found on the second row of the
          table.
        </Paragraph>
        <ChartContainer>
          <ChartView
            view_type="cost"
            unit_type="absolute"
            stack_type="summary"
            container_padding={chartContainerPadding}
            show_title={false}
          />
        </ChartContainer>
      </Block>

      <PageBreakAfter>i</PageBreakAfter>

      <Block>
        <PrintH1>{address}</PrintH1>
        <PrintH2>{querylabel}</PrintH2>
        <UtilityInputsTable />
      </Block>

      <Block>
        <BuildingAreasTable />
      </Block>
      <Block>
        <NotesAndClarifications />
      </Block>
      <PageBreakAfter>i</PageBreakAfter>

      <Block>
        {/* <div style={{ marginTop: "110px" }}>  // margintop removed*/}
        <div style={{}}>
          <WhatNow />
        </div>
      </Block>
    </RootContainer>
  )
}

export default PrintContent
