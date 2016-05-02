import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/app';
import {Store, Actions, dispatch, wire} from './store';
import './app.css';

// The store
var store = new Store();

// Render the application
ReactDOM.render(
  <App store={store}/>,
  document.getElementById('app')
);
