import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { FlexContainer } from 'common-styled-components';
import PlayerPanel from './PlayerPanel';
import { DeuceNote } from './styled';

const Game = observer(({ game }) => {
  return (
    <FlexContainer justify="space-around" fullHeight>
      { game.players.map(player => {
        const { id, title, score } = player;
        const { winner, server, playerAdvantage, scoreTotal } = game;
        const serveNumber = game.isDeuce ? 1 : (scoreTotal % 2 === 0 ? 1 : 2);
        const displayScore = game.getDisplayScoreForPlayer(id);
        return (
          <PlayerPanel
            key={ id}
            title={ title }
            score={ displayScore }
            hasWon={ id === winner }
            hasAdvantage={ id === playerAdvantage }
            isServer={ id === server }
            isDeuce={ game.isDeuce }
            isGameOver={ game.isGameOver }
            serveNumber={ serveNumber } />
        );
      }) }
      <DeuceNote show={ game.isDeuce && !game.playerAdvantage }>DEUCE</DeuceNote>
    </FlexContainer>
  );
});

Game.propTypes = {
  game: PropTypes.object,
};

export default Game;
