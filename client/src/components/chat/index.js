"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, Input, Button} from 'react-bootstrap';
import Users from './users';
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
          <Col sm={20} md={10}>
            <Messages store={this.props.store} messages={this.props.messages} />
          </Col>
          <Col sm={4} md={2}>
            <Users store={this.props.store} />
          </Col>
        </Row>
        <Row>
          <Chat store={this.props.store} />
        </Row>
      </Grid>
    );
  }
});
