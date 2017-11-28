import { extendObservable, action, autorun } from 'mobx';
import uuid from 'uuid';

class Game {
  /**
   * Create a new Game instance
   *
   * @param {string} id ID for game, defaults to new UUID
   * @param {Player[]} players Array of Player instances
   */
  constructor(id = uuid.v4(), players) {
    this.id = id;
    this.players = players;
    this.winingScore = 11;
    this.initialServer = players[0].id;

    extendObservable(this, {
      isActive: false,

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

      get server() {
        return this._getCurrentServer();
      },

      get isGameOver() {
        return this._playerOneHasWon() || this._playerTwoHasWon();
      },

      get winner() {
        if (!this.isGameOver) {
          return undefined;
        }

        /* istanbul ignore else */
        if (this._playerOneHasWon()) {
          return this.playerOne.id;
        }

        /* istanbul ignore else */
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

      /**
       * Increment score of player at given index by 1.
       * If game is over, score will not be incremented
       *
       * @param {number} playerIndex Index of player in players array
       */
      incrementScore: action(playerIndex => {
        if (!this.isGameOver) {
          this.players[playerIndex].incrementScore();
        }
      }),

      /**
       * Decrement score of player at given index by 1.
       *
       * @param {number} playerIndex Index of player in players array
       */
      decrementScore: action(playerIndex => {
        this.players[playerIndex].decrementScore();
      }),

      /**
       * Toggles or sets the `isActive` property. If the "isActive"
       * argument is supplied, it will set `isActive` to that value.
       * Otherwise it toggles the current value.
       *
       * @param {boolean} [isActive] Value to set
       */
      toggleIsActive: action((isActive) => {
        this.isActive = (isActive === undefined ? !this.isActive : isActive);
      }),
    });

    // Use autorun to call a function whenever observed
    // values referenced in that function have changed
    autorun(this._announceScores.bind(this));
  }

  /**
   * Announce scores using the experimental Speech Synthesis API.
   * Runs whenever `scoreTotal` has changed.
   */
  _announceScores() {
    let sentence;
    if (this.scoreTotal === 0) {
      sentence = 'New game.';
    } else if (this.playerAdvantage) {
      const player = this.playerAdvantage === this.playerOne.id ? 'one' : 'two';
      sentence = `Advantage Player ${player}`;
    } else if (this.isDeuce) {
      sentence = 'Deuce';
    } else if (this._playerOneHasWon()) {
      sentence = 'Player one wins.';
    } else if (this._playerTwoHasWon()) {
      sentence = 'Player two wins.';
    } else {
      const server = this._getPlayerById(this._getCurrentServer());
      const receiver = this._getPlayerById(
        this._getOppositeServer(server.id)
      );
      sentence = `${server.score}, ${receiver.score}`;
    }

    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(sentence);
    if (synth.speaking || synth.pending) {
      synth.pause();
      synth.cancel();
    }
    synth.speak(utter);
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

  _getOppositeServer(playerId) {
    const { id: pOneId } = this.playerOne;
    const { id: pTwoId } = this.playerTwo;
    return (playerId === pOneId) ? pTwoId : pOneId;
  }

  _getPlayerById(playerId) {
    return this.players.filter(player => player.id === playerId)[0];
  }

  _getCurrentServer() {
    const divisor = (this.playerAdvantage || this.isDeuce) ? 1 : 2;
    const isInitialServer = Math.floor(this.scoreTotal / divisor) % 2 === 0;
    return isInitialServer ? this.playerOne.id : this.playerTwo.id;
  }

  getDisplayScoreForPlayer(playerId) {
    if (this.isDeuce || this.playerAdvantage) {
      return this.winingScore - 1;
    }

    return this._getPlayerById(playerId).score;
  }

  // ---
  // Helper methods useful for debugging
  // ---

  /* istanbul ignore next */
  setDeuce() {
    this.playerOne.score = 10;
    this.playerTwo.score = 10;
  }

  /* istanbul ignore next */
  setAdvantage(player = 0) {
    const pOne = this.players[player];
    const pTwo = player === 0
      ? this.players[1]
      : this.players[0];

    pOne.score = 11;
    pTwo.score = 10;
  }

  /* istanbul ignore next */
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
