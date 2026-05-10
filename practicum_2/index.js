// Задание 1
// Регистрация нескольких обработчиков на одно событие
// 1.	Создайте новый файл с именем `multiple_handlers.js`.
// 2.	Импортируйте модуль `events` и создайте экземпляр `EventEmitter`.
// 3.	Зарегистрируйте первый обработчик для события `event`.
// 4.	Зарегистрируйте второй обработчик для того же события `event`.
// 5.	Сгенерируйте событие `event`.
// 6.	Запустите скрипт и убедитесь,
// что оба обработчика вызываются при генерации события.

const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("event", () => {
  console.log("The first is called");
});
emitter.on("event", () => {
  console.log("The second is called");
});

emitter.emit("event");
