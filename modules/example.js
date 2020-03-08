module.exports = {
  name: 'example',
  configs: require('./config/example.json'),
  dependencies: {
    key: 'value'
  },
  async onNavigation(dependencies, data, device) {
    try {
      const { key } = dependencies;
      const { foo = 'empty' } = data;

      return {
        foo,
        device,
        key,
        valueForJSON: 'test',
        url: window.location.href,
        host: window.location.host
      };
    } catch (error) {
      return { error: error.message, url: window.location.href };
    }
  },
  async onEnd(result) {
    return result;
  }
};
