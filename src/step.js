/**
 * Represents the miner's step on the dp lookup map
 */
class Step {
  /**
   * Initializes a new step.
   *
   * @param  {Number} value - The value of this step.
   * @param  {Character} direction - The direction of next step.
   *
   * @return {Object} The newly initialized step.
   */
  constructor(value, direction) {
    this.value = value;
    this.direction = direction;
  }


}

export default Step;
