const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPhone = devices['iPhone 6'];

class Scrapper {
  constructor() {
    this._browser = null;
    this._pages = null;
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
   * @param {number} pageIndex Número de página que se va a ejecutar
   * @param {function} fn Función que se va a ejecutar en el navegador
   * @param  {...any} params
   */
  async evaluate(pageIndex, fn, ...params) {
    try {
      return this._pages[pageIndex].evaluate(fn, ...params);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Abre el total de pestañas recibidas
   *
   * @param {number} [tabsNumber = 5] Número de tabs que se van a abrir
   * @returns {Promise}
   */
  async openTabs(tabsNumber = 5) {
    try {
      await Promise.all([...Array(tabsNumber)].map(async () => this._browser.newPage()));
      this._pages = await this._browser.pages();
      return this._pages;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Ejecuta la navegación a la url indicada, y opcionalmente simula el dispositivo
   * que venga en la configuración
   *
   * @param {number} pageIndex Número de página a ejecutar
   * @param {Object} moduleData Datos del módulo
   * @returns {Promise}
   */
  async runPage(pageIndex, moduleData) {
    try {
      const { config, dependencies, exec } = moduleData;
      const { data, device, url } = config;
      const { timeouts: { NAVIGATION_TIMEOUT: timeout } } = this;
      if (device !== 'desktop') { await this._pages[pageIndex].emulate(iPhone); }
      await this._pages[pageIndex].goto(url, { timeout });
      return this.evaluate(pageIndex, exec, dependencies, data, device);
    } catch (error) {
      return { error };
    }
  }

  /**
   * @returns {Promise} Cierra todas las páginas del navegador
   */
  async closePages() {
    try {
      return this._pages.forEach(async page => page.close());
    } catch (error) {
      return { error };
    }
  }

  /**
   * Abre un nuevo navegador
   *
   * @param {boolean} headless Define si abrir o no la interfaz de chromium
   */
  async openBrowser(headless) {
    try {
      if (!this._browser) {
        const { defaultViewport, timeouts: { BROWSER_TIMEOUT: timeout } } = this;
        this._browser = await puppeteer.launch({ headless, defaultViewport, timeout });
      }
      return this._browser;
    } catch (error) {
      return error;
    }
  }

  /**
   * Cierra el navegador
   *
   * @returns {Promise}
   */
  async closeBrowser() {
    try {
      return this._browser.close();
    } catch (error) {
      return error;
    }
  }
}

module.exports = Scrapper;
