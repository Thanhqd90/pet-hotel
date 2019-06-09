const {
  testRequest,
  testRequestError,
} = require('../../../shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const PetRepository = require('../../../../database/repositories/petRepository');
const assert = require('assert');

function petDestroyBody(ids) {
  return {
    query: `
        mutation petDestroy($ids: [String!]!) {
          petDestroy(ids: $ids)
        }
      `,
    variables: {
      ids,
    },
  };
}

async function petDestroyError(ids, authenticationUid) {
  return testRequestError(
    petDestroyBody(ids),
    authenticationUid,
  );
}

async function petDestroySuccess(ids, authenticationUid) {
  return (await testRequest(
    petDestroyBody(ids),
    authenticationUid,
  )).petDestroy;
}

describe.skip('api/pet/petDestroy', () => {
  let currentUser, userWithNoPermissions, records;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');

    records = await fixtures.pet.createAll();
  });

  describe('success', () => {
    it('one', async () => {
      await petDestroySuccess(
        [String(records[0].id)],
        currentUser.authenticationUid,
      );

      const {
        rows,
        count,
      } = await new PetRepository().findAndCountAll();
      assert.equal(count, 1);
      assert.equal(String(rows[0].id), records[1].id);
    });

    it('all', async () => {
      await petDestroySuccess(
        [String(records[0].id), String(records[1].id)],
        currentUser.authenticationUid,
      );

      const {
        count,
      } = await new PetRepository().findAndCountAll();
      assert.equal(count, 0);
    });
  });

  describe('forbidden', () => {
    it('', async () => {
      const error = await petDestroyError(
        String(records[0].id),
        userWithNoPermissions.authenticationUid,
      );

      assert.equal(error.code, 403);
    });
  });
});
