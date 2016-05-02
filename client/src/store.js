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
    // console.log("------------------------ error in MongoDB Backend provider")
    // console.log(err.stack)
    // Emit the error to the global error handler
    if(store) store.error(err);
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

  onError(onErrorHandler) {
    this.onErrorHandler = onErrorHandler;
  }

  error(err) {
    if(this.onErrorHandler) {
      return this.onErrorHandler(err);
    }
    console.log(err);
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
          // console.log(`received change event notification for id ${id}`);
          // console.log(fields);
          self.dispatch(Actions.CHAT_RECEIVED, fields);
        });

        // Start the live query
        var results = yield self.messageChangeCursor.toArray();

        // Resolve
        resolve(self);
      }).catch(function(e) {
        self.state = DISCONNECTED;
        reject(e);
      });
    });
  }

  chat(user, message) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // console.log("++++++++++++++++++ chat 0")
        var result = yield self.messages.insertOne({
          createdOn: new Date(), user: user, message:message
        });
        // console.log("++++++++++++++++++ chat 1")
        // console.log(result)

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
  // console.log("======================= dispatch -1")
  co(function*() {
    // console.log("======================= dispatch 0")
    if(!component || !store) return
    // console.log("======================= dispatch 1")
    // Handle events
    if(event == Actions.CHAT_SUBMITTED) {
      // console.log("======================= dispatch 1:1")
      // console.log(store)
      // Send the chat
      yield store.chat(message.user, message.text);
      // Update state
      if(component.update) component.update(event, {});
    }

    // console.log("======================= dispatch 2")
    // Submit event to any listeners
    store.dispatch(event, message);
  }).catch(function(e) {
    store.error(e);
  });
}

exports.Store = Store;
exports.dispatch = dispatch;
exports.Actions = Actions;
exports.wire = wire;
