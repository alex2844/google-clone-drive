# googleCloneDrive

## Быстрое копирование файлов в google drive

#### Подключение
* Создайте Google Apps Script в папке которую нужно копировать
* Смените название скрипта на любое - например Backup
* Вид -> Показать файл манифеста (https://github.com/alex2844/google-clone-drive/blob/master/appsscript.json)
* Код gs

```javascript
eval(UrlFetchApp.fetch(
	'https://raw.githubusercontent.com/alex2844/google-clone-drive/master/googleCloneDrive.js'
).getContentText());
function myFunction() {
	googleCloneDrive();
}
```
* Для запуска по расписанию, настройте тригеры

#### Youtube
[![Youtube](https://img.youtube.com/vi/iE3Aonh9T9w/0.jpg)](https://www.youtube.com/watch?v=iE3Aonh9T9w 'Youtube')
