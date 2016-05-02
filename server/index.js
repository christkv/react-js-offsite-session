"use strict";

var express = require('express'),
  co = require('co'),
  MongoClient = require('mongodb').MongoClient,
  BrowserMongoDBServer = require('browser-mongodb').Server,
  SocketIOTransport = require('browser-mongodb').SocketIOTransport;

// Settings
const port = 9090;
const dbURI = 'mongodb://localhost:27017/offsite';

co(function*() {
  // Create simple express application
  var app = express();

  // Connect to MongoDB server
  var db = yield MongoClient.connect(dbURI);

  // Create the browser server
  var browserMongoDBServer = new BrowserMongoDBServer(db, {});

  // Create http server
  var httpServer = require('http').createServer(app);
  // Create a socket.io transport for the browser mongodb server and register
  browserMongoDBServer.registerHandler(new SocketIOTransport(httpServer));
  // Get the channel we will be using (this makes liveQuery connect aswell)
  var channel = yield browserMongoDBServer.channel('mongodb');

  // // Add a before handler to log all traffic (also used to handle auth, validation etc)
  // channel.before(function(conn, channel, data, callback) {
  //   console.log("== received message on channel mongodb");
  //   console.log(JSON.stringify(data, null, 2));
  //   callback();
  // });

  // Connect http server
  httpServer.listen(port, function() {
    console.log('Server listening at port %d', port);
  });
}).catch(function(e) {
  console.log(e.stack)
});
