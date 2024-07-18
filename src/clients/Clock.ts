export type OnTickCallback = (timeElapsed: number) => Promise<void>;

export class ClockClient {
  private timeElapsed: number | undefined;
  private tickRateMs: number = 1500;
  private onTickCallbacks: OnTickCallback[] = [];

  public constructor(tickRateMs: number = 1500) {
    this.tickRateMs = tickRateMs;
  }

  public async start() {
    await this.tick();

    setInterval(async () => {
      await this.tick();
    }, this.tickRateMs);
  }

  public addOnTickCallback(onTickCallback: OnTickCallback) {
    this.onTickCallbacks.push(onTickCallback);
  }

  public setTickRate(tickRateMs: number) {
    this.tickRateMs = tickRateMs;
  }

  private async tick() {
    if (this.timeElapsed === undefined) {
      this.timeElapsed = 0;
    } else {
      this.timeElapsed += 1;
    }

    for (let i = 0; i < this.onTickCallbacks.length; i++) {
      let callback = this.onTickCallbacks[i];
      await callback(this.timeElapsed!);
    }
  }

  public getTimeElapsed(): number {
    if (this.timeElapsed === undefined) {
      throw new Error("The clock hasn't started yet, cannot get time elapsed");
    }
    return this.timeElapsed;
  }

  public getTickRateMs(): number {
    return this.tickRateMs;
  }
}

