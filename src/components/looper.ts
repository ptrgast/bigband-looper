import recorder from "./../recorder";
import Component from "./../shared/component";
import Metronome from "./metronome";
import {MetronomeListener} from "./metronome";

enum Status {
    IDLE,
    SYNC_TO_RECORD,
    RECORDING,
    SYNC_TO_PLAY,
    PLAYING,
    STOPPED
};

export default class Looper extends Component implements MetronomeListener {
    
    static trackCounter = 0;

    public id: Number;
    public name: String = "Test";

    private status: Status = Status.IDLE;
    private track;
    private recordLength;
    private statusElement;
    private triggerButton;
    private clearButton;

    public constructor(private metronome: Metronome) {
        super("div", "looper col-xs-6 col-sm-3");
        this.id = ++Looper.trackCounter;        
        
        this.setContent(`
            <div class="clearfix">
                <span class='title'>Track ${this.id}</span>
                <span class='pull-right'><span class='status'></span></span>
            </div>
            <div class='text-center'>
                <button class='btn-trigger'>Record</button>
            </div>
            <div class='text-center'>
                <button class='secondary small btn-clear'>Clear</button>
            </div>
        `);
        this.statusElement = this.getByClass("status");
        this.triggerButton = this.getByClass("btn-trigger");
        this.triggerButton.onclick = () => {this.trigger();};
        this.clearButton = this.getByClass("btn-clear");
        this.clearButton.onclick = () => {this.clear();};
 
        if (typeof this.metronome == "undefined" || this.metronome == null) {
            throw new Error("Tracks must be initialized with a metronome!");
        }
        // feel the beat
        metronome.addListener(this);
    }

    public trigger(): void {
        this.statusElement.className = "status";
        this.triggerButton.className = "btn-trigger";

        switch (this.status) {
            case Status.IDLE:
                this.syncToRecord();
                break;
            case Status.SYNC_TO_RECORD:
                this.status = Status.IDLE;
                this.statusElement.innerHTML = "";
                this.triggerButton.innerHTML = "Record";
                break;
            case Status.RECORDING:
                this.syncToPlay();
                break;
            case Status.PLAYING:
                this.stop();
                break;
            case Status.STOPPED:
                this.status = Status.SYNC_TO_PLAY;
                this.statusElement.innerHTML = "Wait";
                this.triggerButton.innerHTML = "Stop";
                this.triggerButton.className = "btn-trigger wait";
                break;
        }

    }

    public clear(): void {
        this.status == Status.IDLE;
        if (this.track != null) {
            this.track.stop();
            this.track = null;
        } else {
            recorder.stop();            
        }
        this.statusElement.innerHTML = "";
        this.statusElement.className = "status";
        this.triggerButton.innerHTML = "Record";
        this.triggerButton.className = "btn-trigger";
    }

    public onRecordTick(beat: number, total: number): void {
        if (this.status == Status.SYNC_TO_RECORD && beat==1) {
            this.recordLength = 0;
            recorder.record();
            this.status = Status.RECORDING;            
            this.statusElement.innerHTML = "&bull; Recording";
            this.statusElement.className = "status recording";
            this.triggerButton.innerHTML = "Play";
            this.triggerButton.className = "btn-trigger recording";
        } 

        if (this.status == Status.RECORDING) {
            // this.statusElement.innerHTML = beat;
        }
        
        if (this.status == Status.RECORDING || this.status == Status.SYNC_TO_PLAY) {
            this.recordLength++;
        }

        // console.log(`looper ${this.id}: `+beat+"/"+total);
    }

    public onPlaybackTick(beat: number, total: number): void {
        if (this.status == Status.SYNC_TO_PLAY && beat == 1) {
            if (this.track == null) {
                this.track = recorder.stop();
                this.track.total = this.recordLength;
            }
            this.track.beat = 0;
            this.track.play();
            this.status = Status.PLAYING;
            this.statusElement.innerHTML = "Playing";
            this.statusElement.className = "status playing";
            this.triggerButton.innerHTML = "Stop";
            this.triggerButton.className = "btn-trigger playing";
        }

        if (this.status == Status.PLAYING) {
            this.track.beat++;
            if (this.track.beat > this.track.total) {
                this.track.beat = 1;
                this.track.play();
            }
        }
    }

    private syncToRecord(): void {
        this.status = Status.SYNC_TO_RECORD;
        this.statusElement.innerHTML = "Get ready";
        this.triggerButton.className = "btn-trigger wait";
    }

    private syncToPlay(): void {
        this.status = Status.SYNC_TO_PLAY;
        this.statusElement.innerHTML = "Wait";
        this.triggerButton.innerHTML = "Play";
        this.triggerButton.className = "btn-trigger wait";        
    }

    private stop(): void {
        if (this.track != null) {
            this.track.stop();
        }
        this.status = Status.STOPPED;
        this.statusElement.innerHTML = "";
        this.triggerButton.innerHTML = "Play";
    }

};