const {
  testRequest,
  testRequestError,
} = require('../../../../api/shared/utils/testRequest');
const UserRepository = require('../../../../database/repositories/userRepository');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/iamCreate', () => {
  let userOwner, userWithNoPermissions;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    userOwner = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    userWithNoPermissions = await fixtures.user.create('2');
  });

  it('creates', async () => {
    const expectedUser = fixtures.user.build('3');

    let body = {
      query: `
          mutation iamCreate($data: IamCreateInput!) {
            iamCreate(data: $data)
          }
        `,
      variables: {
        data: {
          emails: [expectedUser.email],
          roles: ['viewer'],
        },
      },
    };

    assert((await testRequest(body)).iamCreate);

    const user = await UserRepository.findByEmailWithoutAvatar(
      expectedUser.email,
    );

    assert.equal(user.roles.length, 1);
  });

  it('forbidden', async () => {
    let body = {
      query: `
        mutation iamCreate($data: IamCreateInput!) {
          iamCreate(data: $data)
        }
      `,
      variables: {
        data: {
          emails: [userWithNoPermissions.email],
          roles: ['owner', 'viewer'],
        },
      },
    };

    const error = await testRequestError(
      body,
      userWithNoPermissions.authenticationUid,
    );
    assert.equal(error.code, 403);
  });
});
