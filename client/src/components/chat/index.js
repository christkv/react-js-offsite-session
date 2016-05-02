"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, Input, Button} from 'react-bootstrap';
import Messages from './messages';
import Chat from './chat';

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  render() {
    return (
      <Grid className="chat">
        <Row>
          <Col sm={24} md={12}>
            <Messages store={this.props.store} messages={this.props.messages} />
          </Col>
        </Row>
        <Row>
          <Chat store={this.props.store} user={this.props.user} />
        </Row>
      </Grid>
    );
  }
});
