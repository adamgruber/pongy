import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Websocket from 'react-websocket';
import './App.css';
import Game from './Game';

const App = observer(class App extends Component {
  constructor(props) {
    super(props);
    this.onSocketMessage = this.onSocketMessage.bind(this);
  }

  /*
   * General callback function for handling Websocket messages
   *
   * @param {string} msg Websocket Message
   *
   */
  onSocketMessage(msg) {
    console.log(`Received socket message: ${msg}`);
    try {
      this.handleSocketMessage(JSON.parse(msg))
    } catch (e) {
      // Ignore any messages that 
      // are not stringified JSON
    }
  }

  /*
   * Websocket message handler. Expects message to contain `action`
   * and `args` properties. The action corresponds to a store action
   * to be called with the attached `args`. The handler does a check
   * to prevent calling internal store methods.
   *
   * @param {string} message.action Name of store action to call
   * @param {array} message.args Arguments to pass to store action 
   *
   */ 
  handleSocketMessage({ action, args }) {
    const { store } = this.props;
    const storeAction = store[action];
    if (storeAction && storeAction.isMobxAction) {
      storeAction(...args);
    }
  }

  render() {
    const { store } = this.props;
    return (
      <main className="app">
        <Websocket
          url="ws://localhost:4000"
          onMessage={this.onSocketMessage}
          reconnect={ false } />
        <div className="app-header">
          <h2>PONGY!</h2>
        </div>
        <div className='app-body'>
          <Game game={ store.currentGame } />
        </div>
      </main>
    );
  }
});

App.propTypes = {
  store: PropTypes.object,
};

export default App;
