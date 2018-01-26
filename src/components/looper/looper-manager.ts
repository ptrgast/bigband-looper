import Component from "../component";
import Looper from "./looper";
import InputListener from "../input/input-listener";
import { InputEvent } from "../input/input-events";
import Metronome from "../metronome/metronome";

const MAX_LOOPERS = 12;

export default class LooperManager extends Component implements InputListener {

    private metronome: Metronome;
    private loopers: Looper[] = [];
    private selectedLooperIndex = null;

    private loopersElem;
    private addButton;

    public constructor(metronome: Metronome) {
        super('div', 'looper-manager col-md-12');
        
        this.setContent(`
            <div class='loopers row'></div>
            <div class='row'>
                <button class='btn-looper-add secondary small btn-block'>+ Add Track</button>
            </div>
        `);
        this.loopersElem = this.getByClass('loopers');
        this.addButton = this.getByClass('btn-looper-add');

        this.addButton.onclick = () => {this.pushLooper();}

        this.metronome = metronome;

        this.pushLooper();
    }

    private pushLooper(): void {
        if (this.loopers.length < MAX_LOOPERS ) {  
            this.unfocusAll();          
            var looper = new Looper(this.metronome);
            looper.focus();
            this.loopers.push(looper);
            looper.appendTo(this.loopersElem);
            this.selectedLooperIndex = this.loopers.length-1;
        }
    }

    private popLooper(): void {
        if (this.loopers.length>1) {
            var popped = this.loopers.pop();
            popped.clear();
            this.loopersElem.removeChild(popped.getRoot());
            this.unfocusAll();     
            this.selectedLooperIndex = this.loopers.length-1;
            this.loopers[this.selectedLooperIndex].focus(true);
        }
    }

    private unfocusAll(): void {
        for (var i=0; i<this.loopers.length; i++) {
            this.loopers[i].focus(false);
        }
    }

    public onInput(event: InputEvent): boolean {
        if (this.selectedLooperIndex != null) {
            if (event == InputEvent.TRIGGER) {
                this.loopers[this.selectedLooperIndex].trigger();
            } else if (event == InputEvent.CLEAR) {
                if (this.loopers[this.selectedLooperIndex].hasTrack()) {
                    this.loopers[this.selectedLooperIndex].clear();
                } else {
                    this.popLooper();
                }
            } else if (event == InputEvent.PUSH_TRACK) {
                this.pushLooper();
            }
        }

        return false;
    }

}