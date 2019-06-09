const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const lodash = require('lodash');
const assert = require('assert');

function buildPet(id, overrides) {
  return lodash.pick(fixtures.pet.build(id, overrides), [
    // Add attributes here
  ]);
}

function petCreateBody(data) {
  return {
    query:
      `
        mutation petCreate($data: PetInput!) {
          petCreate(data: $data) {
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

async function petCreateError(data, authenticationUid) {
  return testRequestError(
    petCreateBody(data),
    authenticationUid,
  );
}

async function petCreateSuccess(data, authenticationUid) {
  return (await testRequest(
    petCreateBody(data),
    authenticationUid,
  )).petCreate;
}

describe.skip('api/pet/petCreate', () => {
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
      expectedRecord = buildPet('1', {
        // Add overrides here
      });

      record = await petCreateSuccess(
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
      const error = await petCreateError(
        buildPet('1'),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
