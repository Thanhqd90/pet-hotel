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

function petUpdateBody(id, data) {
  return {
    query:
      `
        mutation petUpdate($id: String!, $data: PetInput!) {
          petUpdate(id: $id, data: $data) {
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

async function petUpdateError(
  id,
  data,
  authenticationUid,
) {
  return testRequestError(
    petUpdateBody(id, data),
    authenticationUid,
  );
}

async function petUpdateSuccess(
  id,
  data,
  authenticationUid,
) {
  return (await testRequest(
    petUpdateBody(id, data),
    authenticationUid,
  )).petUpdate;
}

describe.skip('api/pet/petUpdate', () => {
  let currentUser, userWithNoPermissions, createdRecord;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');

    createdRecord = await fixtures.pet.create('1');
  });

  describe('success', () => {
    let expectedRecord;
    let record;

    beforeEach(async () => {
      expectedRecord = buildPet('2', {
        // Add overrides here
      });

      record = await petUpdateSuccess(
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
      const error = await petUpdateError(
        '1',
        buildPet('2'),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
