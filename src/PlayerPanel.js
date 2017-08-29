import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Score, PlayerTitle } from './styled';

const ServeIndicatorWrap = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ServeIndicator = ({ showActive, serve }) => (
    <ServeIndicatorWrap>
      <ServiceDot active={ showActive && serve === 1 } />
      <ServiceDot active={ showActive && serve === 2 } />
    </ServeIndicatorWrap>
);

const AdvantageIndicator = props => (
  (props.hasAdvantage && <div>Advantage</div>) || null
);

const ServiceDot = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background-color: ${props => props.active ? 'green' : '#ccc' }
`;

const PlayerPanel = ({ title, score, className, hasWon, hasAdvantage, isServer, serveNumber }) => (
  <div className={ className }>
    <PlayerTitle>{ title }</PlayerTitle>
    <Score>{ score }</Score>
    <ServeIndicator showActive={ isServer} serve={ serveNumber } />
    <AdvantageIndicator hasAdvantage={ hasAdvantage } />
    { hasWon && <div>A WINNER IS YOU!</div> }
  </div>
);

PlayerPanel.propTypes = {
  title: PropTypes.string,
  score: PropTypes.number,
  className: PropTypes.string,
  hasWon: PropTypes.bool,
  hasAdvantage: PropTypes.bool,
  isServer: PropTypes.bool,
  serveNumber: PropTypes.bool,
};

export default PlayerPanel;
