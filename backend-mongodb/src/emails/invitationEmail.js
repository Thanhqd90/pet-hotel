const config = require('../../config')();
const { i18n } = require('..//i18n');

module.exports = class InvitationEmail {
  constructor(language, to) {
    this.language = language;
    this.to = to;
  }

  get subject() {
    return i18n(
      this.language,
      'emails.invitation.subject',
      config.project.name,
    );
  }

  get html() {
    return i18n(
      this.language,
      'emails.invitation.body',
      config.project.name,
      `${config.project.clientUrl}/auth/signup?email=${
        this.to
      }`,
    );
  }
};
