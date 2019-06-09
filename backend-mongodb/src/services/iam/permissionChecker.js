const assert = require('assert');
const ForbiddenError = require('../../errors/forbiddenError');

module.exports = class PermissionChecker {
  constructor(language) {
    this.language = language;
  }

  withRoles(currentUserRolesIds) {
    this.currentUserRolesIds = currentUserRolesIds || [];
    return this;
  }

  validateHas(permission) {
    if (!this.has(permission)) {
      throw new ForbiddenError(this.language);
    }
  }

  has(permission) {
    assert(permission, 'permission is required');

    return this.currentUserRolesIds.some((role) =>
      permission.allowedRoles.some(
        (allowedRole) => allowedRole === role,
      ),
    );
  }
};
