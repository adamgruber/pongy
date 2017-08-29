import React from 'react';
import ReactDOM from 'react-dom';
import GameStore from 'stores/games';
import './index.css';
import App from './App';

const gameStore = new GameStore();
window.gameStore = gameStore;
window.game = gameStore.createGame();

ReactDOM.render(
  <App store={ gameStore } />,
  document.getElementById('root')
);
