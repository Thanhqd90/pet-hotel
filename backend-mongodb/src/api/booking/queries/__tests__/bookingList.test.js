const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function bookingListBody(filter, limit, offset, orderBy) {
  return {
    query:
      `
        query bookingList($filter: BookingFilterInput, $limit: Int, $offset: Int, $orderBy: BookingOrderByEnum) {
          bookingList(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy) {
            rows {
              id ` +
      // Add attributes here
      `
              createdAt
              updatedAt
            }
            count
          }
        }
      `,
    variables: {
      filter: filter,
      limit: limit || 0,
      offset: offset || 0,
      orderBy: orderBy || null,
    },
  };
}

async function bookingListError(
  filter,
  limit,
  offset,
  orderBy,
  authenticationUid,
) {
  return testRequestError(
    bookingListBody(filter, limit, offset, orderBy),
    authenticationUid,
  );
}

async function bookingListSuccess(
  filter,
  limit,
  offset,
  orderBy,
  authenticationUid,
) {
  return (await testRequest(
    bookingListBody(filter, limit, offset, orderBy),
    authenticationUid,
  )).bookingList;
}

describe.skip('api/booking/bookingList', () => {
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
    describe('fields', () => {
      let rows;
      let count;

      beforeEach(async () => {
        const response = await bookingListSuccess(
          null,
          null,
          null,
          null,
          currentUser.authenticationUid,
        );

        rows = response.rows;
        count = response.count;
      });

      // it('count', () => {
      //   assert.equal(count, 2);
      // });

      // it('attribute', () => {
      //   assert.equal(rows[0].attribute, record2.attribute);
      // });

      it('createdAt', () => {
        assert(rows[0].createdAt);
      });

      it('updatedAt', () => {
        assert(rows[0].updatedAt);
      });
    });

    describe('order', () => {
      async function expectFirstToMatchOrderBy(
        orderBy,
        id,
      ) {
        const { rows } = await bookingListSuccess(
          null,
          null,
          null,
          orderBy,
          currentUser.authenticationUid,
        );

        assert.equal(String(rows[0].id), id);
      }

      it('default createdAt_DESC', async () => {
        await expectFirstToMatchOrderBy(null, record2.id);
      });

      it('createdAt_ASC', async () => {
        await expectFirstToMatchOrderBy(
          'createdAt_ASC',
          record1.id,
        );
      });

      it('createdAt_DESC', async () => {
        await expectFirstToMatchOrderBy(
          'createdAt_DESC',
          record2.id,
        );
      });
    });

    describe('filter', () => {
      async function expectToMatchFilter(filter, id) {
        const { rows, count } = await bookingListSuccess(
          filter,
          null,
          null,
          null,
          currentUser.authenticationUid,
        );

        assert.equal(count, 1);
        assert.equal(String(rows[0].id), id);
      }

      async function expectToCount(filter, expectedCount) {
        const { count } = await bookingListSuccess(
          filter,
          null,
          null,
          null,
          currentUser.authenticationUid,
        );

        assert.equal(count, expectedCount);
      }

      let expectedBooking;

      beforeEach(async () => {
        expectedBooking = fixtures.booking.build('2');
      });

      // it('attribute', async () => {
      //   await expectToMatchFilter(
      //     {
      //       attribute: expectedBooking.attribute,
      //     },
      //     record2.id,
      //   );
      // });
    });

    describe('limit', () => {
      it('', async () => {
        const { rows, count } = await bookingListSuccess(
          null,
          1,
          null,
          null,
          currentUser.authenticationUid,
        );

        assert.equal(count, 2);
        assert.equal(rows.length, 1);
      });
    });

    describe('offset', () => {
      it('', async () => {
        const { rows, count } = await bookingListSuccess(
          null,
          null,
          1,
          'createdAt_ASC',
          currentUser.authenticationUid,
        );

        assert.equal(count, 2);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].id, record2.id);
      });
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await bookingListError(
        null,
        null,
        null,
        null,
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
