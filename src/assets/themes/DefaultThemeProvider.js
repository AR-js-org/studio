import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { fontFamilySansSerif } from '../fonts';
import colors from './colors.js';

const theme = createMuiTheme({
  typography: {
    fontFamily: fontFamilySansSerif,
    h1: {
      // logo
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.primary.main,
      userSelect: 'none',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      display: 'flex',
      alignItems: 'baseline',
      color: colors.secondary.main,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: colors.secondary.main,
    },
  },
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    background: {
      default: colors.background.main,
    },
  },
});

export const DefaultThemeProvider = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
