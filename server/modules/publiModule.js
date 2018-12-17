module.exports = {
  name: 'advertising-monitor',
  configs: require('./config/publiModule.json'),
  dependencies: {
    selector: '[data-voc-vam]'
  },
  exec: (dependencies, data, device) => {
    const { selector } = dependencies;
    const { pos_desktop: desktop, pos_mobile: mobile } = data;
    const positions = device === 'desktop' ? desktop : mobile;
    const vocVam = [...document.querySelectorAll(selector)]
      .map(({ dataset: { vocVamPosition } }) => vocVamPosition);
    const notExistingPositions = positions
      .filter(position => !vocVam.includes(position));
    const {
      vocento: {
        config: {
          vam: {
            media: { medio, tipoDispositivo: deviceType }
          }
        }
      },
      location: { href: url }
    } = window;

    return Promise.resolve({
      medio,
      url,
      deviceType,
      notExistingPositions
    });
  }
};
