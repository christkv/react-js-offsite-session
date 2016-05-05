"use strict"

import ReactDOM from 'react-dom';
import React from 'react';
import co from 'co';
import {MongoClient, SocketIOTransport, ObjectId} from 'browser-mongodb/client';
import ioClient from 'socket.io-client';

var Item = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <li>{this.props.value}</li>
    );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var items = (this.props.items || []).map(function(item, index) {
      return (
        <Item key={index} value={item} />
      )
    });

    return (
      <ul>{items}</ul>
    );
  }
});

var Form = React.createClass({
  getInitialState: function() {
    return {};
  },

  onClick: function() {
    if(this.props.onSubmit) {
      this.props.onSubmit(this.refs.input.value);
      this.refs.input.value = '';
    }
  },

  render: function() {
    return (
      <div>
        <input ref='input' type='text'/>
        <button onClick={this.onClick}>Submit</button>
      </div>
    );
  }
});

co(function*() {
  var url = 'http://localhost:9090';
  // Client connection
  var client = new MongoClient(new SocketIOTransport(ioClient.connect, {}));
  // Attempt to connect
  yield client.connect(url);
  // Get the database
  var db = client.db('starwars');
  // Get the collections
  var characters = db.collection('characters');

  // Submit handler
  var onSubmit = function(entry) {
    console.log('-- onSubmit');
    console.log(entry);
  };

  // Refresh the items at even intervals
  setInterval(function() {
    co(function*() {
      var entries = yield characters.find({}).toArray();
      entries = entries.map(function(entry) {
        return entry.name;
      });

      // Render the application
      ReactDOM.render(
        <div>
          <Form onSubmit={onSubmit}/>
          <List items={entries} />
        </div>,
        document.getElementById('app')
      );
    });
  }, 1000);
});
