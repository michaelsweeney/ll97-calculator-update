import { styled } from '@mui/material/styles'
import { colors } from 'styles/colors'
import { PrintH1, PrintLI, PrintUL } from 'styles/components'

type Props = { link: string; label: string }

const StyledLink = styled('a')`
  text-decoration: none;
  color: ${colors.primary.main};
`

const StyledLI = styled(PrintLI)`
  color: ${colors.primary.main};
`

const StyleWrapper = styled('div')`
  font-family: CircularStd-Bold;
`

const LinkText = (props: Props) => {
  return (
    <PrintUL>
      <StyledLI>
        <StyledLink href={props.link}>{props.label}</StyledLink>
      </StyledLI>
    </PrintUL>
  )
}

const WhatNow = () => {
  return (
    <StyleWrapper>
      <PrintH1>Next Steps</PrintH1>
      <p>
        Building Energy Exchange’s Climate Mobilization Act Series portal hosts a collection of
        event media, FAQs, articles, and tools that demystify the legislative package and connect
        building stakeholders to solutions:
      </p>
      <LinkText
        link="be-exchange.org/climate-mobilization-act-series"
        label="be-exchange.org/climate-mobilization-act-series"
      />
      <p>
        NYC Accelerator offers free resources, training, and one-on-one expert guidance to help
        building owners comply with Local Law 97:
      </p>
      <LinkText link="https://accelerator.nyc" label="accelerator.nyc" />
      <p>
        NYC Accelerator’s Property Assessed Clean Energy (PACE) financing program, offered in
        partnership with the New York City Energy Efficiency Corporation, provides funding to
        building owners for energy efficiency and renewable energy upgrades:
      </p>
      <LinkText
        link="https://accelerator.nyc/resources/finance/PACE"
        label="accelerator.nyc/resources/finance/PACE"
      />
      <p>
        NYSERDA offers financial and technical support to help New Yorkers increase energy
        efficiency, save money, use renewable energy, and reduce reliance on fossil fuels:
      </p>
      <LinkText link="https://www.nyserda.ny.gov" label="nyserda.ny.gov" />
      <p>
        The Sustainable Buildings NYC Emissions Limits page provides information on Local Law 97,
        including building emissions limits, property types, and reporting requirements.
      </p>
      <LinkText
        link="https://www.nyc.gov/site/sustainablebuildings/requirements/emissions-limits.page"
        label="nyc.gov/site/sustainablebuildings/requirements/emissions-limits.page"
      />
      <p>
        The Sustainable Buildings NYC Covered Buildings page details LL97 coverage criteria, plus a
        list of buildings that may be subject to LL97.
      </p>
      <LinkText
        link="https://www.nyc.gov/site/sustainablebuildings/requirements/covered-buildings.page"
        label="nyc.gov/site/sustainablebuildings/requirements/covered-buildings.page"
      />

      <p>
        The NYC Sustainability Help Center offers free assistance for inquiries relating to various
        NYC sustainability laws. Contact the help center for questions relating to compliance
        guidelines, help with reporting requirements, and assistance to improve the accuracy of your
        next benchmarking report.
      </p>
      <LinkText
        link="cunybpltraining.org/sustainability-help-center/"
        label="cunybpltraining.org/sustainability-help-center/"
      />
    </StyleWrapper>
  )
}

export default WhatNow
