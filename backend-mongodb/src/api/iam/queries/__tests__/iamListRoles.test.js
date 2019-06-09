const {
  testRequest,
} = require('../../../../api/shared/utils/testRequest');
const fixtures = require('../../../../__fixtures__');
const assert = require('assert');

describe('api/iam/queries/iamListRoles', () => {
  let owner1, owner2, viewer;

  before(() => {});

  beforeEach(async () => {
    await fixtures.cleanDatabase();
    owner1 = await fixtures.user.create('1', {
      roles: ['owner'],
    });
    owner2 = await fixtures.user.create('2', {
      roles: ['owner'],
    });
    viewer = await fixtures.user.create('3', {
      roles: ['viewer'],
    });
  });

  it('lists', async () => {
    let body = {
      query: `
            query {
              iamListRoles {
                role,
                users {
                  fullName
                  firstName
                  lastName
                  email
                }
              }
            }          
          `,
    };

    const rolesWithUsers = (await testRequest(body))
      .iamListRoles;

    assert.equal(rolesWithUsers.length, 2);

    const ownerRoleWithUsers = rolesWithUsers.find(
      (roleWithUsers) => roleWithUsers.role === 'owner',
    );

    assert.equal(ownerRoleWithUsers.users.length, 2);

    const viewerRoleWithUsers = rolesWithUsers.find(
      (roleWithUsers) => roleWithUsers.role === 'viewer',
    );

    assert.equal(viewerRoleWithUsers.users.length, 1);
  });

  it('role filter', async () => {
    let body = {
      query: `
        query {
          iamListRoles(filter: {role: "viewer"}) {
            role,
            users {
              fullName
              firstName
              lastName
              email
            }
          }
        }          
      `,
    };

    const rolesWithUsers = (await testRequest(body))
      .iamListRoles;

    assert.equal(rolesWithUsers.length, 1);
    assert.equal(rolesWithUsers[0].role, 'viewer');
  });

  it('role order', async () => {
    let body = {
      query: `
        query {
          iamListRoles(orderBy: role_DESC) {
            role,
            users {
              fullName
              firstName
              lastName
              email
            }
          }
        }          
      `,
    };

    const rolesWithUsers = (await testRequest(body))
      .iamListRoles;

    assert.equal(rolesWithUsers[0].role, 'viewer');
  });
});
