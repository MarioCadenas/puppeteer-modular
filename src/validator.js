class ValidationError extends Error {
  constructor(props) {
    super(props.message);
    this.data = props.data;
  }

  static validateUrl(url) {
    const regExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;
    const reg = new RegExp(regExp);

    if (!url || !reg.test(url)) {
      throw new ValidationError({
        message: 'Invalid url',
        data: { url }
      });
    }
    return url;
  }
}

module.exports = ValidationError;
