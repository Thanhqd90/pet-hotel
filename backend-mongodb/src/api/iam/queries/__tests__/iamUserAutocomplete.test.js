const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function iamUserAutocompleteBody(query, limit) {
  return {
    query: `
        query iamUserAutocomplete($query: String, $limit: Int) {
          iamUserAutocomplete(query: $query, limit: $limit) {
            id
            label
          }
        }
      `,
    variables: {
      query: query || '',
      limit: limit || 0,
    },
  };
}

async function iamUserAutocompleteError(
  query,
  limit,
  currentUserId,
) {
  return testRequestError(
    iamUserAutocompleteBody(query, limit),
    currentUserId,
  );
}

async function iamUserAutocompleteSuccess(
  query,
  limit,
  currentUserId,
) {
  return (await testRequest(
    iamUserAutocompleteBody(query, limit),
    currentUserId,
  )).iamUserAutocomplete;
}

describe('api/user/iamUserAutocomplete', () => {
  let currentUser, userWithNoPermissions;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    userWithNoPermissions = await fixtures.user.create('2');
  });

  describe('success', () => {
    describe('fields', () => {
      let expectedUser;
      let item;

      beforeEach(async () => {
        expectedUser = fixtures.user.build('1');

        const result = await iamUserAutocompleteSuccess(
          null,
          null,
          currentUser.authenticationUid,
        );

        item = result.find(
          (item) =>
            String(item.id) === String(currentUser.id),
        );
      });

      it('label', () => {
        assert(item.label.includes(expectedUser.firstName));
        assert(item.label.includes(expectedUser.email));
      });
    });

    describe('order', () => {
      let result;

      beforeEach(async () => {
        result = await iamUserAutocompleteSuccess(
          null,
          null,
          currentUser.authenticationUid,
        );
      });

      it('default fullName_ASC', () => {
        assert(
          String(result[0].id),
          String(currentUser.id),
        );
      });
    });

    describe('query', () => {
      it('email', async () => {
        const expectedUser = fixtures.user.build('1');

        const result = await iamUserAutocompleteSuccess(
          expectedUser.email,
          null,
          currentUser.authenticationUid,
        );

        assert(
          result[0].label.includes(expectedUser.email),
        );
      });

      it('firstName', async () => {
        const expectedUser = fixtures.user.build('2');

        const result = await iamUserAutocompleteSuccess(
          expectedUser.firstName,
          null,
          currentUser.authenticationUid,
        );

        assert(
          result[0].label.includes(expectedUser.firstName),
        );
      });

      it('not found', async () => {
        const result = await iamUserAutocompleteSuccess(
          'not found',
          null,
          currentUser.authenticationUid,
        );

        assert.equal(result.length, 0);
      });
    });
  });

  describe('limit', () => {
    it('', async () => {
      const result = await iamUserAutocompleteSuccess(
        null,
        1,
        currentUser.authenticationUid,
      );

      assert.equal(result.length, 1);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await iamUserAutocompleteError(
        null,
        null,
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
