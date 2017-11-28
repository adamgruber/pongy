import Game from '../../../stores/objects/game';
import Player from '../../../stores/objects/player';
import {
  adScore,
  deuceScore,
  finalScore,
  gameScore,
  noScore,
  setScore
} from '../../../testUtils';

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
        setScore(pOne, pTwo, 3, 4);
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
        setScore(pOne, pTwo, 2, 5);
        expect(subject.isGameTied).toBe(false);
      });
    });

    describe('isDeuce', () => {
      [
        { ...noScore(), expected: false },
        { ...deuceScore(), expected: true },
        { ...gameScore(1), expected: false },
        { ...gameScore(2), expected: false },
        { ...adScore(1), expected: false },
        { ...adScore(2), expected: false },
        { ...finalScore(1), expected: false },
        { ...finalScore(2), expected: false }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          setScore(pOne, pTwo, one, two);
          expect(subject.isDeuce).toBe(expected);
        });
      });
    });

    describe('server', () => {
      const gameScoreOneEven = gameScore(1, { even: true });
      const gameScoreOneOdd = gameScore(1, { odd: true });
      const gameScoreTwoEven = gameScore(2, { even: true });
      const gameScoreTwoOdd = gameScore(2, { odd: true });
      const getExpected = (total) => Math.floor(total / 2) % 2 === 0 ? 0 : 1;

      [
        { ...noScore(), expected: 0 },
        { ...deuceScore(), expected: 0 },
        {...gameScoreOneEven, expected: getExpected(gameScoreOneEven.total) },
        {...gameScoreOneOdd, expected: getExpected(gameScoreOneOdd.total) },
        {...gameScoreTwoEven, expected: getExpected(gameScoreTwoEven.total) },
        {...gameScoreTwoOdd, expected: getExpected(gameScoreTwoOdd.total) },
        { ...adScore(1), expected: 1 },
        { ...adScore(2), expected: 1 }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          setScore(pOne, pTwo, one, two);
          expect(subject.server).toBe(subject.players[expected].id);
        });
      });
    });

    describe('isGameOver', () => {
      [
        { ...noScore(), expected: false },
        { ...deuceScore(), expected: false },
        { ...gameScore(1), expected: false },
        { ...gameScore(2), expected: false },
        { ...adScore(1), expected: false },
        { ...adScore(2), expected: false },
        { ...finalScore(1), expected: true },
        { ...finalScore(2), expected: true }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          setScore(pOne, pTwo, one, two);
          expect(subject.isGameOver).toBe(expected);
        });
      });
    });

    describe('winner', () => {
      [
        { ...noScore(), expected: undefined },
        { ...deuceScore(), expected: undefined },
        { ...gameScore(1), expected: undefined },
        { ...gameScore(2), expected: undefined },
        { ...adScore(1), expected: undefined },
        { ...adScore(2), expected: undefined },
        { ...finalScore(1), expected: 0 },
        { ...finalScore(2), expected: 1 }
      ].forEach(({one, two, winner, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          setScore(pOne, pTwo, one, two);
          expect(subject.winner).toBe(
            expected === undefined
              ? expected
              : subject.players[expected].id
          );
        });
      });
    });

    describe('playerAdvantage', () => {
      [
        { ...deuceScore(), expected: undefined },
        { ...gameScore(1), expected: undefined },
        { ...gameScore(2), expected: undefined },
        { ...adScore(1), expected: 0 },
        { ...adScore(2), expected: 1 },
        { ...finalScore(1), expected: undefined },
        { ...finalScore(2), expected: undefined }
      ].forEach(({one, two, expected }) => {
        it(`should return ${expected} when score is ${one}:${two}`, () => {
          setScore(pOne, pTwo, one, two);
          expect(subject.playerAdvantage).toBe(
            expected === undefined
              ? expected
              : subject.players[expected].id
          );
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
          const { one, two } = gameScore();
          setScore(pOne, pTwo, one, two);
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
          const { one, two } = finalScore();
          setScore(pOne, pTwo, one, two);
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
      { ...deuceScore(), expected: 'Deuce' },
      { ...adScore(1), expected: 'Advantage Player one' },
      { ...adScore(2), expected: 'Advantage Player two' },
      { ...finalScore(1), expected: 'Player one wins.' },
      { ...finalScore(2), expected: 'Player two wins.' },
      { one: 0, two: 1, expected: '0, 1' },
      { one: 0, two: 2, expected: '2, 0' },
      { one: 1, two: 2, expected: '2, 1' }
    ].forEach(({one, two, expected }) => {
      it(`should say "${expected}" when score is ${one}:${two}`, () => {
        setScore(pOne, pTwo, one, two);
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
    const gameOne = gameScore(1);
    const finalOne = finalScore(1);
    [
      { ...noScore(), expected: 0 },
      { ...deuceScore(), expected: 10 },
      { ...gameOne, expected: gameOne.one },
      { ...adScore(1), expected: 10 },
      { ...finalOne, expected: finalOne.one },
    ].forEach(({one, two, expected }) => {
      it(`should return ${expected} for player 1 when score is ${one}:${two}`, () => {
        setScore(pOne, pTwo, one, two);
        expect(subject.getDisplayScoreForPlayer(pOne.id)).toBe(expected);
      });
    });
  });
});
