// Задание 2

// Зарегистрировать несколько обработчиков на одно событие и удалить один из них

// 1.	Создайте новый файл с именем `event_handlers_example.js`.

// 2.	В этом файле создайте экземпляр EventEmitter.

// 3.	Зарегистрируйте два обработчика на одно событие.

// 4.	Удалите один из обработчиков.

// 5.	Сгенерируйте событие и убедитесь, что остался только один обработчик.

// const EventEmitter = require("events");
// const emitter = new EventEmitter();

// const handler1 = () => {
//   console.log("It is handler1");
// };

// const handler2 = () => {
//   console.log("It is handler2");
// };

// emitter.on("myEvent", handler1);
// emitter.on("myEvent", handler2);

// emitter.removeListener("myEvent", handler1);

// emitter.emit("myEvent");

const EventEmitter = require("events");
const emitter = new EventEmitter();
const hanlder1 = (data) => {
  console.log("First:", data);
};
const hanlder2 = (data) => {
  console.log("Second:", data);
};
emitter.on("message", hanlder1);
emitter.on("message", hanlder2);
emitter.removeListener("message", hanlder2);
emitter.emit("message", "render");
