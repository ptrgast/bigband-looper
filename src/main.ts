import Metronome from "./components/metronome/metronome";
import Looper from "./components/looper/looper";
import recorder from "./components/looper/recorder";
import KeyboardInput from "./components/input/sources/keyboard";
import InputManager from "./components/input/input-manager";
import { InputEvent } from "./components/input/input-events";
import LooperManager from "./components/looper/looper-manager";
import MidiInput from "./components/input/sources/midi";

var m = new Metronome(100, 4);
m.appendTo("metronome-container");

var looperManager = new LooperManager(m);
looperManager.appendTo('loopers');

recorder.requestAudioInput();

// Input

var keyboard = new KeyboardInput();
var midi = new MidiInput();
var inputManager = new InputManager();
inputManager.addSource(keyboard);
inputManager.addSource(midi);
inputManager.addListener(looperManager);