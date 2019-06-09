const {
  testRequest,
} = require('../../../../api/shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const AuthService = require('../../../../auth/authService');
const assert = require('assert');

describe('api/iam/queries/iamListUsers', () => {
  let owner1, owner2, viewer;

  beforeEach(async () => {
    await fixtures.cleanDatabase();

    await AuthService._updateEmailForTests(
      '1',
      'a@test.test',
    );

    owner1 = await fixtures.user.create('1', {
      firstName: 'a',
      lastName: 'a',
      email: 'a@test.test',
      roles: ['owner'],
    });

    owner2 = await fixtures.user.create('2', {
      firstName: 'a',
      lastName: 'c',
      email: 'c@test.test',
      roles: ['owner'],
    });

    viewer = await fixtures.user.create('3', {
      firstName: 'a',
      lastName: 'b',
      email: 'b@test.test',
      roles: ['viewer'],
    });
  });

  afterEach(() => {
    AuthService._resetForTests();
  });

  it('lists', async () => {
    let body = {
      query: `
        query {
          iamListUsers {
            count,
            rows {
              fullName
              email
            }
          }
        }          
      `,
    };

    const page = (await testRequest(body)).iamListUsers;
    assert.equal(page.count, 3);
    assert.equal(page.rows.length, 3);
  });

  it('limits', async () => {
    let body = {
      query: `
        query {
          iamListUsers(limit: 1) {
            count,
            rows {
              fullName
              email
            }
          }
        }          
      `,
    };

    const page = (await testRequest(body)).iamListUsers;
    assert.equal(page.count, 3);
    assert.equal(page.rows.length, 1);
  });

  describe('filters', () => {
    it('name', async () => {
      let body = {
        query: `
          query {
            iamListUsers(filter: { fullName: "c" }) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 1);
      assert.equal(page.rows.length, 1);
      assert.equal(page.rows[0].fullName, 'a c');
    });

    it('email', async () => {
      let body = {
        query: `
          query {
            iamListUsers(filter: { email: "a@test" }) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 1);
      assert.equal(page.rows.length, 1);
      assert.equal(page.rows[0].email, 'a@test.test');
    });

    it('role', async () => {
      let body = {
        query: `
          query {
            iamListUsers(filter: { role: "viewer" }) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 1);
      assert.equal(page.rows.length, 1);
      assert.equal(page.rows[0].fullName, viewer.fullName);
    });

    it('fullName/email/role', async () => {
      let body = {
        query: `
          query {
            iamListUsers(filter: { fullName: "a a", email: "a@test.test", role: "owner" }) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 1);
      assert.equal(page.rows.length, 1);
      assert.equal(page.rows[0].fullName, 'a a');
    });
  });

  describe('orders', () => {
    it('name', async () => {
      let body = {
        query: `
          query {
            iamListUsers(limit: 1, orderBy: fullName_DESC) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 3);
      assert.equal(page.rows[0].fullName, 'a c');
    });

    it('email', async () => {
      let body = {
        query: `
          query {
            iamListUsers(limit: 1, orderBy: email_DESC) {
              count,
              rows {
                fullName
                email
              }
            }
          }          
        `,
      };

      const page = (await testRequest(body)).iamListUsers;
      assert.equal(page.count, 3);
      assert.equal(page.rows[0].email, 'c@test.test');
    });
  });
});
