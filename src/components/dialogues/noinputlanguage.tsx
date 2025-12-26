import { SubHeaderLined } from 'styles/typography'

import { styled } from '@mui/material/styles'

const Root = styled('div')`
  padding: 20px;
`

const NoInputDialogue = () => {
  return (
    <Root>
      <SubHeaderLined>Enter or Load Building Information</SubHeaderLined>
      <p>
        Building and/or Utility Inputs have not been completed. Click “find your building,” use the
        “Search LL84 Database” option on the upper-right menu, or enter information manually using
        the panel on the left.
      </p>
    </Root>
  )
}

export default NoInputDialogue
