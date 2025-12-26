import { styled } from '@mui/material/styles'
import { SubHeaderLined } from 'styles/typography'

const Root = styled('div')`
  padding: 20px;
`

const NoFineDialog = () => {
  return (
    <Root>
      <SubHeaderLined>Building Not Regulated (under 25,000 SF)</SubHeaderLined>
      <div> Local Law 97 applies to the following buildings: </div>
      <ul>
        <li>Buildings over 25,000 gross square feet</li>
        <li>
          Two or more buildings on the same tax lot that together are over 50,000 gross square feet
        </li>
        <li>
          Two or more buildings owned by a condo association that are governed by the same board of
          managers and that exceed 50,000 gross square feet.
        </li>
        <li>
          Visit the{' '}
          <a
            href="https://www.nyc.gov/site/buildings/codes/sustainability.page"
            target="_blank"
            rel="noopener noreferrer"
          >
            NYC Department of Buildings website
          </a>{' '}
          for additional guidance on covered buildings.
        </li>
      </ul>
    </Root>
  )
}
export default NoFineDialog
