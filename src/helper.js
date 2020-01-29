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
      rowArr.push(0);
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
    goldGrid[j][column - 1] = mine[j][column - 1];
  }
}

/**
 * Calculate and returns the max value, starting row and the grid
 * @param {Number[]} goldGrid 
 */
const findMax = (goldGrid) => {
  let max = goldGrid[0][0];
  let row;
  for (let i = 0; i < goldGrid.length; i++) {
    if (goldGrid[i][0] > max) {
      max = goldGrid[i][0];
      row = i;
    }
  }
  return { max, row, goldGrid };
}


const dp = (column, row, mine, goldGrid) => {
  for (let i = column - 1; i >= 0; i--) {
    for (let j = 0; j < row; j++) {
      // Going right
      let right = (i === column - 1) ? 0 : goldGrid[j][i + 1];
      // Going top right
      let topRight = (j === 0 || i === column - 1) ? 0 : goldGrid[j - 1][i + 1];
      // Going down right
      let downRight = (j === row - 1 || i === column - 1) ? 0 : goldGrid[j + 1][i + 1];
      // Take the max of those 3 directions; if the current location is 0, then result is 0 
      // (we exit game when we see 0, so by setting the value 0, we can avoid going into spots like this)
      goldGrid[j][i] = mine[j][i] === 0 ? 0 : mine[j][i] + Math.max(right, topRight, downRight);
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

  // Initialize value map
  const goldGrid = initializeGrid(row, column);
  populateLastColumn(goldGrid, mine);

  // Populate value map
  dp(column, row, mine, goldGrid);

  // Find max and return
  const max = findMax(goldGrid);
  return max;
}

export default {
  populateSteps
}
