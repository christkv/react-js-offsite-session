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

  // Refresh the items at even intervals
  setInterval(function() {
    co(function*() {
      var entries = yield characters.find({}).toArray();
      entries = entries.map(function(entry) {
        return entry.name;
      });

      // Render the application
      ReactDOM.render(
        <List items={entries} />,
        document.getElementById('app')
      );
    });
  }, 1000);
});
