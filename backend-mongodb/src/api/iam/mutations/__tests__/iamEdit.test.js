const {
  testRequest,
  testRequestError,
} = require('../../../../api/shared/utils/testRequest');
const UserRepository = require('../../../../database/repositories/userRepository');
const UserRoleRepository = require('../../../../database/repositories/userRoleRepository');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/iamEdit', () => {
  let userOwner, userWithNoPermissions, expectedUser;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    userOwner = await fixtures.user.create('1', {
      avatars: [],
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create(
      '2',
      { avatars: [] },
    );

    expectedUser = fixtures.user.build('1', {
      firstName: 'John EDITED',
      lastName: 'Doe EDITED',
      roles: ['owner', 'viewer'],
    });
  });

  describe('edit', () => {
    let user;

    beforeEach(async () => {
      let body = {
        query: `
        mutation iamEdit($data: IamEditInput!) {
          iamEdit(data: $data)
        }
        `,
        variables: {
          data: {
            id: userOwner.id,
            firstName: expectedUser.firstName,
            lastName: expectedUser.lastName,
            roles: expectedUser.roles,
            avatars: [
              {
                name: 'edited.jpg',
                sizeInBytes: 99,
                privateUrl: 'edited/edited.jpg',
                publicUrl:
                  'http://edited.edited/edited.jpg',
                new: true,
              },
            ],
          },
        },
      };

      assert((await testRequest(body)).iamEdit);

      user = await UserRepository.findById(userOwner.id);
    });

    it('', async () => {
      assert.equal(
        user.fullName,
        `${expectedUser.firstName} ${
          expectedUser.lastName
        }`,
      );

      assert.equal(
        (await UserRoleRepository.findAllByUser(user.id))
          .length,
        2,
      );
    });

    it('avatars', async () => {
      const avatars = user.avatars;
      assert(avatars);
      assert.equal(avatars[0].name, 'edited.jpg');
    });
  });

  it('forbidden', async () => {
    let body = {
      query: `
        mutation iamEdit($data: IamEditInput!) {
          iamEdit(data: $data)
        }
      `,
      variables: {
        data: {
          id: userOwner.id,
          firstName: expectedUser.firstName,
          lastName: expectedUser.lastName,
          roles: expectedUser.roles,
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
