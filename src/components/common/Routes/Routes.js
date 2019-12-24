import React from 'react';
import { Route } from 'react-router-dom';
import ListeningBrowserRouter from './ListeningBrowserRouter.js';

import Startpage from '../../pages/Startpage/Startpage.js';

export default class Routes extends React.Component {
  render() {
    console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
    return (
      <ListeningBrowserRouter basename={process.env.PUBLIC_URL}>
        <Route exact path="/" component={Startpage} />
      </ListeningBrowserRouter>
    );
  }
}
