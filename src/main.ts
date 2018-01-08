import Metronome from "./components/metronome/metronome";
import Looper from "./components/looper/looper";
import recorder from "./components/looper/recorder";

var m = new Metronome(100, 4);
m.appendTo("metronome-container");

new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");

recorder.requestAudioInput();