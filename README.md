# Лендинг сайта ЭТОС

Лендинг для сайта [stroi.etos-pro.ru](https://stroi.etos-pro.ru), размещённый на [s1dm4n.github.io/lending-stroi-etos](https://s1dm4n.github.io/lending-stroi-etos). Построен на [Eleventy](https://www.11ty.dev/). Деплой на GitHub Pages и создание ZIP-релиза (`stroi.etos.ru-vX.Y.Z.zip`) происходят при пуше тега (`v*`) через GitHub Actions.

## Что делает проект
- Генерирует статический сайт с новостями (например, "Невский форум-2025", даты в формате "10 сентября 2025").
- Деплоится на `s1dm4n.github.io` при создании тега.
- Создаёт ZIP-архив сайта в GitHub Releases для скачивания.

## Установка и настройка

### Требования
- **Git**: [Скачать](https://git-scm.com/download/win).
- **Node.js**: Версия 20.x.x, [скачать](https://nodejs.org/en/download/).
- **VS Code**: Для редактирования и терминала.
- **PowerShell**: Для команд (встроен в Windows).

### Клонирование репозитория
1. В VS Code откройте терминал (Ctrl + ~).
2. Перейдите в рабочую папку:
   ```powershell
   cd D:\work
   ```
3. Клонируйте репо:
   ```powershell
   git clone https://github.com/s1dm4n/s1dm4n.github.io.git
   cd s1dm4n.github.io
   ```
4. Установите зависимости:
   ```powershell
   npm ci
   ```
   Это установит `luxon`, `@sindresorhus/slugify` и другие пакеты из `package.json`.

5. Проверьте сборку:
   ```powershell
   npm run build
   ```
   - Папка `_site` создаётся (не коммитится, так как в `.gitignore`).
   - Откройте `_site/index.html` в браузере — должен быть сайт "ЭТОС".

### Настройка SSH-аутентификации
Для пуша изменений и тегов настройте SSH:

1. Сгенерируйте SSH-ключ:
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   - Нажмите Enter для пути `C:\Users\<YourUser>\.ssh\id_ed25519`.
   - Пароль для ключа необязателен.

2. Добавьте ключ в GitHub:
   - Откройте `C:\Users\<YourUser>\.ssh\id_ed25519.pub` в Notepad.
   - Скопируйте содержимое.
   - В GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** → вставьте ключ, задайте имя (например, "My PC").

3. Настройте SSH для репо:
   ```powershell
   git remote set-url origin git@github.com:s1dm4n/s1dm4n.github.io.git
   ```

4. Проверьте:
   ```powershell
   ssh -T git@github.com
   ```
   - Должно вывести: `Hi s1dm4n! You've successfully authenticated...`.

## Обновление сайта и создание релиза

### Обновление контента
1. Добавьте контент, например, новость в `src/news/new-post.md`:
   ```markdown
   ---
   title: Новый пост
   date: 2025-10-04
   ---
   Контент новости...
   ```
2. Проверьте локально:
   ```powershell
   npm run build
   ```
   - Убедитесь, что `_site/index.html` содержит обновления (даты вроде "4 октября 2025").

3. Синхронизируйте ветку `main`:
   ```powershell
   git pull origin main
   ```
   - Если возникли конфликты (например, в `README.md`), откройте файлы в VS Code, разрешите конфликты, затем:
     ```powershell
     git add .
     git commit
     ```

4. Запушьте изменения:
   ```powershell
   git add .
   git commit -m "Add new news post"
   git push origin main
   ```

### Создание релиза и деплоя
Сайт деплоится на `s1dm4n.github.io`, и ZIP создаётся при пуше тега:

#### Способ 1: Ручное создание тега
1. Создайте тег:
   ```powershell
   git tag v1.0.2
   ```

2. Запушьте тег и ветку `main`:
   ```powershell
   git push --follow-tags
   ```
   - Команда `git push --follow-tags` пушит ветку `main` и все аннотированные теги (например, `v1.0.2`), связанные с коммитами в этой ветке.
   - Это запускает workflow GitHub Actions, который:
     - Собирает `_site` (Eleventy).
     - Создаёт `stroi.etos.ru-v1.0.2.zip`.
     - Деплоит сайт на `s1dm4n.github.io`.
     - Добавляет релиз в **Releases**.
   - **Примечание**: Если возникает ошибка `non-fast-forward` (ветка `main` отстаёт), выполните `git pull origin main`, разрешите конфликты, затем повторите `git push --follow-tags`.

#### Способ 2: Автоматизация тегов с `standard-version`
1. Установите `standard-version`:
   ```powershell
   npm install -g standard-version
   ```

2. Создайте тег автоматически:
   ```powershell
   standard-version
   ```
   - Это создаёт тег (например, `v1.0.2`) на основе коммитов (используйте формат `feat:`, `fix:`, `docs:` в сообщениях коммитов, например, `git commit -m "feat: add new news post"`).
   - Затем запушьте:
     ```powershell
     git push --follow-tags
     ```

3. Проверьте результат (см. ниже).

#### Способ 3: Ручной запуск без локального тега
1. В **Actions** → выберите "Build, Deploy, and Release" → **Run workflow**.
2. Введите `tag_name` (например, `v1.0.2`) и запустите.
3. Workflow создаст тег, соберёт сайт, задеплоит и добавит релиз.

#### Проверка результата
- В **Actions** (https://github.com/s1dm4n/s1dm4n.github.io/actions) убедитесь, что workflow завершился.
- В **Releases** (https://github.com/s1dm4n/s1dm4n.github.io/releases) найдите "Release v1.0.2" с `stroi.etos.ru-v1.0.2.zip`.
- Распакуйте ZIP:
  ```powershell
  Expand-Archive -Path .\stroi.etos.ru-v1.0.2.zip -DestinationPath .\test-unzip
  ```
  - Проверьте `test-unzip/index.html` в браузере.
- Откройте `s1dm4n.github.io` — сайт должен обновиться.

## Доступ к редактированию
- **Кто может редактировать**: Только владелец (`s1dm4n`) или коллабораторы (**Settings** → **Manage access**).
- **Публичный репо**: Другие могут форкать и предлагать Pull Requests (PR), но без вашего одобрения изменения не применятся.
- **Ограничение**: Отключите PR в **Settings** → **General** → "Allow merge commits" или сделайте репо private (но Pages станет платным).

## Устранение проблем
- **Ошибка пуша**: Проверьте SSH (`ssh -T git@github.com`). Если ошибка `non-fast-forward`, выполните `git pull origin main`.
- **Ошибка сборки**: Убедитесь, что зависимости установлены (`npm install luxon @sindresorhus/slugify`).
- **Релиз не создаётся**: Проверьте логи в **Actions**. Тег должен быть в формате `v*`.
- **Сайт не обновился**: Проверьте **Settings** → **Pages** → Source = **GitHub Actions**.
