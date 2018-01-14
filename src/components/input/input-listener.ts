import { InputEvent } from "./input-events";

export default interface InputListener {

    onInput: (event: InputEvent) => boolean;

}