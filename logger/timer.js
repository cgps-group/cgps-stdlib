function now() {
  return (new Date()).valueOf();
}

class Timer {
  constructor(timerInSeconds) {
    this.timerInSeconds = timerInSeconds;
    this.startTime = now();
  }

  getStartTime() {
    return this.startTime;
  }

  timedOut() {
    return !(this.startTime + (this.timerInSeconds * 1000) > now());
  }

  continue() {
    return (this.startTime + (this.timerInSeconds * 1000) > now());
  }

  runTimeInSeconds() {
    return (now() - this.startTime) / 1000;
  }
}

export default Timer;
