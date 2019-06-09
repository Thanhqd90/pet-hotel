const {
  testRequest,
} = require('../../../../api/shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/auth/queries/me', () => {
  let expectedUser;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    expectedUser = await fixtures.user.create('1');
  });

  describe('responds', () => {
    let user;

    beforeEach(async () => {
      let body = {
        query: `
            query {
              authMe {
                fullName  
                firstName
                lastName
                email
                roles
                avatars {                  
                  publicUrl
                }
              }
            }
          `,
      };

      user = (await testRequest(body)).authMe;
    });

    it('', () => {
      assert.equal(
        user.fullName,
        `${expectedUser.firstName} ${
          expectedUser.lastName
        }`,
      );
      assert.equal(user.firstName, expectedUser.firstName);
      assert.equal(user.lastName, expectedUser.lastName);
      assert.equal(user.email, expectedUser.email);
      assert.deepEqual(user.roles, []);
    });

    it('avatars', () => {
      assert(user.avatars);
      assert.equal(
        user.avatars[0].publicUrl,
        'http://path.path/avatar.jpg',
      );
    });
  });
});
