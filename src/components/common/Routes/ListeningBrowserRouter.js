import React from 'react';
import { Router } from 'react-router-dom';
import history from './history.js';

export default class ListeningBrowserRouter extends React.Component {
  constructor(props) {
    super(props);
    history.listen(location => this.onRouteChanged(location));
  }

  componentDidMount() {
    this.onRouteChanged();
  }

  onRouteChanged() {
    // this is called when the user changes to a different route
  }

  render() {
    return <Router history={history}>{this.props.children}</Router>;
  }
}
