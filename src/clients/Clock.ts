export type OnTickCallback = (timeElapsed: number) => void;


export class ClockClient {

    private timeElapsed: number | undefined;
    private tickRateMs: number = 1500;
    private onTickCallbacks: OnTickCallback[] = [];

    public constructor(tickRateMs: number = 1500) {
        this.tickRateMs = tickRateMs;
    }

    public start() {
        this.tick();

        setInterval(() => {
            this.tick()
        }, this.tickRateMs)
    }

    public addOnTickCallback(onTickCallback: OnTickCallback) {
        this.onTickCallbacks.push(onTickCallback);
    }

    public setTickRate(tickRateMs: number) {
        this.tickRateMs = tickRateMs;
    }

    private tick() {
        if (this.timeElapsed === undefined) {
            this.timeElapsed = 0;
        } else {
            this.timeElapsed += 1;
        }

        this.onTickCallbacks.forEach((callback) => {
            callback(this.timeElapsed!);
        })
    }

    public getTimeElapsed(): number {
        if (this.timeElapsed === undefined) {
            throw new Error("The clock hasn't started yet, cannot get time elapsed")
        }
        return this.timeElapsed;
    }

    public getTickRateMs(): number {
        return this.tickRateMs;
    }
}

export const clockClient = new ClockClient();