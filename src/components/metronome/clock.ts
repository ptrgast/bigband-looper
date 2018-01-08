import {ClockListener} from "./clock-listener";

const CLOCK_INTERVAL = 2; //msec

enum Status {
    STARTED,
    STOPPED
}

export default class Clock {

    private status: Status = Status.STOPPED;
    private startTime = 0;
    private timer = null;
    private listeners: OffsetListenerBundle[] = [];
    private queue: OffsetListenerBundle[] = [];

    public constructor(private interval: number = 0) {
        this.startTime = this.now();        
        this.timer = setInterval(this.tick, CLOCK_INTERVAL);
    }

    public start(): void {
        this.startTime = this.now();
        this.status = Status.STARTED;
    }

    public stop(): void {
        this.status = Status.STOPPED;
    }

    public setInterval(interval: number):void {
        this.interval = interval;
        this.startTime = this.now();
    }

    public addListener(listener: ClockListener, offset: number = 0): void {
        var bundle = {
            receiver: listener,
            offset: offset
        };
        this.listeners.push(bundle);
    }

    public setListener(listener: ClockListener, offset: number = 0):void {
        var bundle = null;
        for (var i=0; i<this.listeners.length; i++) {
            if (this.listeners[i].receiver == listener) {
                bundle = this.listeners[i];
                break;
            }    
        }
        if (bundle == null) {
            bundle = {
                receiver: listener,
                offset: offset
            };
            this.listeners.push(bundle);
        } else {
            bundle.offset = offset;
        }
    }

    // Use instance arrow function to keep 'this' pointing the current Clock object
    private tick = (): void => {
        if (this.status != Status.STARTED) {
            return;
        }

        var now = this.now();
        var dt = now - this.startTime;
        if (dt >= this.interval) {
            dt = 0;            
            this.startTime = now;
            this.resetQueue();
        }

        // call listeners
        for (var i = this.queue.length-1; i >= 0; i--) {
            var bundle = this.queue[i];
            if ((bundle.offset >=0 && dt >= bundle.offset) || (bundle.offset < 0 && dt >= this.interval+bundle.offset)) {
                bundle.receiver.onTick(bundle.offset);
                this.queue.splice(i, 1);
            }
        }
    }

    private resetQueue(): void {
        this.queue = [];
        for (var i = 0; i < this.listeners.length; i++) {
            this.queue.push(this.listeners[i]);
        }
    }

    private now(): number {
        return new Date().getTime();
    }

}

interface OffsetListenerBundle {

    receiver: ClockListener;
    offset: number;

}