class Timer {
    private elapsed: number = 0;
    private startTime?: number;

    public start() {
        if (!this.elapsed) {
            this.startTime = Date.now();
        }
    }

    public pause() {
        this.elapsed += Date.now() - this.startTime;
    }
    
    public reset() {
        this.elapsed = 0;
        this.startTime = null;
    }

    public getElapsed(): number {
        return this.elapsed;
    }

    // Used for manual scrubbing
    public setElapsed(elapsed: number) {
        this.elapsed = Math.round(elapsed);
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
