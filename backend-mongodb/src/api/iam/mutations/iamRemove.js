const IamRemover = require('../../../services/iam/iamRemover');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  iamRemove(emails: [ String! ]!, roles: [ String! ]!, all: Boolean): Boolean
`;

const resolver = {
  iamRemove: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.iamEdit);

    let remover = new IamRemover(
      context.user,
      context.language,
    );

    await remover.removeAll(args);

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
