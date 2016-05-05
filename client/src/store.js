"use strict"

import co from 'co';
import {MongoClient, SocketIOTransport, ObjectId} from 'browser-mongodb/client';
import ioClient from 'socket.io-client';

const DISCONNECTED = 0;
const CONNECTING = 1;
const CONNECTED = 2;

const Actions = {
  CHAT_SUBMITTED: 'CHAT_SUBMITTED',
  CHAT_RECEIVED: 'CHAT_RECEIVED',
  ERROR: 'ERROR',
  USER_SUBMITTED: 'USER_SUBMITTED'
};

var handleReject = function(reject, store) {
  return function(err) {
    // Emit the error to the global error handler
    if(store) store.dispatch(Actions.ERROR, {err: err});
    // Reject it
    reject(err);
  }
}

class Store {
  constructor() {
    this.db = null;
    this.events = {};
    // Collections
    this.messages = null;
  }

  wire(event, handler) {
    if(!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }

  dispatch(event, message) {
    // Do we have global listeners for these events
    // Then dispatch to their handlers
    if(this.events[event]) {
      for(let handler of this.events[event]) {
        handler(event, message);
      }
    }
  }

  connect(url) {
    var self = this;
    url = url || 'http://localhost:9090';
    this.state = CONNECTING;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Client connection
        var client = new MongoClient(new SocketIOTransport(ioClient.connect, {}));
        // Attempt to connect
        self.client = yield client.connect(url);
        // Set connected state
        self.state = CONNECTED;
        // Get the database
        self.db = self.client.db('chat');
        // Get the collections
        self.messages = self.db.collection('messages');

        // Start the live query for new messages
        self.messageChangeCursor = self.messages.find({
          createdOn: {
            $gt: new Date()
          }
        }).liveQuery();

        // Set up the live query handler
        self.messageChangeCursor.on('added', (id, fields) => {
          self.dispatch(Actions.CHAT_RECEIVED, fields);
        });

        // Start the live query
        var results = yield self.messageChangeCursor.toArray();

        // Resolve
        resolve(self);
      }).catch(function(err) {
        self.state = DISCONNECTED;
        self.dispatch(Actions.ERROR, {err: err});
        reject(err);
      });
    });
  }

  chat(user, message) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        var result = yield self.messages.insertOne({
          createdOn: new Date(), user: user, message:message
        });

        resolve();
      }).catch(handleReject(reject, self.store));
    });
  }

  isConnected() {
    return this.client && this.client.isConnected();
  }
}

function wire(event, handler, store) {
  store.wire(event, handler);
}

function dispatch(component, store, event, message) {
  co(function*() {
    if(!component || !store) return
    // Handle events
    if(event == Actions.CHAT_SUBMITTED) {
      // Send the chat
      yield store.chat(message.user, message.text);
      // Update state
      if(component.update) component.update(event, {});
    }

    // Submit event to any listeners
    store.dispatch(event, message);
  }).catch(function(err) {
    if(store) store.dispatch(Actions.ERROR, {err: err});
  });
}

exports.Store = Store;
exports.dispatch = dispatch;
exports.Actions = Actions;
exports.wire = wire;
