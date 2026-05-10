// Создайте новый файл с именем `user_state.js`.

// Импортируйте модуль `events` и создайте экземпляр `EventEmitter`.

// Напишите функцию `changeUserState`, которая принимает новый статус и объект `EventEmitter`.

// Внутри функции `changeUserState` генерируйте событие `stateChange` с переданным статусом.

// Зарегистрируйте обработчики для события `stateChange`, чтобы выводить новый статус в консоль.

// Вызовите функцию `changeUserState` несколько раз с разными статусами.

import EventEmitter from "events";

const emitter = new EventEmitter();

const changeUserState = (status, emitter) => {
  emitter.on("changeState", () => {
    console.log(status);
  });
};
