# Description

This repository contains a simple sample application using React.js and the MongoDB browser driver library to implement a very simple chat application.

## Requirements

This sample application requires the following installed applications

* Node.js 4.4.x or higher
* MongoDB 3.2.0 or higher

## Installation

Make sure you have a MongoDB instance running on localhost and port 27017.

### Start the chat server

In one terminal window perform the following steps.

```
cd server
npm install
npm run dev
```

This will start the chat server running on port 9090.

### Start up the client web development server

In one terminal window perform the following steps.

```
cd client
npm install
npm run dev
```

This will start the dev server on port 8080 and will automatically refresh the
application if any of it's files change.

### Access the application

Open a web browser to [http://localhost:8080](http://localhost:8080)
