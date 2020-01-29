import Step from "./step.js";

/**
 * Initializes a 2D array with 0s with row number and column number
 * 
 * @param {Number} row 
 * @param {Number} column 
 */
const initializeGrid = (row, column) => {
  const goldGrid = [];
  for (let j = 0; j < row; j++) {
    const rowArr = [];
    for (let i = 0; i < column; i++) {
      rowArr.push(new Step(0));
    }
    goldGrid.push(rowArr);
  }

  return goldGrid;
}

/**
 * populate the last column of the goldGrid
 * Creates the goldGrid of Steps
 * @param {Integer[]} goldGrid 
 * @param {Object[]} mine 
 */
const populateLastColumn = (goldGrid, mine) => {
  const row = mine.length;
  const column = mine[0].length;
  for (let j = 0; j < row; j++) {
    goldGrid[j][column - 1].value = mine[j][column - 1];
  }
}

/**
 * Calculate and returns the max value, starting row and the grid
 * @param {Number[]} goldGrid 
 */
const findMax = (goldGrid) => {
  let max = goldGrid[0][0].value;
  let row;
  for (let i = 0; i < goldGrid.length; i++) {
    if (goldGrid[i][0].value > max) {
      max = goldGrid[i][0].value;
      row = i;
    }
  }
  return { max, row, goldGrid };
}


const dp = (column, row, mine, goldGrid) => {
  for (let i = column - 3; i >= 0; i--) {
    for (let j = 0; j < row; j++) {
      // Going right
      let right = (i === column - 1 || goldGrid[j][i + 1].direction === 'R') ? 0 : goldGrid[j][i + 1].value;
      // Going top right
      let topRight = (j === 0 || i === column - 1 || goldGrid[j - 1][i + 1].direction === 'T') ? 0 : goldGrid[j - 1][i + 1].value;
      // Going down right
      let downRight = (j === row - 1 || i === column - 1 || goldGrid[j + 1][i + 1].direction === 'D') ? 0 : goldGrid[j + 1][i + 1].value;
      // Take the max of those 3 directions; if the current location is 0, then result is 0 
      // (we exit game when we see 0, so by setting the value 0, we can avoid going into spots like this)
      goldGrid[j][i].value = mine[j][i] === 0 ? 0 : mine[j][i] + Math.max(right, topRight, downRight);
      if (i != column - 1) {
        if (goldGrid[j][i].value === mine[j][i] + right) {
          goldGrid[j][i].direction = 'R';
        }
        else if (goldGrid[j][i].value === mine[j][i] + topRight) {
          goldGrid[j][i].direction = 'T';
        }
        else {
          goldGrid[j][i].direction = 'D';
        }
      }
    }
  }
}

/**
 * Populates the maximum possible mine map using dp
 * Idea is for every point, find the possible maximum value by comparing each one of 3 moves, and record largest
 * 
 * i.e. 1 3 5                11 10 5
 *      3 0 7  will result   14 0 7
 *      2 4 3                13 11 3
 * 
 * @param {Number[][]} mine 
 * 
 * @return {Number[][]} maximum value table
 */
const populateSteps = (mine) => {
  // Maybe we don't have to validate... Just for safety
  const row = mine.length ? mine.length : -1;
  const column = mine[0].length ? mine[0].length : -1;

  console.log(row);
  console.log(column);

  if (column < 3) {
    const goldGrid = initializeGrid(row, column);
    dp(column, row, mine, goldGrid);
    return findMax(goldGrid);
  }

  const goldGridRight = initializeGrid(row, column);
  const goldGridTopRight = initializeGrid(row, column);
  const goldGridDownRight = initializeGrid(row, column);

  populateLastColumn(goldGridRight, mine);
  populateLastColumn(goldGridTopRight, mine);
  populateLastColumn(goldGridDownRight, mine);

  // right Grid
  for (let j = 0; j < row; j++) {
    goldGridRight[j][column - 2].value = mine[j][column - 2] === 0 ? 0 : mine[j][column - 2] + goldGridRight[j][column - 1].value;
    goldGridRight[j][column - 2].direction = 'R'
  }

  // top right Grid
  for (let j = 0; j < row; j++) {
    let topRight = j === 0 ? 0 : goldGridTopRight[j - 1][column - 1].value;
    goldGridTopRight[j][column - 2].value = mine[j][column - 2] === 0 ? 0 : mine[j][column - 2] + topRight;
    goldGridTopRight[j][column - 2].direction = 'T'
  }

  // down right grid
  for (let j = 0; j < row; j++) {
    let downRight = j === row - 1 ? 0 : goldGridDownRight[j + 1][column - 1].value;
    goldGridDownRight[j][column - 2].value = mine[j][column - 2] === 0 ? 0 : mine[j][column - 2] + downRight;
    goldGridTopRight[j][column - 2].direction = 'D'
  }

  dp(column, row, mine, goldGridRight);
  dp(column, row, mine, goldGridTopRight);
  dp(column, row, mine, goldGridDownRight);

  const rightMax = findMax(goldGridRight);
  const topRightMax = findMax(goldGridTopRight);
  const downRightMax = findMax(goldGridDownRight);

  console.log(`max: ${rightMax.max}, row: ${rightMax.row}`);
  console.log(`max: ${topRightMax.max}, row: ${topRightMax.row}`);
  console.log(`max: ${downRightMax.max}, row: ${downRightMax.row}`);

  const max = [rightMax, topRightMax, downRightMax].reduce((max, current) => max.max > current.max ? max : current, rightMax);
  console.log(`max returned: ${max.max}`);
  return max;
}

export default {
  populateSteps
}
