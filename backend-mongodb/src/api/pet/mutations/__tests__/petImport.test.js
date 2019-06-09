const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const lodash = require('lodash');
const PetRepository = require('../../../../database/repositories/petRepository');
const assert = require('assert');

function buildPet(id, overrides) {
  return lodash.pick(fixtures.pet.build(id, overrides), [
    // Add attributes here
  ]);
}

function petImportBody(data, importHash) {
  return {
    query: `
        mutation petImport($data: PetInput!, $importHash: String!) {
          petImport(data: $data, importHash: $importHash)
        }
      `,
    variables: {
      data,
      importHash,
    },
  };
}

async function petImportError(
  data,
  importHash,
  authenticationUid,
) {
  return testRequestError(
    petImportBody(data, importHash),
    authenticationUid,
  );
}

async function petImportSuccess(
  data,
  importHash,
  authenticationUid,
) {
  return (await testRequest(
    petImportBody(data, importHash),
    authenticationUid,
  )).petImport;
}

describe.skip('api/pet/petImport', () => {
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

      await petImportSuccess(
        expectedRecord,
        '1',
        currentUser.authenticationUid,
      );

      record = (await new PetRepository().findAndCountAll())
        .rows[0];
    });

    // it('attribute', () => {
    //   assert.equal(record.attribute, expectedRecord.attribute);
    // });
  });

  describe('duplicate', () => {
    let expectedPet;

    beforeEach(async () => {
      expectedPet = buildPet('1');

      await petImportSuccess(
        expectedPet,
        '1',
        currentUser.authenticationUid,
      );
    });

    it('', async () => {
      const error = await petImportError(
        buildPet('1'),
        '1',
        currentUser.authenticationUid,
      );

      assert.equal(error.code, 400);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await petImportError(
        buildPet('1'),
        '1',
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});

