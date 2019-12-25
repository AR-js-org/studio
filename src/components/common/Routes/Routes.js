import React from 'react';
import { Route } from 'react-router-dom';
import ListeningBrowserRouter from './ListeningBrowserRouter.js';

import Startpage from '../../pages/Startpage/Startpage.js';

export default class Routes extends React.Component {
  render() {
    console.log(JSON.stringify(process.env));
    console.log('Hey3');
    return (
      <ListeningBrowserRouter basename={process.env.PUBLIC_URL}>
        <Route exact path="/" component={Startpage} />
      </ListeningBrowserRouter>
    );
  }
}
