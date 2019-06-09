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

function bookingUpdateBody(id, data) {
  return {
    query:
      `
        mutation bookingUpdate($id: String!, $data: BookingInput!) {
          bookingUpdate(id: $id, data: $data) {
            ` +
      // Add attributes here
      `
          }
        }
      `,
    variables: {
      id,
      data,
    },
  };
}

async function bookingUpdateError(
  id,
  data,
  authenticationUid,
) {
  return testRequestError(
    bookingUpdateBody(id, data),
    authenticationUid,
  );
}

async function bookingUpdateSuccess(
  id,
  data,
  authenticationUid,
) {
  return (await testRequest(
    bookingUpdateBody(id, data),
    authenticationUid,
  )).bookingUpdate;
}

describe.skip('api/booking/bookingUpdate', () => {
  let currentUser, userWithNoPermissions, createdRecord;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');

    createdRecord = await fixtures.booking.create('1');
  });

  describe('success', () => {
    let expectedRecord;
    let record;

    beforeEach(async () => {
      expectedRecord = buildBooking('2', {
        // Add overrides here
      });

      record = await bookingUpdateSuccess(
        String(createdRecord.id),
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
      const error = await bookingUpdateError(
        '1',
        buildBooking('2'),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
