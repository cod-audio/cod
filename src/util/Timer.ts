class Timer {
    private callback?: (time: number) => void;
    private elapsed: number = 0;
    private interval: number;
    private stepSize: number = 1;

    constructor(updateCallback?: (time: number) => void) {
        this.callback = updateCallback;
    }

    getElapsed(): number {
        return this.elapsed;
    }

    start() {
        this.interval = window.setInterval(
            this.step.bind(this), // Yes, the binding is required
            this.stepSize
        );
    }

    stop() {
        window.clearInterval(this.interval);
    }

    reset() {
        this.elapsed = 0;
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

    private step() {
        this.elapsed += this.stepSize;
        this.callback?.(this.elapsed);
    }
}

export default Timer;
