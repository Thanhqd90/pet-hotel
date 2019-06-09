const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function petAutocompleteBody(query, limit) {
  return {
    query: `
        query petAutocomplete($query: String, $limit: Int) {
          petAutocomplete(query: $query, limit: $limit) {
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

async function petAutocompleteError(
  query,
  limit,
  authenticationUid,
) {
  return testRequestError(
    petAutocompleteBody(query, limit),
    authenticationUid,
  );
}

async function petAutocompleteSuccess(
  query,
  limit,
  authenticationUid,
) {
  return (await testRequest(
    petAutocompleteBody(query, limit),
    authenticationUid,
  )).petAutocomplete;
}

describe.skip('api/pet/petAutocomplete', () => {
  let currentUser, userWithNoPermissions, records;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    userWithNoPermissions = await fixtures.user.create('2');

    records = await fixtures.pet.createAll();
  });

  describe('success', () => {
    describe('fields', () => {
      let expectedRecord;
      let record;

      beforeEach(async () => {
        expectedRecord = fixtures.pet.build('1');

        const result = await petAutocompleteSuccess(
          null,
          null,
          currentUser.authenticationUid,
        );

        record = result.find(
          (record) =>
            String(record.id) === String(records[0].id),
        );
      });

      it('label', () => {
        assert(record.label.includes(expectedRecord['name']));
      });
    });

    describe('order', () => {
      let result;

      beforeEach(async () => {
        result = await petAutocompleteSuccess(
          null,
          null,
          currentUser.authenticationUid,
        );
      });

      it('default name_ASC', () => {
        assert.equal(result[0].id, records[0].id);
      });
    });

    describe('query', () => {
      it('name', async () => {
        const expectedPet = fixtures.pet.build('2');

        const result = await petAutocompleteSuccess(
          expectedPet['name'],
          null,
          currentUser.authenticationUid,
        );

        assert(result[0].label.includes(expectedPet['name']));
      });

      it('id', async () => {
        const result = await petAutocompleteSuccess(
          String(records[0].id),
          null,
          currentUser.authenticationUid,
        );

        assert.equal(result[0].id, records[0].id);
      });

      it('not found', async () => {
        const result = await petAutocompleteSuccess(
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
      const result = await petAutocompleteSuccess(
        null,
        1,
        currentUser.authenticationUid,
      );

      assert.equal(result.length, 1);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await petAutocompleteError(
        null,
        null,
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
