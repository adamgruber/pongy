import { Schema } from 'mongoose';
import options from './_options';
import { assignVirtuals } from './_utils';

const WINNING_SCORE = 11;

const { ObjectId } = Schema.Types;

const hasDuplicates = arr =>
  new Set(arr).size !== arr.length;

const toStringArray = arr =>
  arr.map(item => item.toString());

const validateScore = (scoreArray = []) => {
  // Score must be an array with 2 values
  if (scoreArray.length !== 2) {
    return false;
  }

  const [ serverScore, receiverScore ] = scoreArray;

  // Scores must not be negative
  if (serverScore < 0 || receiverScore < 0) {
    return false;
  }

  // Scores must be within 2 points of eachother
  // if any player has more than 11
  if (serverScore !== receiverScore) {
    if (
      (serverScore > WINNING_SCORE)
      && !(Math.abs(serverScore - receiverScore) <= 2)
    ) {
      return false;
    }

    if (
      (receiverScore > WINNING_SCORE)
      && !(Math.abs(receiverScore - serverScore) <= 2)
    ) {
      return false;
    }
  }

  return true;
}

const getWinner = (match) => {
  if (!match || !match.score || !match.score.length) {
    return null;
  }

  const [ serverScore, receiverScore ] = match.score;
  if ((serverScore < WINNING_SCORE) && (receiverScore < WINNING_SCORE)) {
    return null;
  }

  if ((serverScore === WINNING_SCORE) && (receiverScore < 10)) {
    return match.servers;
  }

  if ((serverScore > WINNING_SCORE) && (serverScore - receiverScore === 2)) {
    return match.servers;
  }

  if ((receiverScore === WINNING_SCORE) && (serverScore < 10)) {
    return match.receivers;
  }

  if ((receiverScore > WINNING_SCORE) && (receiverScore - serverScore === 2)) {
    return match.receivers;
  }
};

const validatePlayers = (matchType, opponentsArg = [], playersArg) => {
  // Convert array of ObjectIDs to array of strings for easier comparisons
  const players = toStringArray(playersArg);

  // Basic length checks
  if (
    !players.length
    || hasDuplicates(players)
    || (matchType === 'singles' && players.length !== 1)
    || (matchType === 'doubles' && players.length !== 2)
  ) {
    return false;
  }

  // Guard against duplicates between players and opponent
  const opponents = toStringArray(opponentsArg || []);
  if (hasDuplicates(players.concat(opponents))) {
    return false;
  }

  return true;
}

const Match = Schema({
  /* 
   * Match Type [singles/doubles]
   */
  matchType: {
    type: String,
    required: [true, 'Match type is required'],
    enum: ['singles', 'doubles'],
    lowercase: true,
  },

  /*
   * List of Players on serving side
   * refers to initial server
   */
  servers: [{
    type: ObjectId,
    ref: 'Player',
    validate: {
      validator: function() {
        return validatePlayers(this.matchType, this.receivers, this.servers);
      },
      message: 'Incorrect number or duplicate players supplied',
    },
  }],

  /*
   * List of Players on receiving side
   * refers to initial receiver
   */
  receivers: [{
    type: ObjectId,
    ref: 'Player',
    validate: {
      validator: function() {
        return validatePlayers(this.matchType, this.servers, this.receivers);
      },
      message: 'Incorrect number or duplicate players supplied',
    },
  }],

  /*
   * Game score given as: [server, receiver]
   */
  score: {
    type: [],
    default: [0, 0],
    validate: {
      validator: function(v) {
        return validateScore(v);
      },
      message: 'Invalid score {VALUE}',
    },
  }
}, options);

/* Define virtual properties and getters */
assignVirtuals(Match, {
  isSingles() { return this.matchType === 'singles' },
  isDoubles() { return this.matchType === 'doubles' },
  winner() { return getWinner(this); },
});

/* Update validation */
Match.pre('findOneAndUpdate', function(next) {
  const { score } = this.getUpdate();

  // Disallow changing players or matchType
  delete this._update.matchType;
  delete this._update.servers;
  delete this._update.receivers;

  // Ensure score updates are valid
  const isScoreValid = score && validateScore(score);
  if (!isScoreValid) {
    return next(new Error('Invalid score update'));
  }

  next();
});

export default Match;
