import { useAppDispatch } from 'store/hooks'
import { uiActions } from 'store/uislice'
import { SubHeaderLined } from 'styles/typography'

import DialogueContainer from './dialoguecontainer'

import { NotesAndClarifications } from 'components/notesandclarifications'
import { ButtonSecondary } from 'styles/components'

import { styled } from '@mui/material/styles'

const Footer = styled('div')`
  width: 100%;
  /* text-align: center; */
`
const CloseButton = styled(ButtonSecondary)`
  margin-top: 15px;
  margin-left: 0px;
  border-radius: 0;
`

const CalcInfoDialogue = () => {
  const dispatch = useAppDispatch()

  const handleCloseDialogue = () => {
    dispatch(uiActions.setCurrentView('chart_view'))
  }

  return (
    <DialogueContainer closeCallback={handleCloseDialogue} title="About This Calculator">
      <div>
        <div>
          <p>
            This calculator estimates a building’s carbon penalty as a result of{' '}
            <a
              href="https://be-exchange.org/insight/the-climate-mobilization-act-int-1253/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NYC LL97
            </a>
            . Search for your building to load benchmarking data, or manually input information, to
            generate emissions thresholds and estimated penalties for each compliance period.
          </p>
          <p>
            This calculator is one tool in a{' '}
            <a
              href="https://be-exchange.org/climate-mobilization-act-series/"
              target="_blank"
              rel="noopener noreferrer"
            >
              suite of resources
            </a>{' '}
            developed by Building Energy Exchange to demystify the Climate Mobilization Act and
            connect our community to solutions. The calculator engine was developed by AKF Group
            LLC.
          </p>
          <p>
            This application is optimized for Google Chrome. If experiencing issues with a different
            browser, please try again using Chrome.
          </p>
        </div>
      </div>

      <div>
        <SubHeaderLined> Instructions</SubHeaderLined>
        <div>
          To load building utility data, click “find your building,” or enter manually following the
          steps below.
        </div>
        <ul>
          <li>
            Select occupancy type(s) and input area(s). To add more than one occupancy type use the
            "Add Occupancy Type" button. For area inputs, use square footage as defined in{' '}
            <a
              href="https://www.nyc.gov/html/gbee/downloads/pdf/150428_NYC%20LL84%20Data%20Disclosure%20Definitions.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Local Law 84{' '}
            </a>{' '}
          </li>
          <li>Enter your annual consumption per fuel source for the entire building.</li>
          <li>
            Enter your annual utility rate for each fuel source (total annual utility cost divided
            by total annual consumption) or click "USE DEFAULT RATES" to pre-populate the form with
            NYC average rates for typical commercial buildings.
          </li>
        </ul>
      </div>
      <div>
        <NotesAndClarifications />
      </div>
    </DialogueContainer>
  )
}

export default CalcInfoDialogue
