"use strict"

import React from 'react';
import {Grid, Row, Col, Jumbotron, Input, Button, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import {Store, Actions, dispatch, wire} from '../../store';

export default React.createClass({
  getInitialState: function() {
    return { value: '' };
  },

  componentDidMount: function() {
  },

  onChange: function(e) {
    this.setState({ value: e.target.value });
  },

  onClick: function(e) {
    dispatch(this, this.props.store, Actions.USER_SUBMITTED, { user: this.state.value })
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
          <form>
            <FormGroup
              validationState={this.getValidationState()}
              controlId="formControlsText">
              <ControlLabel>Handle</ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Enter handle"
                onChange={this.onChange} />
              <HelpBlock>{this.getValidationMessage()}</HelpBlock>
            </FormGroup>
            <FormGroup controlId="formControlsText">
              <Button bsStyle="primary" onClick={this.onClick}>Chat</Button>
            </FormGroup>
          </form>
        </Col>
        <Col sm={6} md={3}>
        </Col>
      </Grid>
    );
  }
});
