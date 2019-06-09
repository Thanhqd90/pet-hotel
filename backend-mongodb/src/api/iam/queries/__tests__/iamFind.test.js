const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function iamFindBody(id) {
  return {
    query: `
        query iamFind($id: String!) {
          iamFind(id: $id) {
            id
            email
            firstName
            lastName
            fullName
            phoneNumber
            avatars {
              id
              name
              publicUrl
            }
          }
        }
      `,
    variables: {
      id,
    },
  };
}

async function iamFindError(id, currentUserId) {
  return testRequestError(
    iamFindBody(id),
    currentUserId,
  );
}

async function iamFindSuccess(id, currentUserId) {
  return (await testRequest(iamFindBody(id), currentUserId))
    .iamFind;
}

describe('api/iam/iamFind', () => {
  let currentUser, userWithNoPermissions;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');
  });

  describe('success', () => {
    let expectedUser;
    let user;

    beforeEach(async () => {
      expectedUser = fixtures.user.build('1');

      user = await iamFindSuccess(
        currentUser.id,
        currentUser.authenticationUid,
      );
    });

    it('firstName', () => {
      assert.equal(user.firstName, expectedUser.firstName);
    });

    it('lastName', () => {
      assert.equal(user.lastName, expectedUser.lastName);
    });

    it('fullName', () => {
      assert.equal(
        user.fullName,
        `${expectedUser.firstName} ${
          expectedUser.lastName
        }`,
      );
    });

    it('avatars', () => {
      assert.equal(
        user.avatars[0].name,
        expectedUser.avatars[0].name,
      );
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await iamFindError(
        currentUser.id,
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
