const PermissionChecker = require('../../../services/iam/permissionChecker');
const UserRepository = require('../../../database/repositories/userRepository');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  iamFind(id: String!): UserWithRoles!
`;

const resolver = {
  iamFind: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.iamRead);

    return UserRepository.findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
