class Timer {
    private elapsed: number = 0;
    private startTime?: number;

    public getElapsed(): number {
        return this.elapsed;
    }

    public start() {
        this.startTime = Date.now();
    }

    public stop() {
        this.elapsed = Date.now() - this.startTime;
        this.startTime = null;
    }

    public reset() {
        this.elapsed = 0;
        this.startTime = null;
    }

    public increment(timeInMs: number) {
        this.elapsed += timeInMs;
    }

    public decrement(timeInMs: number) {
        this.elapsed -= timeInMs;
        if (this.elapsed < 0) {
            this.elapsed = 0;
        }
    }
}

export default Timer;
