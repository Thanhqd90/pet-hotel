const PetService = require('../../../services/petService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  petImport(data: PetInput!, importHash: String!): Boolean
`;

const resolver = {
  petImport: async (root, args, context) => {
    new PermissionChecker(context.language)
      .withRoles(context.roles)
      .validateHas(permissions.petImport);

    await new PetService().import(
      args.data,
      args.importHash,
      context.user,
      context.language,
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
