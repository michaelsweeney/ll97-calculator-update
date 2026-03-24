import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { colors } from 'styles/colors'

const IconButtonBase = styled('button')(() => ({
  backgroundColor: 'transparent',
  backgroundRepeat: 'no-repeat',
  border: 'none',
  cursor: 'pointer',
  color: colors.secondary.main,
  overflow: 'hidden',
  fontFamily: 'CircularStd-Bold',
  fontSize: '14px',
  fontWeight: 700,
  transition: 'color 250ms',
}))

type IconPropTypes = {
  width: number
  height: number
  active?: boolean
  clickCallback: (d: React.MouseEvent<HTMLButtonElement>) => void
}

export const CloseIconButton = (props: IconPropTypes) => {
  const { width, height, clickCallback } = props

  const [currentColor, setCurrentColor] = useState('black')

  const handleMouseOver = () => {
    setCurrentColor(colors.grays.medium)
  }

  const handleMouseLeave = () => {
    setCurrentColor('black')
  }

  return (
    <IconButtonBase
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
      onClick={clickCallback}
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={currentColor}
          d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        ></path>
      </svg>
    </IconButtonBase>
  )
}

export const BurgerMenuIconButton = (props: IconPropTypes) => {
  const { width, height, active, clickCallback } = props

  const [currentColor, setCurrentColor] = useState('black')

  const handleMouseOver = () => {
    setCurrentColor(colors.grays.medium)
  }

  const handleMouseLeave = () => {
    setCurrentColor('black')
  }

  return (
    <IconButtonBase
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={clickCallback}
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={active ? colors.secondary.main : currentColor}
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        ></path>
      </svg>
    </IconButtonBase>
  )
}

export const ReturnIconButton = (props: IconPropTypes) => {
  const { width, height, active, clickCallback } = props

  const [currentColor, setCurrentColor] = useState('black')

  const handleMouseOver = () => {
    setCurrentColor(colors.grays.light)
  }

  const handleMouseLeave = () => {
    setCurrentColor('black')
  }

  return (
    <IconButtonBase
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={clickCallback}
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={active ? colors.secondary.main : currentColor}
          d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"
        ></path>
      </svg>
    </IconButtonBase>
  )
}

export const PrintIconButton = (props: IconPropTypes) => {
  const { width, height, active, clickCallback } = props

  const [currentColor, setCurrentColor] = useState('black')

  const handleMouseOver = () => {
    setCurrentColor(colors.grays.light)
  }

  const handleMouseLeave = () => {
    setCurrentColor('black')
  }

  return (
    <IconButtonBase
      color="secondary"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={clickCallback}
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={active ? colors.secondary.main : currentColor}
          d="M 19 8 H 5 c -1.66 0 -3 1.34 -3 3 v 6 h 4 v 4 h 12 v -4 h 4 v -6 c 0 -1.66 -1.34 -3 -3 -3 Z m -3 11 H 8 v -5 h 8 v 5 Z m 3 -7 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 s 1 0.45 1 1 s -0.45 1 -1 1 Z m -1 -9 H 6 v 4 h 12 V 3 Z"
        ></path>
      </svg>
    </IconButtonBase>
  )
}

export const ShareIconButton = (props: IconPropTypes) => {
  const { width, height, active, clickCallback } = props
  const [currentColor, setCurrentColor] = useState('black')

  return (
    <IconButtonBase
      onMouseOver={() => setCurrentColor(colors.grays.light)}
      onMouseLeave={() => setCurrentColor('black')}
      onClick={clickCallback}
      title="Copy shareable link"
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={active ? colors.secondary.main : currentColor}
          d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
        />
      </svg>
    </IconButtonBase>
  )
}

export const InfoIconButton = (props: IconPropTypes) => {
  const { width, height, active, clickCallback } = props

  const [currentColor, setCurrentColor] = useState('black')

  const handleMouseOver = () => {
    setCurrentColor(colors.grays.light)
  }

  const handleMouseLeave = () => {
    setCurrentColor('black')
  }

  return (
    <IconButtonBase
      color="secondary"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={clickCallback}
    >
      <svg width={width} height={height} viewBox="0 0 24 24">
        <path
          style={{ transition: 'fill 200ms' }}
          fill={active ? colors.secondary.main : currentColor}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        ></path>
      </svg>
    </IconButtonBase>
  )
}
