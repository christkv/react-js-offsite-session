import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument, scryRenderedDOMComponentsWithClass, Simulate} from 'react-addons-test-utils';
import {Actions} from '../src/store';
import Logon from '../src/components/logon';
import assert from 'assert';

describe('Logon Component', () => {

  it('enter user handle and click button', (done) => {
    var store = {
      dispatch: function(event, message) {
        assert.equal(Actions.USER_SUBMITTED, event);
        assert.deepEqual({ user: 'test' }, message);
        done();
      }
    }

    const component = renderIntoDocument(
      <Logon store={store}/>
    );

    // Simulate a changing input field
    Simulate.change(ReactDOM.findDOMNode(component.refs.input), {target: {value: 'test'}});
    // Simulate a button click
    Simulate.click(ReactDOM.findDOMNode(component.refs.submit), {});
  });

  it('enter user handle and press enter', (done) => {
    var store = {
      dispatch: function(event, message) {
        assert.equal(Actions.USER_SUBMITTED, event);
        assert.deepEqual({ user: 'test' }, message);
        done();
      }
    }

    const component = renderIntoDocument(
      <Logon store={store}/>
    );

    // Simulate a changing input field
    Simulate.change(ReactDOM.findDOMNode(component.refs.input), {target: {value: 'test'}});
    // Simulate Enter button being pressed
    Simulate.keyUp(ReactDOM.findDOMNode(component.refs.input), {key: "Enter", keyCode: 13, which: 13});
  });

  // it('invokes the next callback when next button is clicked', () => {
  //   // let nextInvoked = false;
  //   // const next = () => nextInvoked = true;
  //   //
  //   // const pair = List.of('Trainspotting', '28 Days Later');
  //   // const component = renderIntoDocument(
  //   //   <Results pair={pair}
  //   //            tally={Map()}
  //   //            next={next}/>
  //   // );
  //   //
  //   // Simulate.click(ReactDOM.findDOMNode(component.refs.next));
  //   //
  //   // expect(nextInvoked).to.equal(true);
  // });
  //
  // it('renders the winner when there is one', () => {
  //   // const component = renderIntoDocument(
  //   //   <Results winner="Trainspotting"
  //   //            pair={["Trainspotting", "28 Days Later"]}
  //   //            tally={Map()} />
  //   // );
  //   // const winner = ReactDOM.findDOMNode(component.refs.winner);
  //   // expect(winner).to.be.ok;
  //   // expect(winner.textContent).to.contain('Trainspotting');
  // });
});
