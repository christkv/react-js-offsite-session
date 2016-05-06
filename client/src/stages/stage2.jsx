"use strict"

import ReactDOM from 'react-dom';
import React from 'react';

var Child = React.createClass({
  render: function() {
    return (<li>{this.props.label}</li>)
  }
});

var Container = React.createClass({
  render: function() {
    return (
      <ul>{this.props.children}</ul>
    )
  }
});

// Render the application
ReactDOM.render(
  <Container>
    <Child label="hello 0"/>
    <Child label="hello 1"/>
  </Container>,
  document.getElementById('app')
);
