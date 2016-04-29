import React from 'react';
import Store from '../store';
import co from 'co';

// The store
var store = new Store();

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  // Component became visible
  componentDidMount: function() {
    co(function*() {
      yield store.connect('http://localhost:9090');
    }).catch(function(e) {
      console.log(e.stack);
    });
  },

  render: function() {
    return (
      <div> HELLO WORLD </div>
    )
  }
});
