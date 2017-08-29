import { extendObservable, action } from 'mobx';
import Game from 'stores/objects/game';
import Player from 'stores/objects/player';
import find from 'lodash/find';
import uuid from 'uuid';

class GameStore {
    constructor() {
        extendObservable(this, {
          games: [],

          get currentGame() {
            return find(this.games, { isActive: true });
          },

          newGame: action(id => this.createGame(id)),
          incrementScore: action(player => this.currentGame.incrementScore(player)),
          decrementScore: action(player => this.currentGame.decrementScore(player)),
        });
    }

    createGame(id = uuid.v4()) {
        const game = new Game(id, [
          new Player(uuid.v4(), 'Player One'),
          new Player(uuid.v4(), 'Player Two'),
        ]);
        this.games.forEach(game => game.toggleIsActive());
        this.games.push(game);
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
