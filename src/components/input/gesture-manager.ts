import { InputEvent } from "./input-events";

const GESTURE_TIMEOUT = 150;

export default class GestureManager implements GestureListener {

    private listener: GestureListener;    
    private buffer: Gesture[] = [];

    public constructor(listener: GestureListener) {
        this.listener = listener;
    }

    public addEvent(event: InputEvent, down: boolean): void {
        var gesture = this.findGesture(event);
        if (gesture == null) {
            gesture = new Gesture(this, event);
            this.buffer.push(gesture);
        }
        gesture.addEvent(down);
    }

    private findGesture(event: InputEvent): Gesture {
        for (var i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i].event == event) {
                return this.buffer[i];
            }
        }
        return null;
    }

    public onGestureCompleted(gesture: Gesture): void {
        // remove from buffer
        for (var i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i] == gesture) {
                this.buffer.splice(i, 1);
                break;
            }
        }
        if (this.listener != null) {
            this.listener.onGestureCompleted(gesture);
        }
    }

}

export class Gesture {

    public event: InputEvent;
    public repetitions: number = 0;
    public duration: number = 0;

    private startTime: number;
    private previousEvent: boolean = false;
    private previousEventStartTime: number;

    private listener: GestureListener;

    private timeoutTimer;

    public constructor(listener: GestureListener, event: InputEvent) {
        this.listener = listener;
        this.event = event;
        this.startTime = new Date().getTime();
        this.timeoutTimer = setInterval(() => {this.tick()}, 10);
    }

    public addEvent(down: boolean): void {
        if (!down && this.previousEvent) {
            this.repetitions++;
        }
        this.previousEvent = down;
        this.previousEventStartTime = new Date().getTime();
    }

    private tick() {
        var now = new Date().getTime();
        var currentEventDuration = now - this.previousEventStartTime;
        if (this.repetitions>0 && currentEventDuration >= GESTURE_TIMEOUT) {
            clearInterval(this.timeoutTimer);
            this.duration = now - this.startTime;
            this.listener.onGestureCompleted(this);
        }
    }

}

export interface GestureListener {

    onGestureCompleted: (gesture: Gesture) => void;

}