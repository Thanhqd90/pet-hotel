const {
  testRequest,
} = require('../../../../api/shared/utils/testRequest');
const AbstractRepository = require('../../../../database/repositories/abstractRepository');
const assert = require('assert');

describe('api/auth/queries/authIsEmailConfigured', () => {
  beforeEach(async () => {
    await AbstractRepository.cleanDatabase();
  });

  it('false', async () => {
    let body = {
      query: `
        query authIsEmailConfigured {
          authIsEmailConfigured
        }
      `,
    };

    assert((await testRequest(body)).authIsEmailConfigured);
  });
});
