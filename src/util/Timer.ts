class Timer {
    private elapsed: number = 0;
    private startTime?: number;

    getElapsed(): number {
        return this.elapsed;
    }

    start() {
        this.startTime = Date.now();
    }

    stop() {
        this.elapsed = Date.now() - this.startTime;
        this.startTime = null;
    }

    reset() {
        this.elapsed = 0;
        this.startTime = null;
    }

    increment(timeInMs: number) {
        this.elapsed += timeInMs;
    }

    decrement(timeInMs: number) {
        this.elapsed -= timeInMs;
        if (this.elapsed < 0) {
            this.elapsed = 0;
        }
    }
}

export default Timer;
