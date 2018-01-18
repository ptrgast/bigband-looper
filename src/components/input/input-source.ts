import InputListener from "./input-listener";
import { InputEvent } from "./input-events";
import GestureManager, { GestureListener, Gesture } from "./gesture-manager";

export default abstract class InputSource implements GestureListener {

    private listener: InputListener;
    private gestureManager: GestureManager;

    public constructor() {
        this.gestureManager = new GestureManager(this);
    }

    public getName(): string {
        return "Untitled Source";
    }

    public setListener(listener: InputListener): void {
        this.listener = listener;
    }

    protected feed(event: InputEvent, down: boolean): void {
        this.gestureManager.addEvent(event, down);
    }

    public onGestureCompleted(gesture: Gesture) {
        console.log(gesture);
        if (gesture.repetitions == 1 && gesture.duration < 500) {
            this.fire(InputEvent.TRIGGER);
        } else if (gesture.repetitions == 1 && gesture.duration >= 500) {
            this.fire(InputEvent.POP_TRACK);
        } else if (gesture.repetitions == 2 && gesture.duration < 500) {
            this.fire(InputEvent.PUSH_TRACK);
        } else if (gesture.repetitions == 3) {
            this.fire(InputEvent.CLEAR);
        }
        // console.log(gesture);
    }

    private fire(event: InputEvent): void {
        if (this.listener != null) {
            this.listener.onInput(event);
        }
    }

}

