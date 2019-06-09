const PetService = require('../../../services/petService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  petUpdate(id: String!, data: PetInput!): Pet!
`;

const resolver = {
  petUpdate: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petEdit);

    return new PetService().update(
      args.id,
      args.data,
      context.user,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
