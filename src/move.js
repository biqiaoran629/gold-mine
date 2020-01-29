import _get from 'lodash/get';

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
  console.log(dp);
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

  if (position) {

    const right = _get(dp, [position.y, position.x + 1]);
    const topRight = _get(dp, [position.y - 1, position.x + 1]);
    const downRight = _get(dp, [position.y + 1, position.x + 1]);

    const allowedDirections = [];

    if (right && position.previousDirection !== 'r') allowedDirections.push(right);
    if (topRight && position.previousDirection !== 't') allowedDirections.push(topRight);
    if (downRight && position.previousDirection !== 'd') allowedDirections.push(downRight);

    const max = Math.max(...allowedDirections);

    let returnPosition;

    if (max === right) {
      returnPosition = new Position(position.x + 1, position.y);
      returnPosition.previousDirection = 'r';
    } else if (max === topRight) {
      returnPosition = new Position(position.x + 1, position.y - 1);
      returnPosition.previousDirection = 't';
    } else {
      returnPosition = new Position(position.x + 1, position.y + 1);
      returnPosition.previousDirection = 'd'
    }

    return returnPosition;

    // if (position.y === 0) {
    //   // Position near top, only 2 choices
    //   largest = Math.max(dp[position.y][position.x + 1], dp[position.y + 1][position.x + 1]);
    //   if (largest === dp[position.y][position.x + 1]) {
    //     return new Position(position.x + 1, position.y);
    //   } else {
    //     return new Position(position.x + 1, position.y + 1);
    //   }
    // } else if (position.y === dp.length - 1) {
    //   // Position near bottom, only 2 choices
    //   largest = Math.max(dp[position.y][position.x + 1], dp[position.y - 1][position.x + 1]);
    //   if (largest === dp[position.y][position.x + 1]) {
    //     return new Position(position.x + 1, position.y);
    //   } else {
    //     return new Position(position.x + 1, position.y - 1);
    //   }
    // } else {
    //   // Normal cases, 3 choices
    //   largest = Math.max(dp[position.y][position.x + 1], dp[position.y + 1][position.x + 1], dp[position.y - 1][position.x + 1]);
    //   switch (largest) {
    //     case dp[position.y][position.x + 1]:
    //       return new Position(position.x + 1, position.y);
    //     case dp[position.y + 1][position.x + 1]:
    //       return new Position(position.x + 1, position.y + 1);
    //     case dp[position.y - 1][position.x + 1]:
    //       return new Position(position.x + 1, position.y - 1);
    //   }
    // }

  } else {
    // Initial condition, find the maximum possible result to start with
    let row = findStartingPosition(mine);
    return new Position(0, row);
  }
};

export default move;