// Задание 7

// Перемещение, копирование и удаление файла изображения

// 1.	Создайте новый скрипт в вашем проекте.
//  Назовите его, например, `fileOperations.js`.

// 2.	Импортируйте необходимые модули в ваш скрипт:

// Модуль `fs` для работы с файловой системой.
// Модуль `path` для работы с путями файлов и каталогов.

// 3.	Определите путь к исходному файлу:

// В данном примере используйте файл изображения `example.jpg`,
// который должен находиться в той же директории, что и ваш скрипт.
// Сформируйте путь к файлу с использованием метода `path.join`
//  и специальной переменной `__dirname`.

// 4.	Перемещение и переименование файла:

// Используйте метод `fs.rename` для перемещения и переименования файла.
// Укажите текущий путь к файлу и новый путь, включая новое имя файла
// (`renamedExample.jpg`).
// Создайте функцию обратного вызова (callback) для обработки ошибок
// и вывода сообщений о результате операции.
// Внутри функции обратного вызова выполните следующие шаги только в
//  случае успешного переименования.

// 5.	Копирование файла:

// Используйте метод `fs.copyFile` для копирования файла.
// Укажите путь к переименованному файлу (`renamedExample.jpg`) и
//  новый путь для копии (`copyOfExample.jpg`).
// Создайте функцию обратного вызова (callback) для обработки ошибок и
//  вывода сообщений о результате операции.
// Внутри функции обратного вызова выполните следующие шаги только в
// случае успешного копирования.

// 6.	Удаление исходного файла:

// Используйте метод `fs.unlink` для удаления файла.
// Укажите путь к переименованному файлу (`renamedExample.jpg`).
// Создайте функцию обратного вызова (callback) для обработки ошибок и
//  вывода сообщений о результате операции.

// 7.	Запустите скрипт:

// Убедитесь, что в той же директории находится файл `example.jpg`.
// Запустите скрипт в терминале командой `node fileOperations.js`.
// Проверьте вывод в консоли и убедитесь, что все операции выполнены
//  успешно.

const fs = require("fs");
const path = require("path");

// Paths
const originalPath = path.join(__dirname, "example.jpg");
const renamedPath = path.join(__dirname, "renamedExample.jpg");
const copyPath = path.join(__dirname, "copyOfExample.jpg");

// 1. Rename (move)
fs.rename(originalPath, renamedPath, (err) => {
  if (err) {
    console.error("Rename error:", err);
    return;
  }

  console.log("File renamed successfully!");

  // 2. Copy file (inside rename callback)
  fs.copyFile(renamedPath, copyPath, (err) => {
    if (err) {
      console.error("Copy error:", err);
      return;
    }

    console.log("File copied successfully!");

    // 3. Delete file (inside copy callback)
    fs.unlink(renamedPath, (err) => {
      if (err) {
        console.error("Delete error:", err);
        return;
      }

      console.log("Original renamed file deleted successfully!");
    });
  });
});
