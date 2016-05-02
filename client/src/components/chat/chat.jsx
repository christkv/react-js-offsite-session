"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, FormControl, Button} from 'react-bootstrap';
import {Store, Actions, dispatch} from '../../store';

const keyCodes = {
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40
};

export default React.createClass({
  getInitialState: function() {
    return { text: '' };
  },

  onClick(e) {
    dispatch(this, this.props.store, Actions.CHAT_SUBMITTED, { text: this.state.text, user: this.props.user });
  },

  update(event, message) {
    if(event == Actions.CHAT_SUBMITTED) {
      this.setState({text: ''});
    }
  },

  onChange(e) {
    this.setState({text: e.target.value});
  },

  onKeyUp(e) {
    const key = e.which || e.keyCode;
    switch(key) {
      case keyCodes.ENTER:
        e.preventDefault();
        this.onClick();
        break;
    }
  },

  render() {
    return (
      <Grid className='chat-chat'>
        <Row>
          <Col sm={22} md={11}>
            <FormControl
              type='text'
              onChange={this.onChange}
              onKeyUp={this.onKeyUp}
              value={this.state.text}
              placeholder="Enter you chat message and hit enter or click the Send button" />
          </Col>
          <Col sm={2} md={1}>
            <Button bsStyle="primary" onClick={this.onClick}>Send</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
});
