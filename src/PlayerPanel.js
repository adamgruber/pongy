import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainer } from 'common-styled-components';
import {
  Panel,
  PlayerStatus,
  PlayerTitle,
  Score,
  ServeIndicatorInner,
  ServeIndicatorWrap,
  ServiceDot,
} from './styled';

const ServeIndicator = ({ showActive, serve, isDeuce }) => (
    <ServeIndicatorWrap>
      <ServeIndicatorInner>
        <ServiceDot active={ showActive && serve === 1 } />
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
    <ServeIndicator
      showActive={ !isGameOver && isServer }
      serve={ serveNumber }
      isDeuce={ isDeuce } />
    <FlexContainer
      direction="column"
      align="center"
      justify="center"
      height="80%">
      <PlayerStatus
        visible={ hasAdvantage || hasWon }
        win={ hasWon }>{ hasWon ? 'Winner' : 'Advantage' }
      </PlayerStatus>
      <Score hasWon={ hasWon }>{ score }</Score>
      </FlexContainer>
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
