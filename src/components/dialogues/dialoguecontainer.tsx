import { styled } from '@mui/material/styles'
import React, { useEffect } from 'react'
import { colors } from 'styles/colors'
import { ButtonSecondary } from 'styles/components'
const Content = styled('div')`
  height: calc(100% - 50px);
  padding-left: 25px;
  padding-right: 25px;
  overflow-y: auto;
  box-sizing: border-box;
`

const Header = styled('div')`
  height: 50px;
  margin-left: 15px;
  margin-right: 15px;
  box-sizing: border-box;
  padding: 15px;
  border-bottom: 1px solid ${colors.secondary.light};
`

const MainContainer = styled('div')`
  height: 100%;
  box-sizing: border-box;
`

export const HeadText = styled('div')`
  font-family: CircularStd-Bold;
  font-size: 24px;
  position: relative;
  /* top: -20px; */
`

const HeaderLeft = styled('div')`
  display: inline-block;
  width: 75%;
`

const HeaderRight = styled('div')`
  display: inline-block;
  text-align: right;
  width: 25%;
  position: relative;
  top: -11px;
  /* right: -15px; */
`

type DialogueContainerPropTypes = {
  header?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  footer?: React.ReactNode
  closeCallback: () => void
  title: string
  closeButtonLabel?: string
}

const DialogueContainer = (props: DialogueContainerPropTypes) => {
  const handleClick = (d: React.MouseEvent<HTMLButtonElement>) => {
    props.closeCallback()
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.closeCallback()
      }
    }

    document.addEventListener('keydown', handleEscape, false)

    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  })

  return (
    <MainContainer>
      <Header>
        <HeaderLeft>
          <HeadText>{props.title}</HeadText>
        </HeaderLeft>
        <HeaderRight>
          <div>
            <ButtonSecondary onClick={handleClick} color="secondary" variant="contained">
              {props.closeButtonLabel ? props.closeButtonLabel : 'close'}
            </ButtonSecondary>
          </div>
        </HeaderRight>
      </Header>
      <Content>{props.children}</Content>
    </MainContainer>
  )
}
export default DialogueContainer
