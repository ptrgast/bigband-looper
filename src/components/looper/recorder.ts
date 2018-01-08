import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

enum Status {
    UNAUTHORIZED,
    READY,
    RECORDING
}

class Recorder {

    static input = new p5.AudioIn();

    private status = Status.UNAUTHORIZED;
    private soundRecorder = null;
    private track = null;

    public constructor() {

    }
    
    public requestAudioInput() {
        // Request audio input from user
        Recorder.input.start(
            ()=>{
                // Success
                this.status = Status.READY;
                this.soundRecorder = new p5.SoundRecorder();
                this.soundRecorder.setInput(Recorder.input);
            }
        );
    }

    public record() {
        if (this.status == Status.READY) {
            this.status = Status.RECORDING;
            this.track = new p5.SoundFile();
            this.soundRecorder.record(this.track);
            return true;
        } else {
            return false;
        }
    }

    public stop() {
        if (this.status == Status.RECORDING) {
            this.soundRecorder.stop();
            this.status = Status.READY;
            var currentTrack = this.track;
            return this.track;        
        } else {
            return false;
        }
    }

}

export default new Recorder();