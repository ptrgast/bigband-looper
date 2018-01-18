import InputSource from "../input-source";
import InputListener from "../input-listener";
import { InputEvent } from "../input-events";

export default class MidiInput extends InputSource {

    private midi;

    public constructor() {
        super();

        var nav = navigator as any;

        // Check that the MIDI API exists
        if (nav.requestMIDIAccess) {
            // Try to get access
            nav.requestMIDIAccess().then(
                (midi: any)=>{this.listen(midi);},
                ()=>{console.warn("Request to MIDI devices failed!");}
            )
        } else {
            console.warn("MIDI API is not supported by this browser!");
        }
    }

    private listen(midi: any): void {
        var inputs = midi.inputs.values();

        // Listen from all available devices
        for (var i = 0; i < midi.inputs.size; i++) {
            var input = inputs.next().value;
            input.onmidimessage = (message) => {this.onMidiInput(message);}
            console.log("Listening from "+input.name+"...");
        }
    }

    public getName(): string {
        return "Keyboard";
    }

    public onMidiInput(message: any): void {
        console.log(message.data);
        if (this.isMessage(message, 176, 64)) {
            if (this.getValue(message) > 0) {
                this.feed(InputEvent.TRIGGER, true);
            } else {
                this.feed(InputEvent.TRIGGER, false);                
            }
        }
    }
    
    private isMessage(message: any, status: number, data1: number) {
        var data = message.data;
        
        if (data.length == 3 && data[0] == status && data[1] == data1) {
            return true;
        }

        return false;
    }

    private getValue(message: any) {
        var data = message.data;

        if (data.length == 3) {
            return data[2];
        }

        return null;
    }

}