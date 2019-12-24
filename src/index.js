import React from 'react';
import ReactDOM from 'react-dom';
import './assets/i18n/i18n.js';
import Root from './components/common/Root/Root.js';

console.log(JSON.stringify(process.env));
ReactDOM.render(<Root />, document.getElementById('main'));
