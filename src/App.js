import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Websocket from 'react-websocket';
import { ThemeProvider } from 'styled-components';
import { FlexContainer } from 'common-styled-components';
import Game from './Game';
import {
  AppInfo,
  HeaderTitle,
  Main,
  WSConnectionIndicator, 
} from './styled';
import theme from './theme';

const App = observer(class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wsConnected: false
    };
    this.onSocketOpen = this.onSocketOpen.bind(this);
    this.onSocketClose = this.onSocketClose.bind(this);
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

  onSocketOpen() {
    this.setState({ wsConnected: true });
  }

  onSocketClose() {
    this.setState({ wsConnected: false });
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
    const { wsConnected } = this.state;
    return (
      <ThemeProvider theme={ theme }>
        <FlexContainer direction="column" fullHeight>
          <Main>
            <Websocket
              debug
              url="ws://localhost:4000"
              onOpen={ this.onSocketOpen }
              onClose={ this.onSocketClose }
              onMessage={ this.onSocketMessage }
              reconnect={ false } />
            <Game game={ store.currentGame } />
          </Main>
          <AppInfo>
            <HeaderTitle>pongy!</HeaderTitle>
            <WSConnectionIndicator connected={ wsConnected }>
              { wsConnected ? 'Connected' : 'Disconnected' }
            </WSConnectionIndicator>
          </AppInfo>
        </FlexContainer>
      </ThemeProvider>
    );
  }
});

App.propTypes = {
  store: PropTypes.object,
};

export default App;
