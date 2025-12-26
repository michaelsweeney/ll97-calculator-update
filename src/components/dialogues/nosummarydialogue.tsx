import DialogueContainer from './dialoguecontainer'

import { styled } from '@mui/material/styles'
import { useAppDispatch } from 'store/hooks'
import { uiActions } from 'store/uislice'
import { ButtonSecondary } from 'styles/components'

const CloseButton = styled(ButtonSecondary)`
  margin-top: 20px;
  margin-left: 0px;
  border-radius: 0;
`

const End = styled('div')`
  font-family: CircularStd-Medium;
`
const List = styled('div')`
  font-family: CircularStd-Book;
  margin-bottom: 15px;
  margin-top: 15px;
  margin-left: 15px;
`
const Warning = styled('div')`
  color: red;
  margin-top: 10px;
  margin-bottom: 10px;
`

const WarningText = styled('span')`
  color: red;
`

const Intro = styled('div')`
  font-family: CircularStd-Medium;
  margin-bottom: 10px;
  margin-top: 10px;
`

const NoSummaryDialogue = () => {
  const dispatch = useAppDispatch()

  const handleCloseDialogue = () => {
    dispatch(uiActions.setCurrentView('chart_view'))
  }

  return (
    <DialogueContainer closeCallback={handleCloseDialogue} title="LL84 Building Not Loaded">
      <Intro>
        {' '}
        To load building utility data, click “find your building,” or enter manually following the
        steps below.{' '}
      </Intro>
    </DialogueContainer>
  )
}

export default NoSummaryDialogue
