import { styled } from '@mui/material/styles'
import { FooterTextAKF } from 'styles/typography'

// const C15Brand = styled('span')`
//   font-family: Nunito, 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
//   font-size: 24px;
//   font-weight: 700;
//   color: rgb(221, 7, 114);
//   transition: all 0.35s ease;
// `

// const SuperchargedText = styled('div')`
//   font-family: CircularStd-Book;
//   font-size: 13px;
//   color: rgb(180, 180, 180);
// `

const Right = styled('div')`
  display: inline-block;
  width: calc(100% - 600px);
  text-align: right;
  vertical-align: top;
  padding-left: 15px;
  box-sizing: border-box;
  padding-right: 20px;
  padding-top: 12px;
`

const Left = styled('div')`
  display: inline-block;
  width: 600px;
  text-align: left;
  vertical-align: top;
  padding-right: 10px;
  box-sizing: border-box;
  padding-left: 20px;
  padding-top: 12px;
`

const Root = styled('div')`
  box-sizing: border-box;
`

const Footer = () => {
  const akfurl = 'http://www.akfgroup.com'

  return (
    <Root>
      <Left>
        {/* supercharged by Cadence OneFive° — uncomment to re-enable */}
        {/* <SuperchargedText>
          supercharged by <C15Brand>Cadence OneFive°</C15Brand>
        </SuperchargedText> */}
      </Left>
      <Right>
        <FooterTextAKF>
          Calculator engine by{' '}
          <a href={akfurl} target="_blank" rel="noopener noreferrer">
            AKF Group LLC
          </a>
        </FooterTextAKF>
      </Right>
    </Root>
  )
}

export default Footer
