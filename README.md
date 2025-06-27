# Каталог фотографий и избранное (Vue.js 2)

Одностраничное приложение для просмотра пользователей, их альбомов и фотографий. Поддерживает ленивую загрузку, избранное с сохранением в localStorage, просмотр фото в модальном окне, обработку ошибок

## Стек

- Vue.js 2, Vue Router
- Vuex
- Axios
- SCSS

## Возможности

- Каталог пользователей, альбомов и фотографий (API: https://json.medrocket.ru)
- Ленивая подгрузка альбомов и фотографий
- Избранное: добавление/удаление фото, сохранение в localStorage
- Модальное окно для просмотра фото в полном размере
- Состояния загрузки и ошибок с иллюстрациями

## Project setup

```bash
npm install
```

### Development

```bash
npm run serve
```

### Production build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
