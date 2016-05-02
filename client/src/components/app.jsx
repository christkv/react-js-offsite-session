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
      // Register the error handler method
      self.props.store.onError(self.onError);
      // Connect to the backend
      yield self.props.store.connect('http://localhost:9090');
      // Wire up global action handlers
      wire(Actions.USER_SUBMITTED, self.onAction, self.props.store);
      wire(Actions.CHAT_RECEIVED, self.onMessage, self.props.store);
    }).catch(function(e) {
      console.log(e.stack);
    });
  },

  componentWillReceiveProps: function(nextProps) {
  },

  onAction(event, message) {
    console.log("============ recevied action :: " + event)
    console.log(message)
    this.setState({ user: message.user });
  },

  onMessage(event, message) {
    console.log("============ received message :: " + event)
    var messages = this.state.messages || [];
    messages.push({from: message.user, message: message.message, date: message.createdOn})
    // Update the state
    this.setState({ messages: messages });
  },

  onError(error) {

  },

  render: function() {
    var component = this.state.user
      ? ( <Chat store={this.props.store} messages={this.state.messages} /> )
      : ( <Logon store={this.props.store} />)

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
