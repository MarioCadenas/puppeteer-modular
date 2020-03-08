const path = require('path');

/**
 * @param {string} dir
 * @returns {string}
 */
const getFilePath = (dir, fileName) => path.resolve(dir, `${fileName}.json`);

/**
 * @param {Date} date
 * @returns {string}
 */
const getDate = (date) => {
  const day = date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}`;
  const currentMonth = date.getMonth() + 1;
  const month = currentMonth.toString().length > 1 ? currentMonth : `0${currentMonth}`;
  const year = date.getFullYear();
  const hours = date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`;
  const time = `${hours}${minutes}`;

  return `${day}-${month}-${year}-${time}`;
};

/**
 * @param {array} arr
 * @param {number} size
 */
const chunk = (arr, size) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (v, i) => arr.slice(i * size, i * size + size)
);

module.exports = { getFilePath, getDate, chunk };
