import Player from '../../../stores/objects/player';

describe('Player', () => {
  let subject;

  beforeEach(() => {
    subject = new Player('1234', 'PlayerOne');
  });

  describe('constructor', () => {
    it('should create a Player instance with initial properties', () => {
      expect(subject).toBeInstanceOf(Player);
      expect(subject).toMatchSnapshot();
    });
  });

  describe('computed properties', () => {
  });

  describe('actions', () => {
    describe('incrementScore', () => {
      beforeEach(() => {
        subject.incrementScore();
      });

      it('should increment score by 1', () => {
        expect(subject.score).toBe(1);
      });
    });

    describe('decrementScore', () => {
      it('should NOT decrement score if it is 0', () => {
        subject.decrementScore();
        expect(subject.score).toBe(0);
      });

      it('should decrement score by 1', () => {
        subject.score = 3;
        subject.decrementScore();
        expect(subject.score).toBe(2);
      });
    });
  });
});
