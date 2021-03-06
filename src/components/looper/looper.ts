import recorder from "./recorder";
import Component from "./../component";
import Metronome from "./../metronome/metronome";
import {MetronomeListener} from "./../metronome/metronome";

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
    private trackInfoElem;
    private triggerButton;
    private clearButton;

    public constructor(private metronome: Metronome) {
        super("div", "looper component col-xs-6 col-sm-3");
        this.id = ++Looper.trackCounter;        
        
        this.setContent(`
            <div class="clearfix">
                <span class='title'>Track ${this.id}</span>
                <span class='pull-right'>                    
                    <span class='status'></span>
                </span>
            </div>
            <div class='text-center'>
                <button class='btn-trigger'>Rec</button>
            </div>
            <div class='text-center'>
                <button class='secondary small btn-clear'>Clear</button>
            </div>
            <div class='track-info'></div>
        `);
        this.statusElement = this.getByClass("status");
        this.trackInfoElem = this.getByClass("track-info");
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

    public focus(focus: boolean = true): void {
        var root = this.getRoot();
        if (focus) {
            root.classList.add('focused');
        } else {
            root.classList.remove('focused');
        }
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
                this.triggerButton.innerHTML = "Rec";
                break;
            case Status.RECORDING:
                this.syncToPlay();
                break;
            case Status.PLAYING:
                this.stop();
                break;
            case Status.STOPPED:
                this.syncToPlay();
                break;
        }

    }

    public clear(): void {
        this.status = Status.IDLE;
        if (this.track != null) {
            this.track.stop();
            this.track = null;
        } else {
            recorder.stop();            
        }
        this.statusElement.innerHTML = "";
        this.statusElement.className = "status";
        this.triggerButton.innerHTML = "Rec";
        this.triggerButton.className = "btn-trigger";
    }

    public hasTrack(): boolean {
        if (this.status == Status.SYNC_TO_PLAY || this.status == Status.PLAYING || this.status == Status.STOPPED) {
            return true;
        }
        return false;
    }

    public onRecordTick(beat: number, total: number): void {
        if (this.status == Status.SYNC_TO_RECORD && beat==1) {
            this.record();
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
            this.trackInfoElem.innerHTML = this.track.beat+"/"+this.track.total;
        }
    }

    private syncToRecord(): void {
        this.status = Status.SYNC_TO_RECORD;
        this.statusElement.innerHTML = "Get ready";
        this.triggerButton.className = "btn-trigger wait";
    }

    private record(): void {
        this.recordLength = 0;
        if (recorder.record()) {
            this.status = Status.RECORDING;
            this.statusElement.innerHTML = "&bull; Recording";
            this.statusElement.className = "status recording";
            this.triggerButton.innerHTML = "Play";
            this.triggerButton.className = "btn-trigger recording";
        } else {
            this.status = Status.IDLE;
            this.statusElement.innerHTML = "";
            this.statusElement.className = "status";
            this.triggerButton.innerHTML = "Rec";
            this.triggerButton.className = "btn-trigger recording";
        }
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