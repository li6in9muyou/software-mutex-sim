export const sleep = async (duration = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

export const Yield = () => sleep(1);

export const Idle = async (duration = 2) => {
  for (let i = 0; i < 0.23 * duration * 1e3; i++) {
    for (let j = 0; j < 1e3; j++) {}
    await Yield();
  }
};

export class Clock {
  start: number;
  end: number;
  tick() {
    this.start = window.performance.now();
  }
  tock(): Clock {
    this.end = window.performance.now();
    return this;
  }
  report(): number {
    return this.end - this.start;
  }
}
