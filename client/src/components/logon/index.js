"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, Input, Button, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {Store, Actions, dispatch, wire} from '../../store';

const keyCodes = {
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40
};

export default React.createClass({
  getInitialState: function() {
    return { value: '' };
  },

  onChange: function(e) {
    this.setState({ value: e.target.value });
  },

  onClick: function(e) {
    dispatch(this, this.props.store, Actions.USER_SUBMITTED, { user: this.state.value })
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

  getValidationState() {
    const length = this.state.value.length;
    if(length > 5) {
      return 'success';
    } else if(length > 1) {
      return 'warning';
    } else if(length > 0) {
      return 'error';
    }
  },

  getValidationMessage() {
    const length = this.state.value.length;
    if(length >= 0 && length < 5) {
      return 'handle must have at least 5 characters';
    }
  },

  render() {
    return (
      <Grid>
        <Col sm={6} md={3}>
        </Col>
        <Col sm={12} md={6}>
          <FormGroup
            validationState={this.getValidationState()}
            controlId="formControlsText">
            <ControlLabel>Handle</ControlLabel>
            <FormControl
              ref="input"
              type="text"
              value={this.state.value}
              placeholder="Enter handle"
              onChange={this.onChange}
              onKeyUp={this.onKeyUp} />
            <HelpBlock>{this.getValidationMessage()}</HelpBlock>
          </FormGroup>
          <FormGroup controlId="formControlsText">
            <Button
              ref="submit"
              bsStyle="primary"
              onClick={this.onClick}>Chat</Button>
          </FormGroup>
        </Col>
        <Col sm={6} md={3}>
        </Col>
      </Grid>
    );
  }
});
