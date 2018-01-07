import Metronome from "./components/metronome";
import Looper from "./components/looper";
import Clock from "./shared/clock";

var m = new Metronome(100, 4);
m.appendTo("header");

new Looper(m).appendTo("loopers");
new Looper(m).appendTo("loopers");
new Looper(m).appendTo("loopers");
new Looper(m).appendTo("loopers");
