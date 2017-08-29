import React, { Component } from 'react';
import WS from 'ws';

class WebsocketClient extends Component {
  constructor(props) {
    super(props);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount() {
    this.wsClient = new WS('ws://localhost:4000');
    this.wsClient.on('open', this.onOpen);
    this.wsClient.on('close', this.onClose);
    this.wsClient.on('message', this.onMessage);
    this.wsClient.on('error', this.onError);
  }

  onOpen() {
    console.log('client open');
  }

  onClose() {
    console.log('client close');
  }

  onMessage(msg) {
    console.log(msg);
  }

  onError(err) {
    console.log(err);
  }

  render() {
    return false;
  }
};

export default WebsocketClient;
