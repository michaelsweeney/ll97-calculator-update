import * as React from 'react'

import Dialog from '@mui/material/Dialog'

import { ButtonSecondary } from 'styles/components'
import { MenuTitle } from 'styles/typography'
import { CloseIconButton } from '../iconbuttons'

import { styled } from '@mui/material/styles'
type PropTypes = {
  isOpen: boolean
  exitCallback: (b: boolean) => void
  children: React.ReactNode
  modalTitle: string
  closable: boolean
}

const CloseContainer = styled('div')`
  text-align: center;
`
const ChildrenContainer = styled('div')`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`

const XCornerButton = styled('div')`
  position: absolute;
  right: 25px;
  top: 35px;
`
const HeaderLeft = styled('div')`
  display: inline-block;
  width: calc(100%);
`
const Header = styled('div')`
  width: 100%;
`

const Root = styled('div')`
  padding: 20px;
`

const ModalWrapper = (props: PropTypes) => {
  const { isOpen, exitCallback, children, modalTitle, closable = true } = props

  const hideModal = () => {
    exitCallback(false)
  }

  return (
    <Dialog open={isOpen} fullWidth={true} onClose={hideModal} maxWidth="xl">
      <Root>
        <Header>
          <HeaderLeft>
            <MenuTitle>{modalTitle}</MenuTitle>
          </HeaderLeft>

          {!closable ? (
            <></>
          ) : (
            <XCornerButton>
              <CloseIconButton clickCallback={hideModal} width={30} height={30} />
            </XCornerButton>
          )}
        </Header>
        <ChildrenContainer>{children}</ChildrenContainer>
        <CloseContainer>
          {!closable ? (
            <></>
          ) : (
            <ButtonSecondary
              sx={{ borderRadius: 0 }}
              color="secondary"
              onClick={hideModal}
              variant="contained"
            >
              Close
            </ButtonSecondary>
          )}
        </CloseContainer>
      </Root>
    </Dialog>
  )
}

export default ModalWrapper
