import GameStore from '../../stores/games';
import Game from '../../stores/objects/game';

describe('GameStore', () => {
  let store;

  beforeEach(() => {
    store = new GameStore();
  });

  describe('constructor', () => {
    it('should create a GameStore instance', () => {
      expect(store).toBeInstanceOf(GameStore);
    });

    it('initializes a new store with expected properties', () => {
      expect(store).toMatchSnapshot();
    });
  });

  describe('computed properties', () => {
    describe('currentGame', () => {
      let game;

      beforeEach(() => {
        game = store.createGame();
      });

      it('should return active game', () => {
        expect(store.currentGame).toBe(game);
      });
    });
  });

  describe('actions', () => {
    describe('newGame', () => {
      beforeEach(() => {
        store.createGame = jest.fn();
        store.newGame();
      });

      it('should call `createGame` method', () => {
        expect(store.createGame).toBeCalled();
      });
    });

    describe('incrementScore', () => {
      let game;

      beforeEach(() => {
        game = store.createGame();
        game.incrementScore = jest.fn();
        store.incrementScore(0);
      });

      it('should call `incrementScore` method on current game', () => {
        expect(game.incrementScore).toBeCalledWith(0);
      });
    });

    describe('decrementScore', () => {
      let game;

      beforeEach(() => {
        game = store.createGame();
        game.decrementScore = jest.fn();
        store.decrementScore(0);
      });

      it('should call `decrementScore` method on current game', () => {
        expect(game.decrementScore).toBeCalledWith(0);
      });
    });
  });

  describe('createGame', () => {
    let returned;

    beforeEach(() => {
      store.setActiveGame = jest.fn();
      returned = store.createGame();
    });

    it('should add a new game to the games array', () => {
      expect(store.games.length).toBe(1);
    });

    it('should call setActiveGame with id of new game', () => {
      expect(store.setActiveGame).toBeCalledWith(returned.id);
    });

    it('should return the game object', () => {
      expect(returned).toBe(store.games[0]);
    });
  });

  describe('setActiveGame', () => {
    let game1;
    let game2;

    beforeEach(() => {
      game1 = store.createGame();
      game2 = store.createGame();
      game1.toggleIsActive = jest.fn();
      game2.toggleIsActive = jest.fn();
      store.setActiveGame(game1.id);
    });

    it('should call toggleIsActive for each game', () => {
      expect(game1.toggleIsActive).toBeCalledWith(true);
      expect(game2.toggleIsActive).toBeCalledWith(false);
    });
  });

  describe('getGameById', () => {
    let game;
    let returned;
    it('should fetch game by id', () => {
      game = store.createGame();
      store.createGame();
      store.createGame();
      returned = store.getGameById(game.id);
    });

    expect(returned).toBe(game);
  });
});
