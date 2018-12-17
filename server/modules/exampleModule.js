module.exports = {
  name: 'example',
  configs: require('./config/exampleModule.json'),
  dependencies: {
    key: 'value'
  },
  exec: (dependencies, data, device) => {
    const { key } = dependencies;

    return Promise.resolve({
      device,
      key,
      valueForJSON: 'test',
      url: window.location.href,
      host: window.location.host
    });
  }
};
