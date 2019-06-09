const config = require('../../config')();
const { i18n } = require('..//i18n');

module.exports = class EmailAddressVerificationEmail {
  constructor(language, to, link) {
    this.language = language;
    this.to = to;
    this.link = link;
  }

  get subject() {
    return i18n(
      this.language,
      'emails.emailAddressVerification.subject',
      config.project.name,
    );
  }

  get html() {
    return i18n(
      this.language,
      'emails.emailAddressVerification.body',
      this.link,
      config.project.name,
    );
  }
};
