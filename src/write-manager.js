const fs = require('fs');
const PromiseFtp = require('promise-ftp');
const { promisify } = require('util');
const Logger = require('./logger');
const RESULTS_DIR = require('./constants');
const { getDate, getFilePath } = require('./utils');
const { writeModes } = require('./arguments');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const writeManager = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,

  /**
   * Escribe en los lugares indicados por configuración.
   *
   * @param {Object} data
   * @param {array} writeModes
   */
  async writeFile(data) {
    try {
      Logger.timeEnd('analisis');

      if (writeModes.includes('disk')) {
        await this.diskWrite(data);
      }

      if (writeModes.includes('ftp')) {
        await this.ftpWrite(data);
      }

      process.exit();
    } catch (error) {
      Logger.error(error);
      process.exit(1);
    }
  },

  /**
   * Escribe el archivo con los resultados en el directorio definido
   *
   * @param {Object} data
  */
  async diskWrite(data) {
    try {
      if (!fs.existsSync(RESULTS_DIR)) {
        await mkdir(RESULTS_DIR);
      }
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      await writeFile(getFilePath(RESULTS_DIR, `results-${getDate(new Date())}`), content);
      await writeFile(getFilePath(RESULTS_DIR, 'latest'), content);
    } catch (error) {
      Logger.error(error);
      process.exit(1);
    }
  },

  /**
   * Escribe el archivo en el ftp definido en el .env
   *
   * @param {Object} data
   * @returns {Promise}
   */
  ftpWrite(data) {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const { host, user, password } = this;
    const ftp = new PromiseFtp();
    const ftpContentWrite = () => ftp.put(content, 'latest.json');
    const ftpClose = () => ftp.end();

    return ftp
      .connect({ host, user, password })
      .then(ftpContentWrite)
      .then(ftpClose)
      .catch(Logger.error);
  }
};

module.exports = { writeManager };
