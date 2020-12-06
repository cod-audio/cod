import Timer from "./Timer";

class AudioPlayer {

    private audioBuffer?: AudioBuffer;
    private audioSource?: AudioBufferSourceNode;
    private context: AudioContext;
    private loaded: boolean = false;
    private timer: Timer;

    constructor() {
        this.context = new window.AudioContext();
        this.timer = new Timer();
    }

    load(audioBuffer: AudioBuffer) {
        this.audioBuffer = audioBuffer;
        this.loaded = true;
    }

    play() {
        if (this.audioBuffer) {
            this.createAudioSource();
            this.timer.start();
            this.audioSource.start(0, this.timer.getElapsed() / 1000);
        }
    }

    pause() {
        if (this.audioBuffer) {
            this.timer.stop();
            this.audioSource.stop();
            this.audioSource = null;
            console.log(this.timer.getElapsed());
        }
    }

    getElapsed() {
        return this.timer.getElapsed();
    }

    getLoaded() {
        return this.loaded;
    }

    private createAudioSource() {
        const audioSource = this.context.createBufferSource();
        audioSource.buffer = this.audioBuffer;
        audioSource.connect(this.context.destination);
        this.audioSource = audioSource;
    }

}

export default AudioPlayer;
