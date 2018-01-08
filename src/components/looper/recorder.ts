import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

class Recorder {

    static input = new p5.AudioIn();

    private soundRecorder = null;
    private track = null;

    public constructor() {
        // Request audio input from user
        Recorder.input.start();
        
        this.soundRecorder = new p5.SoundRecorder();
        this.soundRecorder.setInput(Recorder.input);

        console.log("Recorder ready");
    }

    public record() {
        if (this.track == null) {
            console.log("Recording...");        
            this.track = new p5.SoundFile();
            this.soundRecorder.record(this.track);
        }
    }

    public stop() {
        this.soundRecorder.stop();
        var currentTrack = this.track;
        this.track = null;
        return currentTrack;        
    }

}

export default new Recorder();