const InvitationEmail = require('../invitationEmail');
const assert = require('assert');

describe('emails/invitationEmail', () => {
  describe('en', () => {
    let email;

    before(() => {
      email = new InvitationEmail('en', 'john@test.test');
    });

    it('projectName', () => {
      assert(email.html.includes('app.title'));
    });

    it('link', () => {
      assert(
        email.html.includes(
          'http://localhost:3000/auth/signup?email=john@test.test',
        ),
      );
    });

    it('i18n', () => {
      assert(email.html.includes('Thanks'));
    });
  });

  describe('pt-BR', () => {
    let email;

    before(() => {
      email = new InvitationEmail(
        'pt-BR',
        'john@test.test',
      );
    });

    it('i18n', () => {
      assert(email.html.includes('Obrigado'));
    });
  });
});
