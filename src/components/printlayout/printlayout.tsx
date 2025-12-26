import PrintContent from './printcontent'
import PrintFooter from './printfooter'
import PrintHeader from './printheader'

import { styled } from '@mui/material/styles'

const Header = styled('div')`
  height: 125px;
  width: 100%;
  position: fixed;
  top: 0;
`

const HeaderSpace = styled('div')`
  height: 125px;
`

const Footer = styled('div')`
  height: 50px;
  position: fixed;
  bottom: 0;
  width: 100%;
`

const FooterSpace = styled('div')`
  height: 50px;
`

const Content = styled('div')`
  width: 100%;
  height: 100%;
`

const PrintLayout = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>
              <HeaderSpace />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Content>
                <PrintContent />
              </Content>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>
              <FooterSpace />
            </td>
          </tr>
        </tfoot>
      </table>
      <Header>
        <PrintHeader />
      </Header>
      <Footer>
        <PrintFooter />
      </Footer>
    </div>
  )
}

export default PrintLayout
