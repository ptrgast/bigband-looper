import Component from "./../../shared/component";
import Clock from "./clock";
import { ClockListener } from "./clock-listener";

const DEFAULT_TEMPO = 60;
const DEFAULT_BEATS = 4;

export default class Metronome extends Component implements ClockListener {

    private clock = null;
    private currentBeat: number = 1;    
    private listeners: MetronomeListener[] = [];
    private indicatorOffOffset = 100;
    private recordOffset = -50;
    private playbackOffset = -220;

    private tempoElem;
    private tempoIncreaseButton;
    private tempoDecreaseButton;
    private beatsElem;
    private beatsIncreaseButton;
    private beatsDecreaseButton;
    private indicatorElem;

    public constructor(public tempo: number = DEFAULT_TEMPO, public totalBeats: number = DEFAULT_BEATS) {
        super("div", "metronome");
        this.setContent(`
            <div class="row">
                <div class='tempo col-xs-6'>
                    <button class='btn-tempo-dec'>-</button>
                    <button class='btn-tempo-inc'>+</button>
                    <span class='tempo-value'>--</span> <small>BPM</small>
                </div>            
                <div class='col-xs-6 text-right'>
                    <div>
                        <span class='indicator'>1<span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class='tempo col-xs-6'>
                    <button class='btn-beats-dec'>-</button>
                    <button class='btn-beats-inc'>+</button>
                    <span class='beats-value'>-</span> <small>BEATS in bar</small>
                </div>            
                <div class='col-xs-6 text-right'>
                    <button class="secondary">TAP TEMPO</button>
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
        
        this.tempoDecreaseButton.onclick = (): void => {
            this.setTempo(this.tempo-5);
        }
        this.tempoIncreaseButton.onclick = (): void => {
            this.setTempo(this.tempo+5);
        }     
        
        this.beatsDecreaseButton.onclick = (): void => {
            this.setBeatsInBar(this.totalBeats - 1);
        }
        this.beatsIncreaseButton.onclick = (): void => {
            this.setBeatsInBar(this.totalBeats + 1);
        }  
        
        this.clock = new Clock();
        this.clock.addListener(this);
        this.clock.addListener(this, this.indicatorOffOffset);
        this.clock.addListener(this, this.recordOffset);
        this.clock.addListener(this, this.playbackOffset);
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

    public onTick(offset: number):void {
        if (offset == 0) {
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
        } else if (offset == this.indicatorOffOffset) {
            this.indicatorElem.className = "indicator";
        }

        if (offset == this.recordOffset) {            
            // notify listeners
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].onRecordTick(this.currentBeat, this.totalBeats);
            }
        }

        if (offset == this.playbackOffset) {
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