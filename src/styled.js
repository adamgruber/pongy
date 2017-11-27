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
  position: relative;
  top: -2vh;
  font-size: 65vh;
  font-weight: normal;
  margin: 0;
  color: ${p => {
    if (p.hasAdvantage) return p.theme.apricot;
    if (p.hasWon) return p.theme.marine;
    return p.theme.matte;
  }}
`;

export const PlayerTitle = styled.h2.attrs({
  className: 'player-title'
})`
  color: #fff;
  margin: 0;
  font-size: 3.5vh;
  line-height: 10vh;
  background-color: ${p => p.theme.blueberry};
`;

export const HeaderTitle = styled.h1`
  font-weight: normal;
  margin: 0;
`;

export const WSConnectionIndicator = styled.p`
  font-size: 0.75rem;
  margin: 0.5rem 0 0 0;
  color: ${p => p.connected ? p.theme.marine : p.theme.watermelon};
`;

export const DeuceNote = styled.h1.attrs({
  className: 'deuce-note'
})`
  position: absolute;
  top: 10vh;
  margin: 0;
  font-size: 6vh;
  line-height: 12vh;
  color: #fff;
  width: 100%;
  text-align: center;
  background-color: ${p => p.theme.apricot};
  display: ${p => p.show ? 'block' : 'none'};
`;

export const Panel = styled.div.attrs({
  className: 'panel'
})`
  flex-basis: 50%;
  text-align: center;
  &:first-child {
    border-right: 1px solid ${p => p.theme.carbon};
  }
`;

export const ServeIndicatorWrap = styled(FlexContainer).attrs({
  align: 'center'
})`
  margin: 0 auto;
  width: 100%;
`;

export const ServeIndicatorInner = styled(FlexContainer).attrs({
  justify: 'space-around'
})`
  width: 25%;
  margin: 0 auto;
`;

export const ServiceDot = styled.div`
  width: 6vh;
  height: 6vh;
  border-radius: 6vh;
  background-color: ${p => p.active ? p.theme.apricot : p.theme.plaster }
`;

export const PlayerStatus = styled.h1.attrs({
  className: 'player-status'
})`
  font-size: 6vh;
  line-height: 12vh;
  margin: 0;
  color: #fff;
  background-color: ${p => p.hasWon ? p.theme.marine : p.theme.apricot};
  visibility: ${p => p.visible ? 'visible' : 'hidden'};
`;

export const ScoreBox = styled.div.attrs({
  className: 'score-box',
})`
  height: 64vh;
  overflow: hidden;
  position: relative;
`;