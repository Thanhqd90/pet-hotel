const PetService = require('../../../services/petService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  petDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  petDestroy: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petDestroy);

    await new PetService().destroyAll(
      args.ids,
      context.user,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
