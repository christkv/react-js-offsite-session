"use strict"

import React from 'react';
import {Row, Col, Grid} from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  render() {
    // Generate all the messages
    var users = this.props.users || [];
    users = users.map(function(user, index) {
      return (
        <Row key={index}>
          {user.username}
        </Row>
      );
    });

    // Render the component
    return (
      <div className="pre-scrollable chat-users">
        <Grid>
          {users}
        </Grid>
      </div>
    );
  }
});
