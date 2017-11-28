import { transaction } from 'mobx';
import Game from '../../../stores/objects/game';
import Player from '../../../stores/objects/player';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonWinningScore = () => randomInt(0, 9);

describe('Game', () => {
  let subject;
  let pOne;
  let pTwo;

  beforeEach(() => {
    pOne = new Player('1', 'PlayerOne');
    pTwo = new Player('2', 'PlayerTwo');
    subject = new Game('1234', [pOne, pTwo]);
  });

  describe('constructor', () => {
    it('should create a Game instance with initial properties', () => {
      expect(subject).toBeInstanceOf(Game);
      expect(subject).toMatchSnapshot();
    });

    it('should assign an ID when one is not provided', () => {
      const game = new Game(null, [pOne, pTwo]);
      expect(game).toHaveProperty('id', expect.any(String));
    });
  });

  describe('computed properties', () => {
    describe('playerOne', () => {
      it('should return the first item in the players array', () => {
        expect(subject.playerOne).toBe(pOne);
      });
    });

    describe('playerTwo', () => {
      it('should return the second item in the players array', () => {
        expect(subject.playerTwo).toBe(pTwo);
      });
    });

    describe('score', () => {
      it('should return an object with player scores', () => {
        expect(subject.score).toMatchSnapshot();
      });
    });

    describe('scoreTotal', () => {
      beforeEach(() => {
        transaction(() => {
          pOne.score = 3;
          pTwo.score = 4;
        });
      });

      it('should return the sum of scores from all players', () => {
        expect(subject.scoreTotal).toBe(7);
      });
    });

    describe('isGameTied', () => {
      it('should return true when player scores are the same', () => {
        expect(subject.isGameTied).toBe(true);
      });

      it('should return false when player scores are different', () => {
        pOne.score = 1;
        expect(subject.isGameTied).toBe(false);
      });
    });

    describe('isDeuce', () => {
      [
        { one: 10, two: 10, expected: true },
        { one: 11, two: 11, expected: true },
        { one: 13, two: 11, expected: false },
        { one: 12, two: 11, expected: false },
        { one: 12, two: 10, expected: false },
        { one: 11, two: 10, expected: false },
        { one: 10, two: nonWinningScore(), expected: false },
        { one: nonWinningScore(), two: nonWinningScore(), expected: false }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          transaction(() => {
            pOne.score = one;
            pTwo.score = two;
          });
          expect(subject.isDeuce).toBe(expected);
        });
      });
    });

    describe('server', () => {
      [
        { one: 12, two: 10, expected: 1 },
        { one: 11, two: 11, expected: 0 },
        { one: 10, two: 11, expected: 1 },
        { one: 11, two: 10, expected: 1 },
        { one: 10, two: 10, expected: 0 },
        { one: 2, two: 0, expected: 1 },
        { one: 1, two: 0, expected: 0 },
        { one: 0, two: 0, expected: 0 }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          transaction(() => {
            pOne.score = one;
            pTwo.score = two;
          });
          expect(subject.server).toBe(subject.players[expected].id);
        });
      });
    });

    describe('isGameOver', () => {
      [
        { one: 13, two: 11, expected: true },
        { one: 12, two: 11, expected: false },
        { one: 11, two: 11, expected: false },
        { one: 12, two: 10, expected: true },
        { one: 11, two: 10, expected: false },
        { one: 10, two: 10, expected: false },
        { one: nonWinningScore(), two: nonWinningScore(), expected: false },
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          transaction(() => {
            pOne.score = one;
            pTwo.score = two;
          });
          expect(subject.isGameOver).toBe(expected);
        });
      });
    });

    describe('winner', () => {
      [
        { one: 13, two: 11, expected: 0 },
        { one: 12, two: 11, expected: undefined },
        { one: 11, two: 12, expected: undefined },
        { one: 11, two: 11, expected: undefined },
        { one: 12, two: 10, expected: 0 },
        { one: 10, two: 12, expected: 1 },
        { one: 7, two: 11, expected: 1 },
        { one: 2, two: 8, expected: undefined },
        { one: nonWinningScore(), two: nonWinningScore(), expected: undefined },
      ].forEach(({one, two, winner, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          transaction(() => {
            pOne.score = one;
            pTwo.score = two;
          });
          if (expected === undefined) {
            expect(subject.winner).toBe(expected);
          } else {
            expect(subject.winner).toBe(subject.players[expected].id);
          }
        });
      });
    });

    describe('playerAdvantage', () => {
      [
        { one: 10, two: 11, expected: 1 },
        { one: 11, two: 10, expected: 0 },
        { one: 10, two: 10, expected: undefined },
        { one: 12, two: 10, expected: undefined },
        { one: nonWinningScore(), two: nonWinningScore(), expected: undefined }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          transaction(() => {
            pOne.score = one;
            pTwo.score = two;
          });
          if (expected === undefined) {
            expect(subject.playerAdvantage).toBe(expected);
          } else {
            expect(subject.playerAdvantage).toBe(subject.players[expected].id);
          }
        });
      });
    });
  });

  describe('actions', () => {
    describe('incrementScore', () => {
      beforeEach(() => {
        pOne.incrementScore = jest.fn();
        pTwo.incrementScore = jest.fn();
      });

      describe('when game is not over', () => {
        beforeEach(() => {
          pOne.score = nonWinningScore();
          pTwo.score = nonWinningScore();
        });

        it('should call incrementScore for player 1', () => {
          subject.incrementScore(0);
          expect(pOne.incrementScore).toBeCalled();
        });

        it('should call incrementScore for player 2', () => {
          subject.incrementScore(1);
          expect(pTwo.incrementScore).toBeCalled();
        });
      });

      describe('when game is over', () => {
        beforeEach(() => {
          pOne.score = 11;
          pTwo.score = nonWinningScore();
        });

        it('should NOT call incrementScore for player 1', () => {
          subject.incrementScore(0);
          expect(pOne.incrementScore).not.toBeCalled();
        });

        it('should NOT call incrementScore for player 2', () => {
          subject.incrementScore(1);
          expect(pTwo.incrementScore).not.toBeCalled();
        });
      });
    });

    describe('decrementScore', () => {
      beforeEach(() => {
        pOne.decrementScore = jest.fn();
        pTwo.decrementScore = jest.fn();
      });

      it('should call decrementScore for player 1', () => {
        subject.decrementScore(0);
        expect(pOne.decrementScore).toBeCalled();
      });

      it('should call decrementScore for player 2', () => {
        subject.decrementScore(1);
        expect(pTwo.decrementScore).toBeCalled();
      });
    });

    describe('toggleIsActive', () => {
      it('should toggle isActive property', () => {
        expect(subject.isActive).toBe(false);
        subject.toggleIsActive();
        expect(subject.isActive).toBe(true);
      });

      it('should set isActive property', () => {
        expect(subject.isActive).toBe(false);
        subject.toggleIsActive(false);
        expect(subject.isActive).toBe(false);
      });
    });
  });

  describe('_announceScores', () => {
    beforeEach(() => {
      window.speechSynthesis.speak.mockClear();
    });

    it('should announce a new game', () => {
      subject._announceScores();
      expect(window.speechSynthesis.speak)
        .toBeCalledWith({ sentence: 'New game.' });
    });

    [
      { one: 11, two: 11, expected: 'Deuce' },
      { one: 10, two: 10, expected: 'Deuce' },
      { one: 11, two: 10, expected: 'Advantage Player one' },
      { one: 10, two: 11, expected: 'Advantage Player two' },
      { one: 11, two: 7, expected: 'Player one wins.' },
      { one: 7, two: 11, expected: 'Player two wins.' },
      { one: 0, two: 1, expected: '0, 1' },
      { one: 0, two: 2, expected: '2, 0' },
      { one: 1, two: 2, expected: '2, 1' },
    ].forEach(({one, two, expected }) => {
      it(`should say "${expected}" when score is ${one}:${two}`, () => {
        transaction(() => {
          pOne.score = one;
          pTwo.score = two;
        });
        expect(window.speechSynthesis.speak)
          .toBeCalledWith({ sentence: expected });
      });
    });

    describe('when synth is speaking', () => {
      beforeEach(() => {
        window.speechSynthesis.speaking = true;
        subject._announceScores();
      });

      it('should pause and cancel synth', () => {
        expect(window.speechSynthesis.pause).toBeCalled();
        expect(window.speechSynthesis.cancel).toBeCalled();
      });
    });

    describe('when synth is pending', () => {
      beforeEach(() => {
        window.speechSynthesis.pending = true;
        subject._announceScores();
      });

      it('should pause and cancel synth', () => {
        expect(window.speechSynthesis.pause).toBeCalled();
        expect(window.speechSynthesis.cancel).toBeCalled();
      });
    });
  });

  describe('getDisplayScoreForPlayer', () => {
    const pOneScore = nonWinningScore();
    [
      { one: 12, two: 10, expected: 12 },
      { one: 11, two: 11, expected: 10 },
      { one: 11, two: 10, expected: 10 },
      { one: 10, two: 10, expected: 10 },
      { one: pOneScore, two: 11, expected: pOneScore },
      { one: pOneScore, two: 10, expected: pOneScore },
      { one: pOneScore, two: nonWinningScore(), expected: pOneScore }
    ].forEach(({one, two, expected }) => {
      it(`should return ${expected} for player 1 when score is ${one}:${two}`, () => {
        transaction(() => {
          pOne.score = one;
          pTwo.score = two;
        });
        expect(subject.getDisplayScoreForPlayer(pOne.id)).toBe(expected);
      });
    });
  });
});
