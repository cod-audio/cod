import Timer from "./Timer";

class AudioPlayer {

    private audioBuffer?: AudioBuffer;
    private audioSource?: AudioBufferSourceNode;
    private context: AudioContext;
    private isLoaded: boolean = false;
    private isPlaying: boolean = false;
    private timer: Timer;

    constructor() {
        this.context = new window.AudioContext();
        this.timer = new Timer();
    }

    load(audioBuffer: AudioBuffer) {
        this.audioBuffer = audioBuffer;
        this.isLoaded = true;
    }

    play() {
        if (this.audioBuffer) {
            this.createAudioSource();
            this.timer.start();
            this.audioSource.start(0, this.timer.getElapsed() / 1000);
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.audioBuffer) {
            this.timer.stop();
            this.audioSource.stop();
            this.audioSource = null;
            console.log(this.timer.getElapsed());
            this.isPlaying = false;
        }
    }

    getElapsed(): number {
        return this.timer.getElapsed();
    }

    getIsLoaded(): boolean {
        return this.isLoaded;
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    private createAudioSource() {
        const audioSource = this.context.createBufferSource();
        audioSource.buffer = this.audioBuffer;
        audioSource.connect(this.context.destination);
        this.audioSource = audioSource;
    }

}

export default AudioPlayer;
