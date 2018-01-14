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

        this.addButton.onclick = () => {this.addLooper();}

        this.metronome = metronome;

        this.addLooper();
    }

    private addLooper(): void {
        if (this.loopers.length < MAX_LOOPERS ) {            
            var looper = new Looper(this.metronome);
            this.loopers.push(looper);
            looper.appendTo(this.loopersElem);
            this.selectedLooperIndex = this.loopers.length-1;
        }
    }

    public onInput(event: InputEvent): boolean {
        if (event == InputEvent.TRIGGER && this.selectedLooperIndex != null) {
            this.loopers[this.selectedLooperIndex].trigger();
        }
        return false;
    }

}