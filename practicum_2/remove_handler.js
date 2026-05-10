// Задание 2
// Удаление обработчика события
// 1.	Создайте новый файл с именем `remove_handler.js`.
// 2.	Импортируйте модуль `events` и создайте экземпляр `EventEmitter`.
// 3.	Определите функцию-обработчик, которая будет
// регистрироваться для события `event`.
// 4.	Зарегистрируйте этот обработчик для события `event`.
// 5.	Сгенерируйте событие `event` и убедитесь, что обработчик
//  вызывается.
// 6.	Удалите зарегистрированный обработчик для события `event`.
// 7.	Снова сгенерируйте событие `event` и убедитесь, что обработчик
// больше не вызывается.

// const EventEmitter = require("events");
// const emitter = new EventEmitter();

// function eventHandler() {
//   console.log("Handler function ");
// }

// emitter.on("event", eventHandler);

// console.log("First call");
// emitter.emit("event");

// emitter.removeListener("event", eventHandler);

// console.log("Second call");
// emitter.emit("event");

// Задание 3
// Использование метода `once` для одноразовых событий
// 1.	Создайте новый файл с именем `once_handler.js`.
// 2.	Импортируйте модуль `events` и создайте экземпляр `EventEmitter`.
// 3.	Зарегистрируйте обработчик для события `event` с использованием метода `once`.
// 4.	Сгенерируйте событие `event` и убедитесь, что обработчик вызывается.
// 5.	Снова сгенерируйте событие `event` и убедитесь, что обработчик больше не вызывается,
//  так как он был одноразовым.

const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.once("event", () => {
  console.log("The handler is called once");
});

console.log("First call");
emitter.emit("event");

console.log("Second call");
emitter.emit("event");
