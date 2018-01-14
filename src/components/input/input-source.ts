import InputListener from "./input-listener";
import { InputEvent } from "./input-events";

export default abstract class InputSource {

    private listener: InputListener;

    public getName(): string {
        return "Untitled Source";
    }

    public setListener(listener: InputListener): void {
        this.listener = listener;
    }

    protected fire(event: InputEvent) {
        if (this.listener != null) {
            this.listener.onInput(event);
        }
    }

}