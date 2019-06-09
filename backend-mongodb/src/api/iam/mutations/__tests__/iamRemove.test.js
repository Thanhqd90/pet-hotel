const {
  testRequest,
  testRequestError,
} = require('../../../../api/shared/utils/testRequest');
const UserRoleRepository = require('../../../../database/repositories/userRoleRepository');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/iamRemove', () => {
  let user1, user2;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    user1 = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    user2 = await fixtures.user.create('2', {
      roles: ['owner'],
    });
  });

  it('removes', async () => {
    let body = {
      query: `
          mutation iamRemove($emails: [String!]!, $roles: [String!]!) {
            iamRemove(emails: $emails, roles: $roles)
          }
        `,
      variables: {
        emails: [user2.email],
        roles: ['owner'],
      },
    };

    assert((await testRequest(body)).iamRemove);

    const userRoles = await UserRoleRepository.findAllByUser(
      user2.id,
    );

    assert.equal(userRoles.length, 0);
  });

  it('forbidden', async () => {
    let body = {
      query: `
          mutation iamRemove($emails: [String!]!, $roles: [String!]!) {
            iamRemove(emails: $emails, roles: $roles)
          }
        `,
      variables: {
        emails: [user1.email],
        roles: ['owner', 'viewer'],
      },
    };

    const error = await testRequestError(body, '2');
    assert.equal(error.code, 403);
  });
});
