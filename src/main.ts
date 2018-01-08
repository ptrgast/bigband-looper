import Metronome from "./components/metronome";
import Looper from "./components/looper";
import Clock from "./shared/clock";

var m = new Metronome(100, 4);
m.appendTo("metronome-container");

new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
new Looper(m).appendTo("loopers-container");
