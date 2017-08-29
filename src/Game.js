import React from 'react';
import { observer } from 'mobx-react';
import PlayerPanel from './PlayerPanel';
import PropTypes from 'prop-types';

const Game = observer(({ game }) => {
  return (
    <div>
      { game.players.map(player => {
        const { id, title, score } = player;
        const { winner, server, playerAdvantage, scoreTotal } = game;
        return (
          <PlayerPanel
            key={ id}
            title={ title }
            score={ score }
            hasWon={ id === winner }
            hasAdvantage={ id === playerAdvantage }
            isServer={ id === server }
            serveNumber={ scoreTotal % 2 === 0 ? 1 : 2 } />
        );
      }) }
      { game.isDeuce && !game.playerAdvantage && <div>DEUCE!</div> }
      { game.isGameOver && <div>GAME OVER MAN</div> }
    </div>
  );
});

Game.propTypes = {
  game: PropTypes.object,
};

export default Game;
