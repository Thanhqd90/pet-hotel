const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

function petFindBody(id) {
  return {
    query:
      `
        query petFind($id: String!) {
          petFind(id: $id) {
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

async function petFindError(id, authenticationUid) {
  return testRequestError(
    petFindBody(id),
    authenticationUid,
  );
}

async function petFindSuccess(id, authenticationUid) {
  return (await testRequest(
    petFindBody(id),
    authenticationUid,
  )).petFind;
}

describe.skip('api/pet/petFind', () => {
  let currentUser, userWithNoPermissions, record1, record2;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');

    record1 = await fixtures.pet.create('1', {
      // Add overrides here
    });

    record2 = await fixtures.pet.create('2', {
      // Add overrides here
    });
  });

  describe('success', () => {
    let expectedRecord;
    let record;

    beforeEach(async () => {
      expectedRecord = fixtures.pet.build('2', {
        // Add overrides here
      });

      record = await petFindSuccess(
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
      const error = await petFindError(
        String(record1.id),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
