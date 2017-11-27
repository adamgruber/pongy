import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel,
  PlayerStatus,
  PlayerTitle,
  Score,
  ScoreBox,
  ServeIndicatorInner,
  ServeIndicatorWrap,
  ServiceDot,
} from './styled';

const ServeIndicator = ({ showActive, serve, isDeuce }) => (
    <ServeIndicatorWrap>
      <ServeIndicatorInner>
        <ServiceDot isDeuce={ isDeuce } active={ showActive && serve === 1 } />
        { !isDeuce && <ServiceDot active={ showActive && serve === 2 } /> }
      </ServeIndicatorInner>
    </ServeIndicatorWrap>
);

const PlayerPanel = ({
  className,
  hasAdvantage,
  hasWon,
  isDeuce,
  isGameOver,
  isServer,
  score,
  serveNumber,
  title,
}) => (
  <Panel>
    <PlayerTitle>{ title }</PlayerTitle>
    <PlayerStatus
      visible={ hasAdvantage || hasWon }
      hasWon={ hasWon }>{ hasWon ? 'Winner' : 'Advantage' }
    </PlayerStatus>
    <ScoreBox>
      <Score
        hasAdvantage={ hasAdvantage }
        hasWon={ hasWon }>{ score }
      </Score>
    </ScoreBox>
    <ServeIndicator
      showActive={ !isGameOver && isServer }
      serve={ serveNumber }
      isDeuce={ hasAdvantage || isDeuce } />
  </Panel>
);

PlayerPanel.propTypes = {
  hasAdvantage: PropTypes.bool,
  hasWon: PropTypes.bool,
  isDeuce: PropTypes.bool,
  isServer: PropTypes.bool,
  score: PropTypes.number,
  serveNumber: PropTypes.number,
  title: PropTypes.string,
};

export default PlayerPanel;
