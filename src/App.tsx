import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";

import UrlStateLoader from "components/UrlStateLoader";

import MainLayout from "components/mainlayout";
import TestComponent from "components/testcomponent";
import InputListener from "components/inputlistener";
import PrintLayout from "components/printlayout/printlayout";

import { colors } from "styles/colors";
import TooSmallModal from "components/modals/toosmallmodal";
import WindowListener from "components/windowlistener";

const theme = createTheme({
  shadows: Array(25).fill("none") as any,
  components: {
    MuiButtonBase: {
      styleOverrides: {},
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiSelect: {
      defaultProps: {},
    },
  },
  palette: {
    secondary: {
      main: colors.secondary.main as string,
    },
    primary: {
      main: colors.primary.main as string,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UrlStateLoader />
      <InputListener />
      <WindowListener />
      <TestComponent />
      <TooSmallModal />
      <div className="layout-container">
        <MainLayout />
      </div>

      <div className="print-container">
        <PrintLayout />
      </div>
    </ThemeProvider>
  );
};

export default App;
