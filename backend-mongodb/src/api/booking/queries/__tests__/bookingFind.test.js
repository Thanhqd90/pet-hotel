const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function bookingFindBody(id) {
  return {
    query:
      `
        query bookingFind($id: String!) {
          bookingFind(id: $id) {
            id ` +
      // Add attributes here
      `
          }
        }
      `,
    variables: {
      id,
    },
  };
}

async function bookingFindError(id, authenticationUid) {
  return testRequestError(
    bookingFindBody(id),
    authenticationUid,
  );
}

async function bookingFindSuccess(id, authenticationUid) {
  return (await testRequest(
    bookingFindBody(id),
    authenticationUid,
  )).bookingFind;
}

describe.skip('api/booking/bookingFind', () => {
  let currentUser, userWithNoPermissions, record1, record2;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');

    record1 = await fixtures.booking.create('1', {
      // Add overrides here
    });

    record2 = await fixtures.booking.create('2', {
      // Add overrides here
    });
  });

  describe('success', () => {
    let expectedRecord;
    let record;

    beforeEach(async () => {
      expectedRecord = fixtures.booking.build('2', {
        // Add overrides here
      });

      record = await bookingFindSuccess(
        String(record2.id),
        currentUser.authenticationUid,
      );
    });

    // it('attribute', () => {
    //   assert.equal(record.attribute, expectedRecord.attribute);
    // });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingFindError(
        String(record1.id),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
