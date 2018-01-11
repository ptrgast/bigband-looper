export interface ClockListener {

    onTick: (name: string, offset: number) => void;

}