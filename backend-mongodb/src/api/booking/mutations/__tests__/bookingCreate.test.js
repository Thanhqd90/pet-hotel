const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const lodash = require('lodash');
const assert = require('assert');

function buildBooking(id, overrides) {
  return lodash.pick(fixtures.booking.build(id, overrides), [
    // Add attributes here
  ]);
}

function bookingCreateBody(data) {
  return {
    query:
      `
        mutation bookingCreate($data: BookingInput!) {
          bookingCreate(data: $data) {
            ` +
      // Add attributes here
      `
          }
        }
      `,
    variables: {
      data,
    },
  };
}

async function bookingCreateError(data, authenticationUid) {
  return testRequestError(
    bookingCreateBody(data),
    authenticationUid,
  );
}

async function bookingCreateSuccess(data, authenticationUid) {
  return (await testRequest(
    bookingCreateBody(data),
    authenticationUid,
  )).bookingCreate;
}

describe.skip('api/booking/bookingCreate', () => {
  let currentUser, userWithNoPermissions;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');
  });

  describe('success', () => {
    let expectedRecord;
    let record;

    beforeEach(async () => {
      expectedRecord = buildBooking('1', {
        // Add overrides here
      });

      record = await bookingCreateSuccess(
        expectedRecord,
        currentUser.authenticationUid,
      );
    });

    // it('attribute', () => {
    //   assert.equal(record.attribute, expectedRecord.attribute);
    // });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingCreateError(
        buildBooking('1'),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
