const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function bookingAutocompleteBody(query, limit) {
  return {
    query: `
        query bookingAutocomplete($query: String, $limit: Int) {
          bookingAutocomplete(query: $query, limit: $limit) {
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

async function bookingAutocompleteError(
  query,
  limit,
  authenticationUid,
) {
  return testRequestError(
    bookingAutocompleteBody(query, limit),
    authenticationUid,
  );
}

async function bookingAutocompleteSuccess(
  query,
  limit,
  authenticationUid,
) {
  return (await testRequest(
    bookingAutocompleteBody(query, limit),
    authenticationUid,
  )).bookingAutocomplete;
}

describe.skip('api/booking/bookingAutocomplete', () => {
  let currentUser, userWithNoPermissions, records;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    userWithNoPermissions = await fixtures.user.create('2');

    records = await fixtures.booking.createAll();
  });

  describe('success', () => {
    describe('fields', () => {
      let expectedRecord;
      let record;

      beforeEach(async () => {
        expectedRecord = fixtures.booking.build('1');

        const result = await bookingAutocompleteSuccess(
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
        assert(record.label.includes(expectedRecord['id']));
      });
    });

    describe('order', () => {
      let result;

      beforeEach(async () => {
        result = await bookingAutocompleteSuccess(
          null,
          null,
          currentUser.authenticationUid,
        );
      });

      it('default id_ASC', () => {
        assert.equal(result[0].id, records[0].id);
      });
    });

    describe('query', () => {
      it('id', async () => {
        const expectedBooking = fixtures.booking.build('2');

        const result = await bookingAutocompleteSuccess(
          expectedBooking['id'],
          null,
          currentUser.authenticationUid,
        );

        assert(result[0].label.includes(expectedBooking['id']));
      });

      it('id', async () => {
        const result = await bookingAutocompleteSuccess(
          String(records[0].id),
          null,
          currentUser.authenticationUid,
        );

        assert.equal(result[0].id, records[0].id);
      });

      it('not found', async () => {
        const result = await bookingAutocompleteSuccess(
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
      const result = await bookingAutocompleteSuccess(
        null,
        1,
        currentUser.authenticationUid,
      );

      assert.equal(result.length, 1);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingAutocompleteError(
        null,
        null,
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
