const { DateTime } = require("luxon");
const slugify = require("@sindresorhus/slugify").default;
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  // Плагин для base path (добавляет фильтр | url)
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

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

  // Фильтр для исключения текущей страницы
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

  // Настройки каталогов и pathPrefix
  return {
      dir: {
          input: "src",
          includes: "_includes",
          output: "_site"
      },
      pathPrefix: process.env.PATH_PREFIX || '/'   // <-- ЗДЕСЬ, а не внутри dir
  };
};