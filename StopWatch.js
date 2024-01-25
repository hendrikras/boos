export default class {
  constructor() {
    this.startTime = null;
  }

  // Stop a timer and return the time difference in milliseconds
  stopTimer() {
    const endTime = new Date();
    const timeDiff = endTime - this.startTime;
    return timeDiff;
  }
}