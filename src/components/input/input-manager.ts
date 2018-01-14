import InputSource from "./input-source";
import InputListener from "./input-listener";
import { InputEvent } from "./input-events";

export default class InputManager implements InputListener {
    
    private sources: InputSource[] = [];
    private listeners: InputListener[] = [];

    public constructor() {

    }

    public addSource(source: InputSource) {
        source.setListener(this);
        this.sources.push(source);
    }

    public addListener(listener: InputListener) {
        this.listeners.push(listener);
    }

    public onInput(event: InputEvent) {
        for (var i=0; i<this.listeners.length; i++) {
            var consumed = this.listeners[i].onInput(event);
            if (consumed == true) {
                // end event propagation
                break;
            }
        }
        return false;
    }

}