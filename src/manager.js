const Scrapper = require('./page');
const { chunk } = require('./utils');

module.exports = {
  /** @type {array} pageManagers */
  pageManagers: [],
  /** @type {array} moduleChunks */
  moduleChunks: [],
  /** @type {array} moduleQueues */
  moduleQueues: [],
  /** @type {Object} globalConfig */
  globalConfig: {
    tabs: 5,
    headless: true
  },
  /**
   * @param {Object}
   * @returns {Promise<Object>}
   */
  async init({ tabs, headless, modules }) {
    this.globalConfig.tabs = tabs;
    this.globalConfig.headless = headless;

    const results = await Promise.all(modules.map(async module => this.startModule(module)));

    await Promise.all(this.pageManagers.map(async pageManager => pageManager.closeBrowser()));

    return { executedAt: new Date().toLocaleString('es'), results };
  },
  /**
   * @param {Object} module
   * @returns {Promise<Object>}
   */
  async startModule({ name, configs, dependencies, onNavigation, onEnd = result => result }) {
    this.pageManagers[name] = new Scrapper();

    await this.pageManagers[name].openBrowser(this.globalConfig.headless);

    this.moduleChunks[name] = chunk(configs, this.globalConfig.tabs);
    this.moduleQueues[name] = this.makeGenerator(name, dependencies, onNavigation);

    const response = await this.processQueue(name);
    const result = await onEnd(response);

    return { [name]: result };
  },
  /**
   * @param {string} moduleName
   * @param {number} index
   * @param {Promise<Object>} config
   */
  async runPage(moduleName, index, config) {
    try {
      return await this.pageManagers[moduleName].runPage(index, config);
    } catch (error) {
      return { error };
    }
  },
  /**
   * @param {string} moduleName
   * @returns {Promise<Object>}
   */
  async processQueue(moduleName) {
    let done = false, value = null;
    const responses = [];

    do {
      ({ done, value } = await this.moduleQueues[moduleName].next());
      if (value) { responses.push(...value); }
    } while (!done);

    return responses;
  },
  /**
   * @param {string} moduleName
   * @param {Object} dependencies
   * @param {function} exec
   * @yields {Promise<Object>}
   */
  async* makeGenerator(moduleName, dependencies, exec) {
    for await (const c of this.moduleChunks[moduleName]) {
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
