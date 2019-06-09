const {
  testRequest,
  testRequestError,
} = require('../../../../api/shared/utils/testRequest');
const UserRepository = require('../../../../database/repositories/userRepository');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/iamChangeStatus', () => {
  let userOwner, userWithNoPermissions;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    userOwner = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    userWithNoPermissions = await fixtures.user.create('2');
  });

  describe('success', () => {
    async function testSuccess(disabled) {
      let body = {
        query: `
            mutation iamChangeStatus($ids: [String!]!, $disabled: Boolean) {
              iamChangeStatus(ids: $ids, disabled: $disabled)
            }
          `,
        variables: {
          ids: [userWithNoPermissions.id],
          disabled,
        },
      };

      assert((await testRequest(body)).iamChangeStatus);

      const user = await UserRepository.findById(
        userWithNoPermissions.id,
      );

      assert.equal(user.disabled, disabled);
    }

    it('disables', async () => {
      await testSuccess(true);
    });

    it('enables', async () => {
      await testSuccess(true);
      await testSuccess(false);
    });
  });

  describe('failure', () => {
    it('forbidden', async () => {
      let body = {
        query: `
          mutation iamChangeStatus($ids: [String!]!, $disabled: Boolean) {
            iamChangeStatus(ids: $ids, disabled: $disabled)
          }
          `,
        variables: {
          ids: [userOwner.id],
          disabled: true,
        },
      };

      const error = await testRequestError(body, '2');
      assert.equal(error.code, 403);
    });
  });
});
