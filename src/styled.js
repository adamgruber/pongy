import styled from 'styled-components';
import { FlexContainer } from 'common-styled-components';

export const Main = styled.main`
  flex: 1;
  height: 100vh;
`;

export const AppInfo = styled.div.attrs({
  className: 'app-info'
})`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 20px;
  text-align: right;
`;

export const Score = styled.h1.attrs({
  className: 'score'
})`
  font-size: 70vh;
  font-weight: normal;
  margin: 0;
  color: ${props => props.hasWon ? props.theme.marine : props.theme.matte};
`;

export const PlayerTitle = styled.h2.attrs({
  className: 'player-title'
})`
  color: #fff;
  margin: 0;
  line-height: 4rem;
  background-color: ${props => props.theme.blueberry};
`;

export const HeaderTitle = styled.h1`
  font-weight: normal;
  margin: 0;
`;

export const WSConnectionIndicator = styled.p`
  font-size: 0.75rem;
  margin: 0.5rem 0 0 0;
  color: ${props => props.connected ? props.theme.marine : props.theme.watermelon};
`;

export const DeuceNote = styled.h1.attrs({
  className: 'deuce-note'
})`
  position: absolute;
  top: 50%;
  margin: 0;
  padding: 0.5rem 1rem;
  line-height: 1;
  color: #fff;
  background-color: ${props => props.theme.apricot};
  display: ${props => props.show ? 'block' : 'none'};
`;

export const Panel = styled.div.attrs({
  className: 'panel'
})`
  flex-basis: 50%;
  text-align: center;
  &:first-child {
    border-right: 1px solid ${props => props.theme.matte};
  }
`;

export const ServeIndicatorWrap = styled(FlexContainer).attrs({
  align: 'center'
})`
  background-color: ${props => props.theme.matte};
  height: 2.5rem;
  margin: 0 auto;
`;

export const ServeIndicatorInner = styled(FlexContainer).attrs({
  justify: 'space-around'
})`
  width: 25%;
  margin: 0 auto;
`;

export const ServiceDot = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background-color: ${props => props.active ? props.theme.apricot : props.theme.plaster }
`;

export const PlayerStatus = styled.h1.attrs({
  className: 'player-status'
})`
  position: absolute;
  margin: 0 0 1.5rem 0;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: ${props => props.win ? props.theme.marine : props.theme.apricot};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
`;