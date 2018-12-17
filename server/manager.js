const Scrapper = require('./page');
const { chunk } = require('./utils');

module.exports = {
  /** @type {array} pageManagers Instancias de navegadores por módulo */
  pageManagers: [],
  /** @type {array} chunks Listado de configuraciones partido en el número de tabs por módulo */
  chunks: [],
  /** @type {array} queues Cola de ejecución por módulo */
  queues: [],
  /** @type {Object} globalConfig Configuración global para cada navegador */
  globalConfig: {
    tabs: 9,
    headless: true
  },
  /**
   * Inicia los módulos
   *
   * @param {Object} Objeto con la configuración global, y el listado de módulos
   * @returns {Promise<Object>} Objeto con todas las respuestas de los módulos
   */
  async init({ tabs, headless, modules }) {
    this.globalConfig.tabs = tabs;
    this.globalConfig.headless = headless;
    const responses = await Promise.all(modules.map(async module => this.startModule(module)));
    await Promise.all(this.pageManagers.map(pageManager => pageManager.closeBrowser()));

    return responses;
  },
  /**
   * Inicia el módulo recibido
   *
   * @param {Object} module Datos definidos en el módulo
   * @returns {Promise<Object>} Todos los datos de navegación del módulo
   */
  async startModule({ name, configs, dependencies, exec }) {
    this.pageManagers[name] = new Scrapper();
    await this.pageManagers[name].openBrowser(this.globalConfig.headless);
    this.chunks[name] = chunk(configs, this.globalConfig.tabs);
    this.queues[name] = this.makeGenerator(name, dependencies, exec);
    const response = await this.processQueue(name);

    return { [name]: response };
  },
  /**
   * Inicia la ejecución en la página correspondiente
   *
   * @param {string} moduleName Nombre del módulo
   * @param {number} index Número de página a ejecutar
   * @param {Promise<Object>} config Datos a utilizar en la navegación
   */
  async runPage(moduleName, index, config) {
    try {
      const results = await this.pageManagers[moduleName].runPage(index, config);
      return results;
    } catch (error) {
      return { error };
    }
  },
  /**
   * Procesa las llamadas al generador, se encarga de llamar al siguiente elemento
   * de la cola cuando el actual ha terminado.
   *
   * @param {string} moduleName Nombre del módulo a procesar
   * @returns {Promise<Object>} Objeto con todas las respuestas de todas las navegaciones del módulo
   */
  async processQueue(moduleName) {
    let done = false, value = null;
    const responses = [];

    do {
      // eslint-disable-next-line no-await-in-loop
      ({ done, value } = await this.queues[moduleName].next());
      if (value) { responses.push(...value); }
    } while (!done);

    return responses;
  },
  /**
   * Recorre las configuraciones del módulo, y las ejecuta, quedando a la espera
   * de que se invoque el método next()
   *
   * @param {string} moduleName Nombre del módulo
   * @param {Object} dependencies dependencias definidas en el módulo
   * @param {function} exec función que se va a ejecutar en la navegación
   * @yields {Promise<Object>} objeto con todas las respuestas de cada navegación
   */
  async* makeGenerator(moduleName, dependencies, exec) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const c of this.chunks[moduleName]) {
      await this.pageManagers[moduleName].openTabs(c.length);
      const results = await Promise.all(
        c.map(
          async (config, index) => this.runPage(moduleName, index, { config, dependencies, exec })
        )
      );
      yield results;
      await this.pageManagers[moduleName].closePages();
    }
  }
};
