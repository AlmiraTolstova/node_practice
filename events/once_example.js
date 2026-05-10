// Задание 3 Создать событие, которое будет срабатывать только один раз
// 1. Создайте новый файл с именем once_example.js.
// 2. В этом файле создайте экземпляр EventEmitter.
// 3. Зарегистрируйте одноразовый обработчик события.
// 4. Сгенерируйте событие несколько раз и убедитесь,
// что обработчик сработал только один раз.

// const EventEmitter = require("events");
// const emitter = new EventEmitter();

// emitter.once("myEvent", (data) => {
//   console.log("Done once!", data);
// });

// emitter.emit("myEvent", "first call");
// emitter.emit("myEvent", "second call");

const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.once("oneTimeEvent", () => {
  console.log("this will be logged only once");
});
console.table(emitter);
emitter.emit("oneTimeEvent");
emitter.emit("oneTimeEvent");
console.table(emitter);
