const { chromium, devices } = require('playwright');
const ValidationError = require('./validator');
const Logger = require('./logger');

const iPhone = devices['iPhone 6'];

class Scrapper {
  constructor() {
    this._browser = null;
    this._context = null;
    this._pages = null;
    this.args = [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ];
    this.timeouts = {
      NAVIGATION_TIMEOUT: 0,
      BROWSER_TIMEOUT: 0
    };
    this.defaultViewport = {
      width: 1280,
      height: 720
    };
  }

  /**
   * @param {number} pageIndex
   * @param {function} fn
   * @param  {...any} params
   * @returns {Promise}
   */
  async evaluate(pageIndex, fn, ...params) {
    try {
      return this._pages[pageIndex].evaluate(fn, ...params);
    } catch (error) {
      Logger.error(error);
      return { error };
    }
  }

  /**
   * @param {number} [tabsNumber = 5]
   * @returns {Promise}
   */
  async openTabs(tabsNumber = 5) {
    try {
      await Promise.all([...Array(tabsNumber)].map(async () => this._context.newPage()));
      this._pages = await this._context.pages();
      return this._pages;
    } catch (error) {
      Logger.error(error);
      return { error: error.message };
    }
  }

  /**
   * @param {number} pageIndex
   * @param {Object} moduleData
   * @returns {Promise}
   */
  async runPage(pageIndex, moduleData) {
    try {
      const { config, dependencies, exec } = moduleData;
      const { data, device, url } = config;
      const { timeouts: { NAVIGATION_TIMEOUT: timeout } } = this;

      if (device !== 'desktop') { await this._pages[pageIndex].emulate(iPhone); }

      const navigationResult = await this._pages[pageIndex].goto(
        ValidationError.validateUrl(url),
        { timeout }
      );
      const status = getStatus(navigationResult);

      if (status.statusCode !== 200) {
        return { ...status, result: {} };
      }

      Logger.log('analyzing', url);
      const result = await this.evaluate(pageIndex, exec, dependencies, data, device);
      Logger.log(`URL - ${url} has been analyzed.`);
      return { ...status, result };
    } catch ({ message, data: { url = '' } = {} }) {
      Logger.error(message);
      return { error: message, url };
    }
  }

  /**
   * @returns {Promise} Cierra todas las páginas del navegador
   */
  async closePages() {
    try {
      return this._pages.map(async page => page.close());
    } catch ({ message }) {
      Logger.error(message);
      return { error: message };
    }
  }

  /**
   * @param {boolean} headless
   * @returns {Promise}
   */
  async openBrowser(headless) {
    try {
      if (!this._browser) {
        const { defaultViewport, timeouts: { BROWSER_TIMEOUT: timeout }, args } = this;
        this._browser = await chromium.launch({ headless, defaultViewport, timeout, args });
        this._context = await this._browser.newContext({
          viewport: iPhone.viewport,
          userAgent: iPhone.userAgent
        });
      }
      return this._browser;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  /**
   * @returns {Promise}
   */
  async closeBrowser() {
    try {
      return this._browser.close();
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}

module.exports = Scrapper;

/** Private functions */

const getStatus = result => ({
  url: result.request().url(),
  statusCode: result.status(),
  statusText: result.statusText(),
  userAgent: result.request().headers()['user-agent']
});
