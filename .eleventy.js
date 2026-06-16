const { DateTime } = require("luxon");
const slugify = require("@sindresorhus/slugify").default;
// Плагин НЕ используем — пишем свой фильтр
// const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    // Читаем префикс из переменной окружения (или используем '/')
  const pathPrefix = process.env.PATH_PREFIX || '/';

  eleventyConfig.addFilter("url", function(path) {
    // Если префикс корневой — ничего не добавляем
    if (pathPrefix === '/' || pathPrefix === '') return path;
    
    // Убираем завершающий слеш у префикса
    const cleanPrefix = pathPrefix.replace(/\/$/, '');
    
    // Если путь уже начинается с префикса — не дублируем
    if (path.startsWith(cleanPrefix)) return path;
    
    // Добавляем префикс, убирая лишний слеш в начале пути
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return cleanPrefix + cleanPath;
  });

  // ========== ВСЁ ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ ==========
  // Копирование статики
  eleventyConfig.addPassthroughCopy({
    "src/css/style.css": "css/style.css",
    "src/css/swiper-bundle.min.css": "css/swiper-bundle.min.css",
    "src/fonts": "fonts",
    "src/img": "img",
    "src/js": "js",
    "src/modules": "modules",
    "src/vid": "vid"
  });

  // Коллекция новостей
  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/news/*.md");
  });

  eleventyConfig.addFilter("exceptCurrent", function(collection, currentUrl) {
    if (!collection || !Array.isArray(collection)) return [];
    return collection.filter(item => item.url !== currentUrl);
  });

  eleventyConfig.addFilter("date", (dateObj, format = "dd.MM.yyyy") => {
    if (!dateObj) return "Дата не указана";
    return DateTime.fromJSDate(new Date(dateObj)).toFormat(format);
  });

  eleventyConfig.addFilter("dateLong", (dateObj) => {
    if (!dateObj) return "Дата не указана";
    const monthsGenitive = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    const dt = DateTime.fromJSDate(new Date(dateObj)).setLocale("ru");
    const day = dt.toFormat("d");
    const month = monthsGenitive[dt.month - 1];
    const year = dt.toFormat("yyyy");
    return `${day} ${month} ${year}`;
  });

  eleventyConfig.addFilter("wrapElements", (content) => {
    if (!content) return "";
    const elementClasses = {
      'p': ['font-main'],
      'h1': ['font-title'],
      'h2': ['font-title'],
      'h3': ['font-title'],
      'h4': ['font-title'],
      'h5': ['font-title'],
      'h6': ['font-title']
    };
    let result = content;
    Object.entries(elementClasses).forEach(([tag, classes]) => {
      const classString = classes.join(' ');
      const regex = new RegExp(`<${tag}\\b([^>]*)>`, 'g');
      result = result.replace(regex, (match, attributes) => {
        if (attributes.includes('class="')) {
          return match.replace('class="', `class="${classString} `);
        } else if (attributes.includes("class='")) {
          return match.replace("class='", `class='${classString} `);
        } else {
          return `<${tag} class="${classString}"${attributes}>`;
        }
      });
    });
    return result;
  });

  eleventyConfig.addFilter("slug", (str) => slugify(str));

  // ========== НАСТРОЙКИ КАТАЛОГОВ ==========
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
    // pathPrefix НЕ УКАЗЫВАЕМ — используем только переменную окружения
  };
};