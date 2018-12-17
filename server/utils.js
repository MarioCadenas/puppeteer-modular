const { writeFile } = require('fs');
const { promisify } = require('util');

const _writeFile = promisify(writeFile);

/**
 * Escribe el archivo con los resultados
 *
 * @param {Object} data
 */
const makeFileForRendering = async (data) => {
  try {
    await _writeFile(
      './server/results/response.json',
      JSON.stringify(data, null, 2),
      { flag: 'w' }
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/**
 * Devuelve un array de varios arrays del tamaño recibido.
 *
 * @param {array} arr Array a partir
 * @param {number} size Tamaño de los arrays
 */
const chunk = (arr, size) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (v, i) => arr.slice(i * size, i * size + size)
);

module.exports = { makeFileForRendering, chunk };
