import Position from "./position.js";
import helper from "./helper.js";

let dp;

/**
 * Calling populateSteps to run DP on the mine, and find the starting position
 * @param {Object} mine 
 * @return {Integer} starting row
 */
const findStartingPosition = (mine) => {
  const result = helper.populateSteps(mine);
  dp = result.goldGrid;
  return result.row;
}

/**
 * Replace the logic in this function with your own custom movement algorithm.
 *
 * This function should run in a reasonable amount of time and should attempt
 * to collect as much gold as possible.
 *
 * Remember, landing outside the mine's boundary or on a "0" on the mine will
 * result in the run completing.
 *
 * @param  {array} mine - A n x m multidimensional array respresenting the mine.
 * @param  {object} position - The current position of the miner, will be undefined on the first move
 *
 * @return {Position} The new position of the miner.
 */
const move = (mine, position) => {
  if (!position) {
    const row = findStartingPosition(mine);
    return new Position(0, row);
  } else {
    const currentPosition = dp[position.y][position.x];
    if (currentPosition.direction === 'R') {
      return new Position(position.x + 1, position.y);
    } else if (currentPosition.direction === 'T') {
      return new Position(position.x + 1, position.y - 1);
    } else {
      return new Position(position.x + 1, position.y + 1);
    }
  }
};

export default move;
