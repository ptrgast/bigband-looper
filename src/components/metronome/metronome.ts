import Component from "./../component";
import Clock from "./clock";
import { ClockListener } from "./clock-listener";

const DEFAULT_TEMPO = 60;
const DEFAULT_BEATS = 4;
const DEFAULT_RECORD_OFFSET = -50;
const DEFAULT_PLAYBACK_OFFSET = -230;

export default class Metronome extends Component implements ClockListener {

    private clock = null;
    private currentBeat: number = 1;    
    private listeners: MetronomeListener[] = [];
    private indicatorOffOffset = 100;
    private recordOffset = 0;
    private playbackOffset = 0;

    private tempoElem;
    private tempoIncreaseButton;
    private tempoDecreaseButton;
    private beatsElem;
    private beatsIncreaseButton;
    private beatsDecreaseButton;
    private indicatorElem;
    private recordOffsetElem;
    private playbackOffsetElem;

    public constructor(public tempo: number = DEFAULT_TEMPO, public totalBeats: number = DEFAULT_BEATS) {
        super("div", "metronome component");
        this.setContent(`
            <div class="row">
                <div class='col-xs-6'>

                    <div class='tempo middle'>
                        <div class="btn-pair">
                            <button class='btn-tempo-dec'>-</button>
                            <button class='btn-tempo-inc'>+</button>
                        </div>
                        <span class='tempo-value'>--</span> 
                        <span class='lbl'>BPM</span>
                    </div>

                    <div class='beats middle'>
                        <div class='btn-pair'>
                            <button class='btn-beats-dec'>-</button>
                            <button class='btn-beats-inc'>+</button>
                        </div>
                        <span class='beats-value'>-</span> 
                        <span class='lbl'>BEATS <br> in bar</span>
                    </div>

                </div>            
                <div class='col-xs-4'>
                    <!--<button class="secondary small">TAP</button>-->
                    <div>
                        <span class='lbl'>CALIBRATION</span>
                    </div>
                    <div>
                        <span class='record-offset-value editable'>-</span>
                        <span class='lbl'>record <br> offset (ms)</span>
                    </div>
                    <div>
                        <span class='playback-offset-value editable'>-</span>
                        <span class='lbl'>playback <br> offset (ms)</span>
                    </div>
                </div>            
                <div class='col-xs-2 text-right'>
                    <div>
                        <span class='indicator'>1<span>
                    </div>
                </div>
            </div>
        `);

        this.tempoElem = this.getByClass('tempo-value');
        this.tempoDecreaseButton = this.getByClass('btn-tempo-dec');
        this.tempoIncreaseButton = this.getByClass('btn-tempo-inc');
        this.beatsElem = this.getByClass('beats-value');
        this.beatsDecreaseButton = this.getByClass('btn-beats-dec');
        this.beatsIncreaseButton = this.getByClass('btn-beats-inc');
        this.indicatorElem = this.getByClass('indicator');
        this.recordOffsetElem = this.getByClass('record-offset-value');
        this.playbackOffsetElem = this.getByClass('playback-offset-value');
        
        // tempo
        this.tempoDecreaseButton.onclick = (): void => {
            this.setTempo(this.tempo-5);
        }
        this.tempoIncreaseButton.onclick = (): void => {
            this.setTempo(this.tempo+5);
        }     
        
        // beats
        this.beatsDecreaseButton.onclick = (): void => {
            this.setBeatsInBar(this.totalBeats - 1);
        }
        this.beatsIncreaseButton.onclick = (): void => {
            this.setBeatsInBar(this.totalBeats + 1);
        }

        // offsets
        this.recordOffsetElem.onclick = (): void => {
            var value = prompt("Record offset (ms)", String(this.recordOffset));
            if (value != null) {
                this.setRecordOffset(Number(value));
            }
        }
        this.playbackOffsetElem.onclick = (): void => {
            var value = prompt("Playback offset (ms)", String(this.playbackOffset));
            if (value != null) {
                this.setPlaybackOffset(Number(value));
            }
        }

        this.clock = new Clock();
        this.clock.addListener(this, "metronome");
        this.clock.addListener(this, "indicator", this.indicatorOffOffset);
        this.setRecordOffset(DEFAULT_RECORD_OFFSET);
        this.setPlaybackOffset(DEFAULT_PLAYBACK_OFFSET);
        this.clock.start();

        this.setTempo(this.tempo);
        this.setBeatsInBar(this.totalBeats);
    }

    public setTempo(tempo: number) {
        if (tempo<20) {
            tempo = 20;
        } else if (tempo>300) {
            tempo = 300;
        }
        this.tempo = tempo;
        this.tempoElem.innerHTML = tempo;
        this.clock.setInterval(this.calculateInterval());
    }

    public setBeatsInBar(total: number) {
        if (total<1) {
            total = 1;
        }
        this.totalBeats = total;
        this.beatsElem.innerHTML = this.totalBeats;
    }

    public setRecordOffset(offset: number): void {
        if (isNaN(offset)) { offset = 0; }
        if (offset > 1500) { offset = 1500; }
        else if (offset < -1500) { offset = -1500; }
        this.recordOffset = offset;
        this.recordOffsetElem.innerHTML = offset;
        this.clock.setListener(this, "record", this.recordOffset);
    }

    public setPlaybackOffset(offset: number): void {
        if (isNaN(offset)) { offset = 0; }
        if (offset > 1500) { offset = 1500; }
        else if (offset < -1500) { offset = -1500; }
        this.playbackOffset = offset;
        this.playbackOffsetElem.innerHTML = offset;
        this.clock.setListener(this, "playback", this.playbackOffset);
    }

    public addListener(listener: MetronomeListener) {
        if (listener != null) {
            for (var i=0; i<this.listeners.length; i++) {
                if (this.listeners[i] == listener) {
                    // listener already added
                    return;
                }
            }
            this.listeners.push(listener);
        }
    }

    private calculateInterval() {
        return ((60/this.tempo)*1000); // msec
    }

    public onTick(name: string, offset: number):void {
        if (name === "metronome") {
            if (this.currentBeat == 1) {
                this.indicatorElem.className = "indicator start";
            } else if (this.currentBeat % 1 == 0) {
                this.indicatorElem.className = "indicator beat";
            }
            this.indicatorElem.innerHTML = this.currentBeat;

            this.currentBeat ++;
            if (this.currentBeat > this.totalBeats + 0.5) {
                this.currentBeat = 1;
            }
        } 
        
        if (name == "indicator") {
            this.indicatorElem.className = "indicator";
        }

        if (name == "record") {            
            // notify listeners
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].onRecordTick(this.currentBeat, this.totalBeats);
            }
        }

        if (name == "playback") {
            // notify listeners
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].onPlaybackTick(this.currentBeat, this.totalBeats);
            }
        }
    }

}

export interface MetronomeListener {

    onRecordTick: (beat:number, total:number) => void;
    onPlaybackTick: (beat:number, total:number) => void;

}