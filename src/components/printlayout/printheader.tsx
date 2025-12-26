import styled from '@emotion/styled'
import { useAppSelector } from 'store/hooks'

import CalcLogo from 'components/calclogo'
import { colors } from 'styles/colors'

const Root = styled.div`
  border-bottom: 2px solid ${colors.secondary.main};
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
`

const H1 = styled.div`
  font-family: CircularStd-Bold;
  color: ${colors.primary.main};
  padding-top: 10px;
  font-size: 46px;
  width: 400px;
  line-height: 46px;
`

const H2 = styled.div`
  font-family: CircularStd-Bold;
  color: ${colors.secondary.main};
  font-size: 16px;
`

// middle position
const LL97Container = styled.div`
  position: absolute;
  right: 100px;
  bottom: 15px;
`
// right position
const BeExLogoContainer = styled.span`
  position: absolute;
  right: 20px;
  bottom: 15px;
`

const PrintHeader = () => {
  const { ll84_building_name, ll84_year_label } = useAppSelector(state => state.ll84_query)

  return (
    <Root>
      <H1>NYC Carbon Emissions Report</H1>
      <LL97Container>
        <CalcLogo width={175} />
      </LL97Container>
      <BeExLogoContainer>
        <img alt="beex-logo" width="60" src="Logo_Beex-Full (rgb).png" />
      </BeExLogoContainer>
    </Root>
  )
}

export default PrintHeader
