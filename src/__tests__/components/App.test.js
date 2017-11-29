import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import GameStore from '../../stores/games';

const gameStore = new GameStore();
gameStore.createGame();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App store={ gameStore } />, div);
});
