const PasswordResetEmail = require('../passwordResetEmail');
const assert = require('assert');

describe('emails/passwordResetEmail', () => {
  describe('en', () => {
    let email;

    before(() => {
      email = new PasswordResetEmail(
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
      email = new PasswordResetEmail(
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
