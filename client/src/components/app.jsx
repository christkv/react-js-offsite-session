import React from 'react';
import {Store, Actions, dispatch, wire} from '../store';
import co from 'co';
import {Grid, Row, Col, Jumbotron, Input, Button} from 'react-bootstrap';
import Chat from './chat';
import Logon from './logon';

export default React.createClass({
  getInitialState: function() {
    return { user: null, messages: []};
  },

  // Component became visible
  componentDidMount: function() {
    var self = this;

    co(function*() {
      // Connect to the backend
      yield self.props.store.connect('http://localhost:9090');
      // Wire up Error handler
      wire(Actions.ERROR, self.onError, self.props.store);
      // Wire up global action handlers
      wire(Actions.USER_SUBMITTED, self.onAction, self.props.store);
      wire(Actions.CHAT_RECEIVED, self.onMessage, self.props.store);
    }).catch(function(e) {
      console.log(e.stack);
    });
  },

  onAction(event, message) {
    this.setState({ user: message.user });
  },

  onError(event, message) {
    console.log("Application Error occured");
    console.log(message);
  },

  onMessage(event, message) {
    this.state.messages.push({
      from: message.user,
      message: message.message,
      date: message.createdOn});
    // Update the state
    this.setState({ messages: this.state.messages });
  },

  render: function() {
    var component = this.state.user
      ? ( <Chat
            store={this.props.store}
            messages={this.state.messages}
            user={this.state.user} /> )
      : ( <Logon
            store={this.props.store} />);

    return (
      <Grid className="show-grid" fluid={true}>
        <Row>
          <Jumbotron>
            <h1>Chat Application</h1>
          </Jumbotron>
        </Row>
        <Row>
          {component}
        </Row>
      </Grid>
    )
  }
});
