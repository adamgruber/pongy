import { extendObservable, action } from 'mobx';
import find from 'lodash/find';
import uuid from 'uuid';
import Game from './objects/game';
import Player from './objects/player';

class GameStore {
    constructor() {
        extendObservable(this, {
          games: [],

          get currentGame() {
            return find(this.games, { isActive: true });
          },

          newGame: action(id => this.createGame(id)),
          incrementScore: action(playerIndex => this.currentGame.incrementScore(playerIndex)),
          decrementScore: action(playerIndex => this.currentGame.decrementScore(playerIndex)),
        });
    }

    createGame(id = uuid.v4()) {
        const game = new Game(id, [
          new Player(uuid.v4(), 'Player One'),
          new Player(uuid.v4(), 'Player Two'),
        ]);
        this.games.push(game);
        this.setActiveGame(id);
        return game;
    }

    setActiveGame(id) {
      this.games.forEach(game => {
        game.toggleIsActive(game.id === id)
      })
    }

    getGameById(id) {
        return find(this.games, { id });
    }
}

export default GameStore;
