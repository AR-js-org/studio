import React from 'react';

import Routes from '../Routes/Routes.js';
import { DefaultThemeProvider } from '../../../assets/themes/DefaultThemeProvider.js';
import CssBaseline from '@material-ui/core/CssBaseline';

export default class Root extends React.Component {
  render() {
    return (
      <div className="Root">
        <DefaultThemeProvider>
          <CssBaseline />
          <Routes />
        </DefaultThemeProvider>
      </div>
    );
  }
}
