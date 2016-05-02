"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, FormControl, Button} from 'react-bootstrap';
import {Store, Actions, dispatch} from '../../store';

export default React.createClass({
  getInitialState: function() {
    return { text: '' };
  },

  componentDidMount: function() {
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

  render() {
    return (
      <Grid className='chat-chat'>
        <Row>
          <Col sm={22} md={11}>
            <FormControl type='text' onChange={this.onChange} />
          </Col>
          <Col sm={2} md={1}>
            <Button bsStyle="primary" onClick={this.onClick}>Send</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
});
