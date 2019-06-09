const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const BookingRepository = require('../../../../database/repositories/bookingRepository');
const assert = require('assert');

function bookingDestroyBody(ids) {
  return {
    query: `
        mutation bookingDestroy($ids: [String!]!) {
          bookingDestroy(ids: $ids)
        }
      `,
    variables: {
      ids,
    },
  };
}

async function bookingDestroyError(ids, authenticationUid) {
  return testRequestError(
    bookingDestroyBody(ids),
    authenticationUid,
  );
}

async function bookingDestroySuccess(ids, authenticationUid) {
  return (await testRequest(
    bookingDestroyBody(ids),
    authenticationUid,
  )).bookingDestroy;
}

describe.skip('api/booking/bookingDestroy', () => {
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
    it('one', async () => {
      await bookingDestroySuccess(
        [String(records[0].id)],
        currentUser.authenticationUid,
      );

      const {
        rows,
        count,
      } = await new BookingRepository().findAndCountAll();
      assert.equal(count, 1);
      assert.equal(String(rows[0].id), records[1].id);
    });

    it('all', async () => {
      await bookingDestroySuccess(
        [String(records[0].id), String(records[1].id)],
        currentUser.authenticationUid,
      );

      const {
        count,
      } = await new BookingRepository().findAndCountAll();
      assert.equal(count, 0);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingDestroyError(
        String(records[0].id),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
