"use strict"

import ReactDOM from 'react-dom';
import React from 'react';

var Item = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <li>hello world</li>
    );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var items = [];

    return (
      <ul>{items}</ul>
    );
  }
});

var entries = ["Han Solo", "Luke Skywalker", "R2D2"];

// Render the application
ReactDOM.render(
  <List items={entries} />,
  document.getElementById('app')
);
