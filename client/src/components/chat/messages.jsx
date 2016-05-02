"use strict"

import React from 'react';
import {Row, Col, Grid} from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  render() {
    // Generate all the messages
    var messages = this.props.messages || [];
    messages = messages.map(function(message, index) {
      return (
        <Grid key={index} className="message-container">
          <Row className="message-from">
            {message.from}
          </Row>
          <Row>
            <Col sm={20} md={10} className="message-message">
              {message.message}
            </Col>
            <Col sm={4} md={2} className="message-date">
              {message.date.getHours()}:{message.date.getMinutes()}
            </Col>
          </Row>
        </Grid>
      );
    });

    // Render the component
    return (
      <div className="pre-scrollable chat-messages">
        {messages}
      </div>
    );
  }
});
