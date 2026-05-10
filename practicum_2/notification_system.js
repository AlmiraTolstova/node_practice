// Задание 5
// Система уведомлений
// 1.	Создайте новый файл с именем `notification_system.js`.
// 2.	Импортируйте модуль `events` и создайте экземпляр
// `EventEmitter`.
// 3.	Напишите функцию `sendNotification`,
// которая принимает сообщение и объект `EventEmitter`.
// 4.	Внутри функции `sendNotification` генерируйте событие
// `notification` с переданным сообщением.
// 5.	Зарегистрируйте несколько обработчиков для события
// `notification`, например, один для логирования в консоль,
//  другой для записи в файл.
// 6.	Вызовите функцию `sendNotification` несколько раз с
//  разными сообщениями

const EventEmitter = require("events");
const emitter = new EventEmitter();
const fs = require("fs");

function sendNotification(message, emitter) {
  emitter.emit("notification", message);
}

emitter.on("notification", (msg) => {
  console.log("Message:", msg);
});

emitter.on("notification", (msg) => {
  fs.appendFileSync("notifications.log", msg + "\n");
});

sendNotification("First message", emitter);
sendNotification("Second message", emitter);
