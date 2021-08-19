class ClockService {

    private timeElapsed: number = 0;
    private tickRateMs: number = 1500;
    private onTick: (timeElapsed: number) => void = (timeElapsed) => { };

    public start({ onTick }: { onTick: (timeElapsed: number) => void }) {
        console.log("Clock is starting");
        this.onTick = onTick;

        setInterval(() => {
            this.tick()
        }, this.tickRateMs)
    }

    public setTickRate(tickRateMs: number) {
        this.tickRateMs = tickRateMs;
    }

    private tick() {
        this.timeElapsed += 1;
        this.onTick(1);
    }
}

export const clockService = new ClockService();