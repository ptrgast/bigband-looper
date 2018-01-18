import InputSource from "../input-source";
import InputListener from "../input-listener";
import { InputEvent } from "../input-events";

export default class KeyboardInput extends InputSource {

    public constructor() {
        super();
        window.onkeydown = (event: KeyboardEvent) => {this.onKeyDown(event);}
        window.onkeyup = (event: KeyboardEvent) => {this.onKeyUp(event);}
    }

    public getName(): string {
        return "Keyboard";
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == 32) {
            this.feed(InputEvent.TRIGGER, true);
        }
    }

    public onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode == 32) {
            this.feed(InputEvent.TRIGGER, false);
        }
    }

}