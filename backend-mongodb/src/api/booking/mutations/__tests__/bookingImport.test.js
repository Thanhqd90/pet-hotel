const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const lodash = require('lodash');
const BookingRepository = require('../../../../database/repositories/bookingRepository');
const assert = require('assert');

function buildBooking(id, overrides) {
  return lodash.pick(fixtures.booking.build(id, overrides), [
    // Add attributes here
  ]);
}

function bookingImportBody(data, importHash) {
  return {
    query: `
        mutation bookingImport($data: BookingInput!, $importHash: String!) {
          bookingImport(data: $data, importHash: $importHash)
        }
      `,
    variables: {
      data,
      importHash,
    },
  };
}

async function bookingImportError(
  data,
  importHash,
  authenticationUid,
) {
  return testRequestError(
    bookingImportBody(data, importHash),
    authenticationUid,
  );
}

async function bookingImportSuccess(
  data,
  importHash,
  authenticationUid,
) {
  return (await testRequest(
    bookingImportBody(data, importHash),
    authenticationUid,
  )).bookingImport;
}

describe.skip('api/booking/bookingImport', () => {
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

      await bookingImportSuccess(
        expectedRecord,
        '1',
        currentUser.authenticationUid,
      );

      record = (await new BookingRepository().findAndCountAll())
        .rows[0];
    });

    // it('attribute', () => {
    //   assert.equal(record.attribute, expectedRecord.attribute);
    // });
  });

  describe('duplicate', () => {
    let expectedBooking;

    beforeEach(async () => {
      expectedBooking = buildBooking('1');

      await bookingImportSuccess(
        expectedBooking,
        '1',
        currentUser.authenticationUid,
      );
    });

    it('', async () => {
      const error = await bookingImportError(
        buildBooking('1'),
        '1',
        currentUser.authenticationUid,
      );

      assert.equal(error.code, 400);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingImportError(
        buildBooking('1'),
        '1',
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});

