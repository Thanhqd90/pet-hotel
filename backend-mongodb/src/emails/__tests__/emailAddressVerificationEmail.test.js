const EmailAddressVerificationEmail = require('../emailAddressVerificationEmail');
const assert = require('assert');

describe('emails/emailAddressVerificationEmail', () => {
  describe('en', () => {
    let email;

    before(() => {
      email = new EmailAddressVerificationEmail(
        'en',
        'john@test.test',
        'https://mock-link.com',
      );
    });

    it('projectName', () => {
      assert(email.html.includes('app.title'));
    });

    it('link', () => {
      assert(email.html.includes('https://mock-link.com'));
    });

    it('i18n', () => {
      assert(email.html.includes('Thanks'));
    });
  });

  describe('pt-BR', () => {
    let email;

    before(() => {
      email = new EmailAddressVerificationEmail(
        'pt-BR',
        'john@test.test',
        'https://mock-link.com',
      );
    });

    it('i18n', () => {
      assert(email.html.includes('Obrigado'));
    });
  });
});
