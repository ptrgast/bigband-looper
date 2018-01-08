import Metronome from "./components/metronome/metronome";
import Looper from "./components/looper/looper";

var m = new Metronome(100, 4);
m.appendTo("metronome-container");

new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
