const {
  testRequest,
} = require('../../../../api/shared/utils/testRequest');
const UserRepository = require('../../../../database/repositories/userRepository');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/iamImport', () => {
  let userOwner;

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    userOwner = await fixtures.user.create('1', {
      roles: ['owner'],
    });
  });

  it('imports', async () => {
    const expectedUser = fixtures.user.build('2');

    let body = {
      query: `
        mutation iamImport(
          $data: IamImportInput!
          $importHash: String!
        ) {
          iamImport(
            data: $data
            importHash: $importHash
          )
        }`,
      variables: {
        data: {
          email: expectedUser.email,
          firstName: expectedUser.firstName,
          lastName: expectedUser.lastName,
          phoneNumber: expectedUser.phoneNumber,
          avatars: expectedUser.avatars,
          roles: ['viewer'],
        },
        importHash: 'hash',
      },
    };

    assert((await testRequest(body)).iamImport);

    const user = await UserRepository.findByEmailWithoutAvatar(
      expectedUser.email,
    );

    assert.equal(user.roles.length, 1);
  });
});
