import InputSource from "../input-source";
import InputListener from "../input-listener";
import { InputEvent } from "../input-events";

export default class KeyboardInput extends InputSource {

    public constructor() {
        super();
        window.onkeydown = (event: KeyboardEvent) => {this.onKeyDown(event);}
    }

    public getName(): string {
        return "Keyboard";
    }

    public onKeyDown(event: KeyboardEvent): void {
        // console.log(event);
        if (event.keyCode == 32) {
            this.fire(InputEvent.TRIGGER);
        }
    }

}