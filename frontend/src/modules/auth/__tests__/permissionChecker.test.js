import PermissionChecker from 'modules/auth/permissionChecker';
import Roles from 'security/roles';
const roles = Roles.values;

describe('modules/auth/permissionChecker', () => {
  describe('contains user', () => {
    test('isAuthenticated', () => {
      const permissionChecker = new PermissionChecker({
        id: 1,
      });

      expect(permissionChecker.isAuthenticated).toBe(true);
    });

    test('rolesMatchOneOf user empty false', () => {
      const permissionChecker = new PermissionChecker({
        id: 1,
      });

      expect(
        permissionChecker.rolesMatchOneOf(roles.owner),
      ).toBe(false);
    });

    test('rolesMatchOneOf none matches', () => {
      const permissionChecker = new PermissionChecker({
        id: 1,
        roles: [roles.owner, roles.editor],
      });

      expect(
        permissionChecker.rolesMatchOneOf(roles.viewer),
      ).toBe(false);
    });

    test('hasRoles all true', () => {
      const permissionChecker = new PermissionChecker({
        id: 1,
        roles: [roles.owner, roles.editor],
      });

      expect(
        permissionChecker.rolesMatchOneOf([
          roles.owner,
          roles.editor,
        ]),
      ).toBe(true);
    });

    test('hasRoles some true', () => {
      const permissionChecker = new PermissionChecker({
        id: 1,
        roles: [roles.owner, roles.editor],
      });

      expect(
        permissionChecker.rolesMatchOneOf([
          roles.editor,
          roles.viewer,
        ]),
      ).toBe(true);
    });
  });

  describe('no user', () => {
    test('isAuthenticated', () => {
      const permissionChecker = new PermissionChecker(null);
      expect(permissionChecker.isAuthenticated).toBe(false);
    });
  });
});
