# Introduction

## What are we covering
- React.js
- Overview of Glue logic
- MongoDB in the browser

# React.js

## What is React.js
- React.js is not a framework.
- It's the View in Model View Controller.
- There are two types of React.js people talk about
  - React.js for the Web
  - React.js Native for mobile and desktop.

## The case for React.js
- React.js abstracts away the DOM from you.
- Uses a virtual DOM that tracks changes to optimize the manipulation of the browser DOM.
- The virtual DOM means one can render React.js components on the server as well as on the client.
- The virtual DOM also means unit testing of React.js components is easy and flexible.
- All data binding is from parent to child (no two way binding).

## The Philosophy
Rather than describing what changes are required to bring the view up to date, you describe what the view should look like. Under the hood, React uses smart algorithms to 'diff' that description with the current state of the DOM, then tells the browser what it needs to do.

## A simple React.js component

```js
import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <div>
        <h1>Hello world</h1>
      </div>
    )
  }
});
```

- React.js is a hybrid language of Javascript + the JSX template language (although you can work around JSX, but it can be painful).
- JSX is not HTML (but it looks similar).


## React.js Properties

It's better explained by looking at two components.

```js
import React from 'react';
import Child from './child';

var Parent = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <Child label="my child"/>
    )
  }
});
```

The first component is the parent component that will render an instance of the child component. Notice the `label` attribute. This is passed to the child in the `this.props` collection.

```js
import React from 'react';

var Child = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <label>{this.props.label}</label>
    )
  }
});
```

In the child component we can see that the label tag will be rendered with the `label` property passed into the child component by the parent.

In other words properties are values passed down (one-way data binding) from parent to child.

## React.js State

Let's look at a toggle button component.

```js
import React from 'react';

var ToggleButton = React.createClass({
  getInitialState: function() {
    return { label: 'on' };
  },

  onClick: function() {
    var label = this.state.label == 'on'
      ? 'off' : 'on';

    this.setState({ label: label });
  },

  render: function() {
    return (
      <button onClick={this.onClick}>
        {this.state.label}
      </button>
    )
  }
});
```

The state tracks the state of the component itself. It is not used to contain data bound to the component just the internally needed state of the component. In the component above that is the current label shown.

Notice that we can bind events to our `JSX` just like in HTML. For this component we are binding to the `onClick` button event. When the button is clicked we flip the label between the two states `on` and `off` and call `this.setState` to notify React.js that the component needs to be re-rendered.

## Data down, actions up

As we see we pass data in as props. But what about dealing with something like a filter input field. Let's look at a child component.

```js
import React from 'react';

var Child = React.createClass({
  getInitialState: function() {
    return {};
  },

  onClick: function() {
    var onFilterChange = this.props.onFilterChange;
    if(onFilterChange) {
      onFilterChange(this.refs.filterTextField.value);
    }
  },

  render: function() {
    return (
      <div>
        <input type='text' ref='filterTextField'/>
        <button
          onClick={this.onClick}>Submit</button>
      </div>
    )
  }
});
```

Now let's take a Parent component that uses this child component.

```js
import React from 'react';
import Child from './child';

var Parent = React.createClass({
  getInitialState: function() {
    return {};
  },

  onFilterChange(text) {
    console.log(`new filter: ${text}`);
  },

  render: function() {
    return (
      <Child onFilterChange={this.onFilterChange}/>
    )
  }
});
```

# Overview of Glue logic

Since React.js only covers the View aspect and not how the View actually interacts with the Model or Controller aspect there are many possible ways to organize your code.

We will only give a brief introduction to the three most popular ones for you to research for later. For this application we have rolled our own very crude framework to allow for simple usage of the MongoDB browser library.

## Flux

Flux is an application architecture pattern and not a library. It is a way to structure your application.

![Flux Overview](flux-simple-f8-diagram-1300w.png "Basic Flux Flow")

The flow is unidirectional flowing from action to view. The store represents the application state and the actions might modify that state.

![Flux View Action](flux-simple-f8-diagram-explained-1300w.png "Basic Flux Flow")

A change in the view might trigger a new action that flows back to the dispatcher.

## Redux

Redux is an implementation of the Flux architecture with some important differences. Instead of multiple stores like in Flux it contains a single store for the entire application. Furthermore the store is immutable meaning it mutates the state and keeps the history of the mutations.

This allows you to do some neat things like playback the application state and there are some very cool development tools to support that.

However one of the shortcomings I've run into, is it's fundamental design being around synchronous actions meaning its a bit of kludge to work with asynchronous actions.

## Relay

Relay is a fundamentally different approach to the Flux Architecture.

Never again communicate with your data store using an imperative API. Simply declare your data requirements using GraphQL and let Relay figure out how and when to fetch your data.

Queries live next to the views that rely on them, so you can easily reason about your app. Relay aggregates queries into efficient network requests to fetch only what you need.

Relay lets you mutate data on the client and server using GraphQL mutations, and offers automatic data consistency, optimistic updates, and error handling.

```js
class Tea extends React.Component {
  render() {
    var {name, steepingTime} = this.props.tea;
    return (
      <li key={name}>
        {name} (<em>{steepingTime} min</em>)
      </li>
    );
  }
}
Tea = Relay.createContainer(Tea, {
  fragments: {
    tea: () => Relay.QL`
      fragment on Tea {
        name,
        steepingTime,
      }
    `,
  },
});
```

# MongoDB in the browser

## Introduction

MongoDB in the browser is a prototype module allowing for MongoDB interactions from the browser. It has the following features.

- Server component with Socket.IO and REST style transports.
- Find, Insert, Update, Delete, Aggregate from the browser using an API very close to the existing driver.
- LiveQueries using the oplog (register a query and receive change notifications).
- Extend with custom commands.
- Interdict operations before they are executed to enforce authentication or other middleware requirements.

## Simple insert example

Given that MongoClient, SocketIOTransport and ioClient exists in the browser.

```js
co(function*() {
  // Create Socket.IO transport instance
  var socketIOTransport = new SocketIOTransport(ioClient.connect, {});
  // Create a mongoClient instance (you can have multiple)
  var mongoClient = new MongoClient(socketIOTransport);
  // Connect to the backend
  var client = yield mongoClient.connect("http://localhost:9090");
  // Grab a database
  var db = client.db('application');
  // Grab a collection
  var collection = db.collection('documents');
  // Insert a single document into application.documents
  var result = yield collections.insertOne({ a: 1 });
});
```

## The Backend code

Given a mongodb driver db instance and a httpServer instance

```js
// Create the browser server
var browserMongoDBServer = new BrowserMongoDBServer(db, {});
// Create a socket.io transport for the browser mongodb server and register
browserMongoDBServer.registerTransport(new SocketIOTransport(httpServer));
// Create a named channel
var channel = yield browserMongoDBServer.createChannel('mongodb');
// Add a before handler to interdict all communication before
// it hits the mongodb instance
channel.before(function(conn, channel, data, callback) {
  console.log("== received message on channel mongodb");
  console.log(JSON.stringify(data, null, 2));
  callback();
});
```

The backend supports talking over one or more transports. The prototype supports Socket.IO and an Express REST backend. If you want to use the LiveQuery functionality you have to use Socket.IO as there is no push support using the REST transport.

A channel is a named pipe over the transport. You can have multiple channels if you need each handled differently. Say a public channel for open API calls and a private channel for authenticated API calls.

You can specify the channel when performing a MongoClient connect in the client.

```js
var client = yield mongoClient.connect("http://localhost:9090", "private");
```
