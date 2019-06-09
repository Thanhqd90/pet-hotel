const fixtures = require('../../__fixtures__');
const StorageTokenGenerator = require('../storageTokenGenerator');
const assert = require('assert');

describe('services/auth/storageTokenGenerator', () => {
  let owner, viewer;

  before(async () => {});

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    owner = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    viewer = await fixtures.user.create('2', {
      roles: ['owner'],
    });
  });

  it('has permission', async () => {
    assert(
      (await new StorageTokenGenerator('en', owner, [
        'owner',
      ]).generateStorageToken()).includes('user'),
    );
  });

  it('empty permissions', async () => {
    assert.equal(
      await new StorageTokenGenerator('en', viewer, [
        'viewer',
      ]).generateStorageToken(),
      '',
    );
  });
});
