import React from 'react';
import { Route } from 'react-router-dom';
import ListeningBrowserRouter from './ListeningBrowserRouter.js';

import Startpage from '../../pages/Startpage/Startpage.js';

export default class Routes extends React.Component {
  render() {
    return (
      <ListeningBrowserRouter>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={Startpage} />
      </ListeningBrowserRouter>
    );
  }
}
