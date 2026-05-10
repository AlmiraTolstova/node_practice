// Создайте новый файл с именем `notification_system.js`.

// Импортируйте модуль `events` и создайте экземпляр `EventEmitter`.

// Напишите функцию `sendNotification`, которая принимает сообщение и объект `EventEmitter`.

// Внутри функции `sendNotification` генерируйте событие `notification` с переданным сообщением.

// Зарегистрируйте несколько обработчиков для события `notification`, например, один для логирования в консоль, другой для записи в файл.

// Вызовите функцию `sendNotification` несколько раз с разными сообщениями

const fs = require("fs");
const EventEmitter = require("events");
const notificationEmitter = new EventEmitter();
function sendNotification(message, emitter) {
  emitter.on("notification", () => {
    console.log("New notification:", message);
  });
  emitter.on("notification", () => {
    fs.writeFile("notificationFile.txt", message, "utf8", (err) => {
      if (err) {
        console.error("Failed writing file");
        return;
      }
      console.log("File was created!");
    });
  });
}
