import { extendObservable, action, autorun } from 'mobx';
import uuid from 'uuid';

class Game {
  constructor(id = uuid.v4(), players) {
    this.id = id;
    this.players = players;
    this.winingScore = 11;
    this.initialServer = players[0].id;

    extendObservable(this, {
      isActive: false,
      server: null,

      get playerOne() {
        return this.players[0];
      },

      get playerTwo() {
        return this.players[1];
      },

      get score() {
        return {
          playerOne: this.playerOne.score,
          playerTwo: this.playerTwo.score
        };
      },

      get scoreTotal() {
        return this.playerOne.score + this.playerTwo.score;
      },

      get isGameTied() {
        const { score: pOneScore } = this.playerOne;
        const { score: pTwoScore } = this.playerTwo;
        return pOneScore === pTwoScore;
      },

      get isDeuce() {
        const deuceScore = this.winingScore - 1;
        const { score: pOneScore } = this.playerOne;
        const { score: pTwoScore } = this.playerTwo;
        return !this.isGameOver && this.isGameTied && (
          pOneScore >= deuceScore && pTwoScore >= deuceScore
        );
      },

      get isGameOver() {
        return this._playerOneHasWon() || this._playerTwoHasWon();
      },

      get winner() {
        if (!this.isGameOver) {
          return undefined;
        }

        if (this._playerOneHasWon()) {
          return this.playerOne.id;
        }

        if (this._playerTwoHasWon()) {
          return this.playerTwo.id;
        }
      },

      get playerAdvantage() {
        if (this.isGameTied || this.isGameOver) {
          return undefined;
        }

        const deuceScore = this.winingScore - 1;
        const { score: pOneScore, id: pOneId } = this.playerOne;
        const { score: pTwoScore, id: pTwoId } = this.playerTwo;

        if (pOneScore <= deuceScore && pTwoScore <= deuceScore) {
          return undefined;
        }
        return (pOneScore > pTwoScore) ? pOneId : pTwoId;
      },

      incrementScore: action(playerIndex => {
        // Disallow incrementing when a game is over
        if (!this.isGameOver) {
          this.players[playerIndex].incrementScore();
        }
      }),

      decrementScore: action(playerIndex => {
        this.players[playerIndex].decrementScore();
      }),

      toggleIsActive: action((isActive) => {
        this.isActive = (isActive === undefined ? !this.isActive : isActive);
      }),
    });

    // Use autorun to call a function whenever observed
    // values referenced in that function have changed
    autorun(this._determineServer.bind(this));
  }

  /*
   * Determine the current server based on `isDeuce`
   * and the `scoreTotal`. Runs whenever either property
   * has changed and modifies the observable `server` property
   */
  _determineServer() {
    let nextServer;

    if (this.isDeuce) {
      nextServer = (this.scoreTotal % 2 === 0)
        ? this.playerOne.id : this.playerTwo.id;

    } else if (this.scoreTotal === 0) {
      nextServer = this.playerOne.id;

    } else if (this.scoreTotal % 2 === 0) {
      nextServer = this._getOppositeServer();
    }

    if (nextServer) {
      this.server = nextServer;
    }
  }

  _playerOneHasWon() {
    return (
      this._hasWinningScore(this.playerOne) &&
      this._hasTwoPointLead(this.playerOne, this.playerTwo)
    );
  }

  _playerTwoHasWon() {
    return (
      this._hasWinningScore(this.playerTwo) &&
      this._hasTwoPointLead(this.playerTwo, this.playerOne)
    );
  }

  _hasWinningScore(player) {
    return player.score >= this.winingScore;
  }

  _hasTwoPointLead(playerA, playerB) {
    return playerA.score >= (playerB.score + 2);
  }

  _getOppositeServer() {
    const { id: pOneId } = this.playerOne;
    const { id: pTwoId } = this.playerTwo;
    return (this.server === pOneId) ? pTwoId : pOneId;
  }

  _getPlayerById(playerId) {
    return this.players.filter(player => player.id === playerId)[0];
  }

  getDisplayScoreForPlayer(playerId) {
    if (this.isDeuce || this.playerAdvantage) {
      return this.winingScore - 1;
    }

    return this._getPlayerById(playerId).score;
  }

  // Temp helper methods
  setDeuce() {
    this.playerOne.score = 10;
    this.playerTwo.score = 10;
  }

  setAdvantage(player = 0) {
    const pOne = this.players[player];
    const pTwo = player === 0
      ? this.players[1]
      : this.players[0];

    pOne.score = 11;
    pTwo.score = 10;
  }

  setWinner(player = 0) {
    const pOne = this.players[player];
    const pTwo = player === 0
      ? this.players[1]
      : this.players[0];

    pOne.score = 11;
    pTwo.score = 9;
  }
}

export default Game;
