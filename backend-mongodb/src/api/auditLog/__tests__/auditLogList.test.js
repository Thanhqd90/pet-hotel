const {
  testRequest,
} = require('../../../api/shared/utils/testRequest');
const moment = require('moment');
const fixtures = require('../../../__fixtures__');
const IamCreator = require('../../../services/iam/iamCreator');
const assert = require('assert');

async function testFilter(filter) {
  let body = {
    query: `
      query AUDIT_LOG_LIST ($filter: AuditLogListFilterInput){
        auditLogList(filter: $filter) {
          count,
          rows {
            id
            entityName
            entityId
            action
            timestamp
            values
          }
        }
      } `,
    variables: {
      filter,
    },
  };

  return (await testRequest(body)).auditLogList;
}

describe('api/auditLog/queries/auditLogList', () => {
  let currentUser;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    currentUser = await fixtures.user.create('1', {
      roles: ['owner'],
    });

    // create logs
    await new IamCreator(currentUser, 'en').execute({
      emails: ['new-user@test.test'],
      roles: ['owner', 'editor'],
    });

    await new IamCreator(currentUser, 'en').execute({
      emails: ['new-user-2@test.test'],
      roles: ['owner', 'editor'],
    });

    await new IamCreator(currentUser, 'en').execute({
      emails: ['new-user-3@test.test'],
      roles: ['owner', 'editor'],
    });
  });

  it('lists', async () => {
    let body = {
      query: `
        query {
          auditLogList {
            count,
            rows {
              id
              entityName
              entityId
              action
              timestamp
              values
            }
          }
        }          
      `,
    };

    const page = (await testRequest(body)).auditLogList;
    assert.equal(page.count, 4);
    assert.equal(page.rows.length, 4);
  });

  it('limits', async () => {
    let body = {
      query: `
        query {
          auditLogList(limit: 1) {
            count,
            rows {
              id
              entityName
              entityId
              action
              timestamp
              values
            }
          }
        } 
      `,
    };

    const page = (await testRequest(body)).auditLogList;
    assert.equal(page.count, 4);
    assert.equal(page.rows.length, 1);
  });

  describe('filters', () => {
    it('entityNames', async () => {
      const page = await testFilter({
        entityNames: ['users', 'user'],
      });

      assert.equal(page.count, 4);
      assert.equal(page.rows.length, 4);
      assert(
        ['users', 'user'].includes(page.rows[0].entityName),
      );
    });

    it('action', async () => {
      const page = await testFilter({
        action: 'delete',
      });

      assert.equal(page.count, 0);
      assert.equal(page.rows.length, 0);
    });

    describe('timestampStart', () => {
      it('results', async () => {
        const page = await testFilter({
          timestampRange: [
            moment()
              .subtract(1, 'hour')
              .toISOString(),
          ],
        });

        assert.equal(page.count, 4);
      });

      it('no results', async () => {
        const page = await testFilter({
          timestampRange: [
            moment()
              .add(1, 'minute')
              .toISOString(),
          ],
        });

        assert.equal(page.count, 0);
      });
    });

    describe('timestampEnd', () => {
      it('results', async () => {
        const page = await testFilter({
          timestampRange: [null, moment().toISOString()],
        });

        assert.equal(page.count, 4);
      });

      it('no results', async () => {
        const page = await testFilter({
          timestampRange: [
            null,
            moment()
              .subtract(1, 'hour')
              .toISOString(),
          ],
        });

        assert.equal(page.count, 0);
      });
    });

    describe('timestampPeriod', () => {
      it('results', async () => {
        const page = await testFilter({
          timestampRange: [
            moment()
              .subtract(1, 'hour')
              .toISOString(),
            ,
            moment().toISOString(),
          ],
        });

        assert.equal(page.count, 4);
      });

      it('no results', async () => {
        const page = await testFilter({
          timestampRange: [
            moment()
              .subtract(2, 'hours')
              .toISOString(),
            moment()
              .subtract(1, 'hour')
              .toISOString(),
          ],
        });

        assert.equal(page.count, 0);
      });
    });
  });
});
