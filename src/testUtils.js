import { transaction } from 'mobx';

/**
 * Get a random integer between given min and max range.
 * Optionally specify if value should be even or odd.
 *
 * @param {number} min Range minimum
 * @param {number} max Range maximum
 * @param {object} [options] Options
 * @param {boolean} [options.even] Should return even number
 * @param {boolean} [options.odd] Should return odd number
 *
 * @return {number}
 */
const randomInt = (min, max, options = {}) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (options.even && num % 2 !== 0) {
    return randomInt(min, max, options);
  }
  if (options.odd && num % 2 !== 1) {
    return randomInt(min, max, options);
  }
  return num;
}

/**
 * Set player scores
 *
 * @param {Player} playerOne First player
 * @param {Player} playerTwo Second player
 * @param {number} scoreOne Score to set for first player
 * @param {number} scoreTwo Score to set for second player
 */
export const setScore = (playerOne, playerTwo, scoreOne, scoreTwo) => (
  transaction(() => {
    playerOne.score = scoreOne;
    playerTwo.score = scoreTwo;
  })
);


/**
 * Create a score where both players have zero
 *
 * @return {Score} score object
 */
export const noScore = () => {
  return {
    one: 0,
    two: 0
  };
}

/**
 * Create a deuce score where no player has advantage
 *
 * @return {Score} score object
 */
export const deuceScore = () => {
  const score = randomInt(10, 15);
  return {
    one: score,
    two: score
  };
}

/**
 * Create a non-deuce score where the given player is winning
 *
 * @param {number} winning Which player is winning [1|2]
 * @param {object} [options] Should score total be even or odd
 *
 * @return {Score} score object
 */
export const gameScore = (winning, options = {}) => {
  const winningPlayer = winning || 1;
  const winningScore = randomInt(1, 9);
  let otherScore = randomInt(0, winningScore - 1);

  if (options.even) {
    const winningIsOne = winningScore === 1;
    const winningIsEven = winningScore % 2 === 0;
    const max = winningIsOne ? winningScore : winningScore - 1;
    const opts = winningIsEven ? { even: true } : { odd: true };
    otherScore = randomInt(0, max, opts);
  }

  if (options.odd) {
    const winningIsOne = winningScore === 1;
    const winningIsEven = winningScore % 2 === 0;
    const max = winningIsOne ? winningScore : winningScore - 1;
    const opts = winningIsEven ? { odd: true } : { even: true };
    otherScore = randomInt(0, max, opts);
  }

  return {
    one: winningPlayer === 1 ? winningScore : otherScore,
    two: winningPlayer === 1 ? otherScore : winningScore,
    total: winningScore + otherScore
  };
}

/**
 * Create a deuce score where the given player has advantage
 *
 * @param {number} winning Which player is winning [1|2]
 * @return {Score} score object
 */
export const adScore = (winning) => {
  const winningPlayer = winning || 1;
  const winningScore = randomInt(11, 15);
  const otherScore = winningScore - 1;
  return {
    one: winningPlayer === 1 ? winningScore : otherScore,
    two: winningPlayer === 1 ? otherScore : winningScore
  };
}

/**
 * Create a final score where the given player has won
 *
 * @param {number} winning Which player has won [1|2]
 * @return {Score} score object
 */
export const finalScore = (winning) => {
  const winningPlayer = winning || 1;
  const winningScore = 11;
  const otherScore = randomInt(0, 9);
  return {
    one: winningPlayer === 1 ? winningScore : otherScore,
    two: winningPlayer === 1 ? otherScore : winningScore
  };
}
